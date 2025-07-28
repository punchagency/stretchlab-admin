import { useState } from "react";
import { useQuery} from "@tanstack/react-query";
import { getChartFilters, getRPAAudit, getRPAAuditDetails, getRankingAnalytics } from "@/service/analytics";
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
  RankingAnalyticsParams
} from "@/types";

export const useAnalytics = () => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    filterBy: "Location",
    duration: "last_7_days",
    location: "All",
    flexologist: "All",
    dataset: "",
    customRange: undefined,
  });

  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [selectedRankBy, setSelectedRankBy] = useState<string>("Location");

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
    data: rpaAuditData,
    isLoading: isRPAAuditLoading,
    error: rpaAuditError,
  } = useQuery<RPAAuditResponse>({
    queryKey: ['rpaAudit', selectedFilters.filterBy, selectedFilters.duration, selectedFilters.location, selectedFilters.flexologist, selectedFilters.customRange],
    queryFn: async () => {
      const params: RPAAuditParams = {
        duration: selectedFilters.duration,
      };

      if (selectedFilters.filterBy === "Location" && selectedFilters.location !== "All") {
        params.location = selectedFilters.location.toLowerCase();
      } else if (selectedFilters.filterBy === "Flexologist" && selectedFilters.flexologist !== "All") {
        params.flexologist_name = selectedFilters.flexologist.toLowerCase();
      }

      if (selectedFilters.duration === 'custom' && selectedFilters.customRange) {
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
  } = useQuery<RPAAuditDetailsResponse | null>({
    queryKey: ['rpaAuditDetails', selectedOpportunity, selectedFilters.filterBy, selectedFilters.duration, selectedFilters.location, selectedFilters.flexologist, selectedFilters.customRange],
    queryFn: async () => {
      if (!selectedOpportunity && 
          selectedFilters.location === "All" && 
          selectedFilters.flexologist === "All") {
        return null; 
      }

      const opportunityToUse = selectedOpportunity || (rpaAuditData?.note_opportunities?.[0]?.opportunity);
      if (!opportunityToUse) return null;

      const params: RPAAuditDetailsParams = {
        opportunity: opportunityToUse.toLowerCase(),
        duration: selectedFilters.duration,
        start_date: "",
        end_date: "",
      };

      if (selectedFilters.filterBy === "Location" && selectedFilters.location !== "All") {
        params.location = selectedFilters.location.toLowerCase();
      } else if (selectedFilters.filterBy === "Flexologist" && selectedFilters.flexologist !== "All") {
        params.flexologist_name = selectedFilters.flexologist.toLowerCase();
      }

      if (selectedFilters.duration === 'custom' && selectedFilters.customRange) {
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
  } = useQuery<RankingAnalyticsResponse | null>({
    queryKey: ['rankingAnalytics', selectedRankBy, selectedFilters.dataset, selectedFilters.duration, selectedFilters.customRange],
    queryFn: async () => {
      if (!selectedFilters.dataset) return null;

      const params: RankingAnalyticsParams = {
        rank_by: selectedRankBy.toLowerCase(),
        metric: getMetricValueFromLabel(selectedFilters.dataset),
        duration: selectedFilters.duration,
        start_date: "",
        end_date: "",
      };

      
      if (selectedFilters.duration === 'custom' && selectedFilters.customRange) {
        params.start_date = selectedFilters.customRange.start;
        params.end_date = selectedFilters.customRange.end;
      }

      return getRankingAnalytics(params);
    },
    enabled: !!chartFiltersData && !!selectedFilters.dataset, 
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const processFilterOptions = () => {
    const filterOptions: FilterOptions = {
      filterBy: ["Location", "Flexologist"],
      duration: [
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
    };

    if (chartFiltersData?.status === "success") {
      const { filters, flexologists, locations } = chartFiltersData.data;

      const datasetOptions = filters.map(filter => filter.label);
      const flexologistOptions = ["All", ...flexologists.map(flex => flex.full_name)];
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
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    
    if (filterKey !== 'dataset') {
      setSelectedOpportunity(null);
    }
  };

  const handleCustomRangeChange = (start: string, end: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      customRange: { start, end }
      
    }));
        setSelectedOpportunity(null);
  };

  const handleOpportunitySelect = (opportunity: string) => {
    setSelectedOpportunity(opportunity);
  };

  const handleRankByChange = (value: string) => {
    setSelectedRankBy(value);
  };

  const transformOpportunityData = (): { name: string; value: number }[] => {
    if (!rpaAuditData?.note_opportunities) return [];

    return rpaAuditData.note_opportunities
      .map(item => ({
        name: item.opportunity,
        value: item.percentage
      }))
      .sort((a, b) => b.value - a.value); 
  };

  const transformDrilldownData = () => {
    if (rpaAuditDetailsData) {
      return {
        locations: rpaAuditDetailsData.location.map((item: LocationItem) => ({
          name: item.location,
          value: `${item.percentage.toFixed(1)}%`
        })),
        flexologists: rpaAuditDetailsData.flexologist.map((item: FlexologistItem) => ({
          name: item.flexologist,
          value: `${item.percentage.toFixed(1)}%`
        }))
      };
    }

    if (rpaAuditData) {
      return {
        locations: rpaAuditData.location.map((item: LocationItem) => ({
          name: item.location,
          value: `${item.percentage.toFixed(1)}%`
        })),
        flexologists: rpaAuditData.flexologist.map((item: FlexologistItem) => ({
          name: item.flexologist,
          value: `${item.percentage.toFixed(1)}%`
        }))
      };
    }

    return null;
  };

  const transformRankingData = (): { name: string; value: number }[] => {
    if (!rankingData?.data) return [];
       // If user has interacted and we have details data, use that
      //  if (rpaAuditDetailsData && (
      //   selectedOpportunity ||
      //   selectedFilters.location !== "All" ||
      //   selectedFilters.flexologist !== "All" ||
      //   selectedFilters.duration !== "last_7_days"
      // )) {
  
    return rankingData.data
      .map((item: { name: string; count: number }) => ({
        name: item.name,
        value: item.count
      }))
      .sort((a: { name: string; value: number }, b: { name: string; value: number }) => b.value - a.value); // Sort in descending order
  };

  // const getCurrentOpportunityName = (): string | null => {
  //   if (selectedOpportunity) return selectedOpportunity;
  //   if (rpaAuditData?.note_opportunities?.[0]) {
  //     return rpaAuditData.note_opportunities[0].opportunity;
  //   }
  //   return null;
  // };

  const { filterOptions } = processFilterOptions();

  return {
    selectedFilters,
    filterOptions,
    selectedOpportunity,
    selectedRankBy,
    opportunityData: transformOpportunityData(),
    drilldownData: transformDrilldownData(),
    rankingData: transformRankingData(),
    rpaAuditData,

    isFiltersLoading,
    isRPAAuditLoading,
    isRPAAuditDetailsLoading,
    isRankingLoading,

    filtersError,
    rpaAuditError,
    rpaAuditDetailsError,
    rankingError,

    handleFilterChange,
    handleCustomRangeChange,
    handleOpportunitySelect,
    handleRankByChange,

    shouldShowLocation: selectedFilters.filterBy === "Location",
    shouldShowFlexologist: selectedFilters.filterBy === "Flexologist",
  };
}; 