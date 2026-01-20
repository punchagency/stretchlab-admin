import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChartFilters, getRPAAudit, getRPAAuditDetails, getRankingAnalytics, getLocationAnalytics } from "@/service/analytics";
import type {
  ChartFiltersResponse,
  FilterState,
  FilterOptions,
  RPAAuditResponse,
  RPAAuditParams,
  RPAAuditDetailsParams,
  RPAAuditDetailsResponse,
  LocationItem,
  FlexologistItem,
  RankingAnalyticsResponse,
  RankingAnalyticsParams,
  LocationAnalyticsResponse,
  LocationAnalyticsParams,
  LocationAnalyticsItem,
  RankingItem
} from "@/types";

export const useAnalytics = () => {
  const getTodayDateRange = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // subtract 1 day
    const isoDate = yesterday.toISOString().split('T')[0];
    return {
      start: isoDate,
      end: isoDate
    };
  };

  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    filterBy: "Location",
    duration: "today",
    location: "All",
    flexologist: "All",
    dataset: "",
    customRange: getTodayDateRange(),
    filterMetric: "all",
    // filterMetric: "subsequent",
  });

  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedRankBy, setSelectedRankBy] = useState<string>("Location");

  const {
    data: chartFiltersData,
    isLoading: isFiltersLoading,
    error: filtersError,
    refetch: refetchFilters,
  } = useQuery<ChartFiltersResponse>({
    queryKey: ['chartFilters', 'analytics'],
    queryFn: () => getChartFilters('analytics'),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: rpaAuditData,
    isLoading: isRPAAuditLoading,
    error: rpaAuditError,
    refetch: refetchRPAAudit,
  } = useQuery<RPAAuditResponse>({
    queryKey: ['rpaAudit', selectedFilters.filterBy, selectedFilters.duration, selectedFilters.location, selectedFilters.flexologist, selectedFilters.customRange, selectedFilters.filterMetric],
    queryFn: async () => {
      const params: RPAAuditParams = {
        duration: selectedFilters.duration === 'today' ? 'custom' : selectedFilters.duration,
      };
      params.filter_metric = selectedFilters.filterMetric;

      if (selectedFilters.filterBy === "Location" && selectedFilters.location !== "All") {
        params.location = selectedFilters.location.toLowerCase();
      } else if (selectedFilters.filterBy === "Flexologist" && selectedFilters.flexologist !== "All") {
        params.flexologist_name = selectedFilters.flexologist.toLowerCase();
      }

      if ((selectedFilters.duration === 'custom' || selectedFilters.duration === 'today') && selectedFilters.customRange) {
        params.start_date = selectedFilters.customRange.start;
        params.end_date = selectedFilters.customRange.end;
      }


      return getRPAAudit(params);
    },
    enabled: !!chartFiltersData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: rpaAuditDetailsData,
    isLoading: isRPAAuditDetailsLoading,
    error: rpaAuditDetailsError,
    refetch: refetchRPAAuditDetails,
  } = useQuery<RPAAuditDetailsResponse | null>({
    queryKey: ['rpaAuditDetails', selectedOpportunity, selectedFilters.filterBy, selectedFilters.duration, selectedFilters.location, selectedFilters.flexologist, selectedFilters.customRange],
    queryFn: async () => {
      if (!selectedOpportunity &&
        selectedFilters.location === "All" &&
        selectedFilters.flexologist === "All") {
        return null;
      }
      const opportunityToUse = selectedOpportunity;
      if (!opportunityToUse) return null;

      const params: RPAAuditDetailsParams = {
        opportunity: opportunityToUse.toLowerCase(),
        duration: selectedFilters.duration === 'today' ? 'custom' : selectedFilters.duration,
        start_date: "",
        end_date: "",
      };

      if (selectedFilters.filterBy === "Location" && selectedFilters.location !== "All") {
        params.location = selectedFilters.location.toLowerCase();
      } else if (selectedFilters.filterBy === "Flexologist" && selectedFilters.flexologist !== "All") {
        params.flexologist_name = selectedFilters.flexologist.toLowerCase();
      }

      if ((selectedFilters.duration === 'custom' || selectedFilters.duration === 'today') && selectedFilters.customRange) {
        params.start_date = selectedFilters.customRange.start;
        params.end_date = selectedFilters.customRange.end;
      }

      return getRPAAuditDetails(params);
    },
    enabled: !!rpaAuditData,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: rankingData,
    isLoading: isRankingLoading,
    error: rankingError,
    refetch: refetchRanking,
  } = useQuery<RankingAnalyticsResponse | null>({
    queryKey: ['rankingAnalytics', selectedFilters.dataset, selectedFilters.duration, selectedFilters.customRange, selectedFilters.filterMetric],
    queryFn: async () => {
      if (!selectedFilters.dataset) return null;

      const params: RankingAnalyticsParams = {
        metric: getMetricValueFromLabel(selectedFilters.dataset),
        duration: selectedFilters.duration === 'today' ? 'custom' : selectedFilters.duration,
        start_date: "",
        end_date: "",
        filter_metric: selectedFilters.filterMetric,
      };


      if ((selectedFilters.duration === 'custom' || selectedFilters.duration === 'today') && selectedFilters.customRange) {
        params.start_date = selectedFilters.customRange.start;
        params.end_date = selectedFilters.customRange.end;
      }

      return getRankingAnalytics(params);
    },
    enabled: !!chartFiltersData && !!selectedFilters.dataset,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: locationData,
    isLoading: isLocationLoading,
    error: locationError,
    refetch: refetchLocation,
  } = useQuery<LocationAnalyticsResponse | null>({
    queryKey: ['locationAnalytics', selectedLocation, selectedFilters.dataset, selectedFilters.duration, selectedFilters.customRange, selectedFilters.filterMetric],
    queryFn: async () => {
      if (!selectedLocation) return null;

      const params: LocationAnalyticsParams = {
        metric: getMetricValueFromLabel(selectedFilters.dataset),
        duration: selectedFilters.duration === 'today' ? 'custom' : selectedFilters.duration,
        start_date: "",
        end_date: "",
        filter_metric: selectedFilters.filterMetric,
        location: selectedLocation,
      };

      if ((selectedFilters.duration === 'custom' || selectedFilters.duration === 'today') && selectedFilters.customRange) {
        params.start_date = selectedFilters.customRange.start;
        params.end_date = selectedFilters.customRange.end;
      }
      return getLocationAnalytics(params);
    },
    enabled: !!selectedLocation,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });


  const processFilterOptions = () => {
    const filterOptions: FilterOptions = {
      filterBy: ["Location", "Flexologist"],
      duration: [
        { value: "today", label: "Yesterday" },
        { value: "last_7_days", label: "Last 7 Days" },
        { value: "last_30_days", label: "Last 30 Days" },
        { value: "last_90_days", label: "Last 90 Days" },
        // { value: "this_month", label: "This Month" },
        // { value: "last_month", label: "Last Month" },
        // { value: "this_year", label: "This Year" },
        { value: "custom", label: "Custom Range" },
      ],
      location: ["All"],
      flexologist: ["All"],
      dataset: [],
      filterMetric: [
        { value: "all", label: "All Appointments" },
        { value: "first", label: "First Appointment" },
        { value: "subsequent", label: "Return Appointment" },
      ],
    };

    if (chartFiltersData?.status === "success") {
      const { filters, flexologists, locations } = chartFiltersData.data;

      const datasetOptions = filters.map(filter => filter.label);
      const flexologistOptions = ["All", ...flexologists];
      const locationOptions = ["All", ...locations];

      filterOptions.dataset = datasetOptions;
      filterOptions.flexologist = flexologistOptions;
      filterOptions.location = locationOptions;

      if (datasetOptions.length > 0 && !selectedFilters.dataset) {
        setSelectedFilters(prev => ({
          ...prev,
          dataset: datasetOptions[0],
        }));
      }
    }

    return { filterOptions };
  };

  const getMetricValueFromLabel = (label: string): string => {
    if (!chartFiltersData?.data?.filters) return label;

    const filter = chartFiltersData.data.filters.find(f => f.label === label);
    return filter ? filter.value : label;
  };

  const handleFilterChange = (filterKey: string, value: string) => {

    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        [filterKey]: value
      };
      if (filterKey === 'duration' && value === 'today') {
        newFilters.customRange = getTodayDateRange();
      }

      return newFilters;
    });
    if (filterKey !== 'dataset') {
      setSelectedOpportunity(null);
    }
    setSelectedLocation(null);


  };

  const handleCustomRangeChange = (start: string, end: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      customRange: { start, end }

    }));
    setSelectedOpportunity(null);
    setSelectedLocation(null);
  };

  const handleOpportunitySelect = (opportunity: string) => {
    if (selectedOpportunity === opportunity) {
      setSelectedOpportunity(null);
    } else {
      setSelectedOpportunity(opportunity);
    }
  };

  const handleLocationSelect = (location: string) => {
    if (selectedLocation === location) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(location);
    }
  };

  const handleDrilldownLocationClick = (location: string) => {
    // Toggle: if clicking the same location, reset to All; else set to location
    const isSame = selectedFilters.location?.toLowerCase() === location.toLowerCase();
    setSelectedFilters(prev => ({
      ...prev,
      filterBy: 'Location',
      location: isSame ? 'All' : location,
    }));
    setSelectedLocation(isSame ? null : location);
    // Preserve selectedOpportunity to support combined drilldown when set
  };

  const clearLocationFilter = () => {
    setSelectedFilters(prev => ({
      ...prev,
      filterBy: 'Location',
      location: 'All',
    }));
    setSelectedLocation(null);
  };

  const handleRankByChange = (value: string) => {
    setSelectedRankBy(value);
  };

  const transformOpportunityData = (): { name: string; value: number }[] => {
    if (!rpaAuditData?.note_opportunities) return [];

    return rpaAuditData.note_opportunities
      .map(item => ({
        name: item.opportunity,
        value: Math.round(item.percentage)
      }))
      .sort((a, b) => b.value - a.value);
  };

  const transformDrilldownData = () => {
    if (rpaAuditDetailsData) {
      return {
        locations: rpaAuditDetailsData.location.map((item: LocationItem) => ({
          name: item.location,
          value: `${Math.round(item.percentage)}%`,
          particular_count: `${item.particular_count}`,
          percentage_note_quality: `${Math.round(item.percentage_note_quality)}%`,
          total_count: `${item.total_count}`
        })),
        flexologists: rpaAuditDetailsData.flexologist.map((item: FlexologistItem) => ({
          name: item.flexologist,
          value: `${Math.round(item.percentage)}%`,
          particular_count: `${item.particular_count}`,
          percentage_note_quality: `${Math.round(item.percentage_note_quality)}%`,
          total_count: `${item.total_count}`
        }))
      };
    }

    if (rpaAuditData) {
      return {
        locations: rpaAuditData.location.map((item: LocationItem) => ({
          name: item.location,
          value: `${Math.round(item.percentage)}%`
        })),
        flexologists: rpaAuditData.flexologist.map((item: FlexologistItem) => ({
          name: item.flexologist,
          value: `${Math.round(item.percentage)}%`
        }))
      };
    }

    return null;
  };

  const transformRankingData = (): { name: string; value: number, total: number }[] => {
    if (!rankingData?.data) return [];
    // If user has interacted and we have details data, use that
    //  if (rpaAuditDetailsData && (
    //   selectedOpportunity ||
    //   selectedFilters.location !== "All" ||
    //   selectedFilters.flexologist !== "All" ||
    //   selectedFilters.duration !== "last_7_days"
    // )) {

    return rankingData.data
      .map((item: { name: string; count: number; total: number }) => ({
        name: item.name,
        value: Math.round(item.count),
        total: item.total
      }))
      .sort((a: { name: string; value: number }, b: { name: string; value: number }) => b.value - a.value);
  };

  // const getCurrentOpportunityName = (): string | null => {
  //   if (selectedOpportunity) return selectedOpportunity;
  //   if (rpaAuditData?.note_opportunities?.[0]) {
  //     return rpaAuditData.note_opportunities[0].opportunity;
  //   }
  //   return null;
  // };

  const transformLocationData = () => {
    if (locationData) {
      return locationData.data?.map((item: LocationAnalyticsItem) => ({
        id: item.name,
        name: item.name,
        value: `${Math.round(item.count)}`,
        total: item.total
      }));
    }

    if (rankingData) {
      return rankingData?.data_flex?.map((item: RankingItem) => ({
        id: item.name,
        name: item.name,
        value: `${Math.round(item.count)}`,
        total: item.total
      }));


    }

    return null;
  };

  const { filterOptions } = processFilterOptions();

  return {
    selectedFilters,
    filterOptions,
    selectedOpportunity,
    selectedLocation,
    selectedRankBy,
    opportunityData: transformOpportunityData(),
    drilldownData: transformDrilldownData(),
    rankingData: transformRankingData(),
    rpaAuditData,
    locationData: transformLocationData(),

    isFiltersLoading,
    isRPAAuditLoading,
    isRPAAuditDetailsLoading,
    isRankingLoading,
    isLocationLoading,
    filtersError,
    rpaAuditError,
    rpaAuditDetailsError,
    rankingError,
    locationError,
    handleFilterChange,
    handleCustomRangeChange,
    handleOpportunitySelect,
    handleRankByChange,
    handleLocationSelect,
    handleDrilldownLocationClick,
    clearLocationFilter,
    shouldShowLocation: selectedFilters.filterBy === "Location",
    shouldShowFlexologist: selectedFilters.filterBy === "Flexologist",

    retryFilters: refetchFilters,
    retryRPAAudit: refetchRPAAudit,
    retryRPAAuditDetails: refetchRPAAuditDetails,
    retryRanking: refetchRanking,
    retryLocation: refetchLocation,
  };
};



