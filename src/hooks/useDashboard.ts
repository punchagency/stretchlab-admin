import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChartFilters, getChartData, getUserTableData, getDashboardMetrics } from "@/service/dashboard";
import type {
  ChartFiltersResponse,
  ChartDataPoint,
  ChartDataResponse,
  UserTableResponse,
  DashboardMetricsResponse,
  FilterState,
  FilterOptions,
  MetricCardData
} from "@/types";

export const useDashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    filterBy: "By Location",
    duration: "Weekly",
    location: "All",
    flexologist: "All",
    dataset: "",
  });

  const {
    data: dashboardMetricsData,
    isLoading: isMetricsLoading,
    error: metricsError,
  } = useQuery<DashboardMetricsResponse>({
    queryKey: ['dashboardMetrics'],
    queryFn: getDashboardMetrics,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  
  const {
    data: chartFiltersData,
    isLoading: isFiltersLoading,
    error: filtersError,
  } = useQuery<ChartFiltersResponse>({
    queryKey: ['chartFilters'],
    queryFn: getChartFilters,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: userTableData,
    isLoading: isTableLoading,
    error: tableError,
  } = useQuery<UserTableResponse>({
    queryKey: ['userTableData'],
    queryFn: getUserTableData,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const processFilterOptions = () => {
    const filterOptions: FilterOptions = {
      filterBy: ["By Location", "By Flexologist"],
      duration: ["Weekly", "Monthly", "Yearly"],
      location: ["All"],
      flexologist: ["All"],
      dataset: [],
    };

    let filtersMap = {
      datasetMap: new Map<string, string>(),
      flexologistMap: new Map<string, number>(),
    };

    if (chartFiltersData?.status === "success") {
      const { filters, flexologists, locations } = chartFiltersData.data;
      
      filtersMap.datasetMap = new Map(filters.map(f => [f.label, f.value]));
      filtersMap.flexologistMap = new Map(flexologists.map(f => [f.full_name, f.id]));
      
      const datasetOptions = filters.map(filter => filter.label);
      const flexologistOptions = ["All", ...flexologists.map(flex => flex.full_name)];
      const locationOptions = ["All", ...locations
        .filter(loc => loc.locations !== null)
        .map(loc => loc.locations as string)
      ];
      
      filterOptions.dataset = datasetOptions;
      filterOptions.flexologist = flexologistOptions;
      filterOptions.location = locationOptions;

      // Set default dataset if not already set
      if (datasetOptions.length > 0 && !selectedFilters.dataset) {
        setSelectedFilters(prev => ({
          ...prev,
          dataset: datasetOptions[0],
        }));
      }
    }

    return { filterOptions, filtersMap };
  };

  const getChartDataParams = () => {
    const { filtersMap } = processFilterOptions();
    
    if (!selectedFilters.dataset) return null;
    
    const params: any = {
      duration: selectedFilters.duration,
      dataset: filtersMap.datasetMap.get(selectedFilters.dataset) || selectedFilters.dataset,
      filterBy: selectedFilters.filterBy,
    };

    if (selectedFilters.filterBy === "By Location") {
      params.location = selectedFilters.location;
    } else if (selectedFilters.filterBy === "By Flexologist") {
      if (selectedFilters.flexologist !== "All") {
        params.flexologist = filtersMap.flexologistMap.get(selectedFilters.flexologist);
      }
    }

    return params;
  };

  const chartDataParams = getChartDataParams();
  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
  } = useQuery<ChartDataResponse>({
    queryKey: ['chartData', chartDataParams],
    queryFn: () => getChartData(chartDataParams!),
    enabled: !!chartDataParams,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const generateDashboardMetrics = (): MetricCardData[] => [
    {
      title: "Revenue",
      value: dashboardMetricsData?.data?.balance_info?.month_transactions 
        ? `$${dashboardMetricsData.data.balance_info.month_transactions.toFixed(2)}`
        : "$0.00",
      subtitle: "This Month",
      buttonText: "View Details",
      buttonVariant: "primary",
      showCurrency: true,
    },
    {
      title: "Bookings",
      value: dashboardMetricsData?.data?.bookings_info?.bookings_in_month
        ? `${dashboardMetricsData.data.bookings_info.bookings_in_month}`
        : "0",
      subtitle: dashboardMetricsData?.data?.bookings_info
        ? `${dashboardMetricsData.data.bookings_info.upwards_trend ? '+' : dashboardMetricsData.data.bookings_info.neutral_trend ? '' : '-'}${dashboardMetricsData.data.bookings_info.aggregation} Total`
        : "No data",
      buttonText: "See Sessions",
      buttonVariant: "primary",
      showCurrency: false,
    },
    {
      title: "Security Incidents",
      value: "87%",
      subtitle: "+1% Vs Last Month",
      buttonText: "Utilization",
      buttonVariant: "primary",
      showCurrency: false,
    }
    // {
    //   title: "System Uptime",
    //   value: "+54",
    //   subtitle: "Excellent",
    //   buttonText: "Growth",
    //   buttonVariant: "primary",
    //   showCurrency: false,
    // },
  ];

  const calculateMaxValue = (data: ChartDataPoint[]) => {
    if (!data || data.length === 0) return 100;
    
    const validValues = data
      .map(d => d.value)
      .filter(value => typeof value === 'number' && !isNaN(value) && value >= 0);
    
    if (validValues.length === 0) return 100;
    
    const maxValue = Math.max(...validValues);
    if (maxValue === 0) return 100;
    
    if (maxValue < 10) {
      return Math.ceil(maxValue * 1.2);
    } else if (maxValue < 100) {
      return Math.ceil(maxValue * 1.1 / 10) * 10;
    } else {
      return Math.ceil(maxValue * 1.1 / 100) * 100;
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const { filterOptions } = processFilterOptions();
  
  const processedChartData = (chartData?.data || []).map(item => ({
    ...item,
    value: typeof item.value === 'number' && !isNaN(item.value) && item.value >= 0 ? item.value : 0,
  }));
  
  const maxValue = calculateMaxValue(processedChartData);

  return {
    dashboardMetrics: generateDashboardMetrics(),
    chartData: processedChartData,
    userTableData: userTableData?.data || [],
    
    selectedFilters,
    filterOptions,
    
    isMetricsLoading,
    isFiltersLoading,
    isChartLoading,
    isTableLoading,
    
    metricsError,
    filtersError,
    chartError,
    tableError,
    
    maxValue,
    
    handleFilterChange,
        shouldShowLocation: selectedFilters.filterBy === "By Location",
    shouldShowFlexologist: selectedFilters.filterBy === "By Flexologist",
  };
}; 