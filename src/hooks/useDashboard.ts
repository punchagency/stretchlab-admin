import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChartData, getUserTableData, getDashboardMetrics, getBusinessTableData, getActivitiesData } from "@/service/dashboard";
import { getChartFilters } from "@/service/analytics";
import type {
  ChartFiltersResponse,
  ChartDataPoint,
  ChartDataResponse,
  UserTableResponse,
  DashboardMetricsResponse,
  BusinessTableResponse,
  ActivitiesResponse,
  FilterState,
  FilterOptions,
  MetricCardData
} from "@/types";
import { getUserInfo } from "@/utils";

export const useDashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    filterBy: "Location",
    duration: "yesterday",
    location: "All",
    flexologist: "All",
    dataset: "",
  });

  const {
    data: dashboardMetricsData,
    isLoading: isMetricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery<DashboardMetricsResponse>({
    queryKey: ['dashboardMetrics'],
    queryFn: getDashboardMetrics,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const userInfo = getUserInfo();
  const {
    data: chartFiltersData,
    isLoading: isFiltersLoading,
    error: filtersError,
    refetch: refetchFilters,
  } = useQuery<ChartFiltersResponse>({
    queryKey: ['chartFilters', 'dashboard'],
    queryFn: () => getChartFilters(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: userTableData,
    isLoading: isTableLoading,
    error: tableError,
    refetch: refetchUserTable,
  } = useQuery<UserTableResponse>({
    queryKey: ['userTableData'],
    queryFn: getUserTableData,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: businessTableData,
    isLoading: isBusinessTableLoading,
    error: businessTableError,
    refetch: refetchBusinessTable,
  } = useQuery<BusinessTableResponse>({
    queryKey: ['businessTableData'],
    queryFn: getBusinessTableData,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: activitiesData,
    isLoading: isActivitiesLoading,
    error: activitiesError,
    refetch: refetchActivities,
  } = useQuery<ActivitiesResponse>({
    queryKey: ['activitiesData'],
    queryFn: getActivitiesData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const processFilterOptions = () => {
    const filterOptions: FilterOptions = {
      filterBy: ["Location", "Flexologist"],
      duration: [
        { value: "yesterday", label: "Yesterday" },
        { value: "last_7_days", label: "Last 7 Days" },
        { value: "last_30_days", label: "Last 30 Days" },
        { value: "this_month", label: "This Month" },
        { value: "last_month", label: "Last Month" },
        { value: "this_year", label: "This Year" },
        { value: "custom", label: "Custom" },
      ],
      location: ["All"],
      flexologist: ["All"],
      dataset: [],
    };

    let filtersMap = {
      datasetMap: new Map<string, string>(),
      flexologistMap: new Map<string, string>(),
    };

    if (chartFiltersData?.status === "success") {
      const { filters, flexologists, locations } = chartFiltersData.data;

      filtersMap.datasetMap = new Map(filters.map(f => [f.label, f.value]));
      filtersMap.flexologistMap = new Map(flexologists.map(f => [f, f.toLowerCase().trim()]));
      const datasetOptions = filters.map(filter => filter.label);
      const flexologistOptions = ["All", ...flexologists];
      const locationOptions = ["All", ...locations];

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
      customRange: selectedFilters.customRange,
    };

    if (selectedFilters.filterBy === "Location") {
      params.location = selectedFilters.location;
    } else if (selectedFilters.filterBy === "Flexologist") {
      if (selectedFilters.flexologist !== "All") {
        params.flexologist = filtersMap.flexologistMap.get(selectedFilters.flexologist);
      }
    }
    if (selectedFilters.duration === "custom") {
      params.start_date = selectedFilters.customRange?.start;
      params.end_date = selectedFilters.customRange?.end;
    }
    return params;
  };

  const chartDataParams = getChartDataParams();
  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
    refetch: refetchChart,
  } = useQuery<ChartDataResponse>({
    queryKey: ['chartData', chartDataParams],
    queryFn: () => getChartData(chartDataParams!),
    enabled: !!chartDataParams,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const generateDashboardMetrics = (role_id: number): MetricCardData[] => {
    const metrics: MetricCardData[] = [];

    if (role_id === 1 || role_id === 4) {
      metrics.push({
        title: "Revenue",
        value: dashboardMetricsData?.data?.balance_info?.month_transactions
          ? `$${dashboardMetricsData.data.balance_info.month_transactions.toFixed(2)}`
          : "$0.00",
        subtitle: "This Month",
        // buttonText: "View Details",
        buttonVariant: "primary",
        showCurrency: true,
      });
    }

    metrics.push(
      {
        title: "Bookings",
        value: dashboardMetricsData?.data?.bookings_info?.bookings_in_month
          ? `${dashboardMetricsData.data.bookings_info.bookings_in_month}`
          : "0",
        subtitle: dashboardMetricsData?.data?.bookings_info
          ? `${dashboardMetricsData.data.bookings_info.upwards_trend ? '+' : ''}${dashboardMetricsData.data.bookings_info.aggregation.toFixed(2)} %`
          : "No data",
        // buttonText: "See Sessions",
        buttonVariant: "primary",
        showCurrency: false,
      },
      // {
      //   title: "Security Incidents",
      //   value: "87%",
      //   subtitle: "+1% Vs Last Month",
      //   // buttonText: "Utilization",
      //   buttonVariant: "primary",
      //   showCurrency: false,
      // }
    );
    return metrics;
  };

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

  const handleCustomRangeChange = (start: string, end: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      customRange: { start, end }
    }));
  };

  // const generateChartData = (): ChartDataPoint[] => {
  //   const labels = getLabels(selectedFilters.duration as any, selectedFilters.customRange);
  //   const values = generateDummyData(labels);

  //   return labels.map((label, index) => ({
  //     label,
  //     value: values[index]
  //   }));
  // };

  const { filterOptions } = processFilterOptions();
  const processedChartData = (chartData?.data || []).map(item => ({
    ...item,
    value: typeof item.value === 'number' && !isNaN(item.value) && item.value >= 0 ? item.value : 0,

  }));
  // const processedChartData = generateChartData();

  const maxValue = calculateMaxValue(processedChartData);

  return {
    dashboardMetrics: generateDashboardMetrics(userInfo?.role_id || 0),
    dashboardMetricsData,
    chartData: processedChartData,
    userTableData: userTableData?.data || [],
    businessTableData: (businessTableData?.data || []).map(business => ({
      ...business,
      id: business.business_id
    })),
    activitiesData: activitiesData?.data,

    selectedFilters,
    filterOptions,

    isMetricsLoading,
    isFiltersLoading,
    isChartLoading,
    isTableLoading,
    isBusinessTableLoading,
    isActivitiesLoading,

    metricsError,
    filtersError,
    chartError,
    tableError,
    businessTableError,
    activitiesError,

    maxValue,

    handleFilterChange,
    handleCustomRangeChange,
    shouldShowLocation: selectedFilters.filterBy === "Location",
    shouldShowFlexologist: selectedFilters.filterBy === "Flexologist",

    retryMetrics: refetchMetrics,
    retryFilters: refetchFilters,
    retryChart: refetchChart,
    retryUserTable: refetchUserTable,
    retryBusinessTable: refetchBusinessTable,
    retryActivities: refetchActivities,
  };
}; 