import { FilterDropdown, DateRangeFilter } from '../components/shared';
import { OpportunityBarChart, RankingBarChart, Drilldown, MetricsDisplay } from '../components/analytics';
import { useAnalytics } from '@/hooks/useAnalytics';

export const Analytics = () => {
  const {
    selectedFilters,
    filterOptions,
    selectedOpportunity,
    selectedRankBy,
    opportunityData,
    drilldownData,
    rankingData,
    rpaAuditData,
    isFiltersLoading,
    isRPAAuditLoading,
    isRPAAuditDetailsLoading,
    isRankingLoading,
    filtersError,
    rpaAuditError,
    rankingError,
    handleFilterChange,
    handleCustomRangeChange,
    handleOpportunitySelect,
    handleRankByChange,
    shouldShowLocation,
    shouldShowFlexologist,
  } = useAnalytics();

  const rankByOptions = ['Location', 'Flexologist'];

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 px-4 sm:px-7">
        <h1 className="text-base font-semibold mb-3 text-gray-900">
          Robot Automation Audit
        </h1>
      </div>

      <div className="p-3 sm:p-5 flex flex-col space-y-10">
        <div className="bg-[#F5F5F5] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-5">
          <div className=''>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Performance & Opportunity Dashboard
            </h2>
           
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 mb-6 flex flex-col gap-6">
              
              {isFiltersLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">Loading filters...</div>
                </div>
              ) : filtersError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">Error loading filters</div>
                  <p className="text-gray-600">Please try refreshing the page</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3 justify-between flex-col sm:flex-row">
                  <FilterDropdown
                    label="Filter By"
                    value={selectedFilters.filterBy}
                    options={filterOptions.filterBy}
                    onChange={(value) => handleFilterChange('filterBy', value)}
                    className="flex-1"
                  />
                  <DateRangeFilter
                    label="Time Range"
                    value={filterOptions.duration.find(opt => opt.value === selectedFilters.duration)?.label || selectedFilters.duration}
                    options={filterOptions.duration}
                    onChange={(value) => handleFilterChange('duration', value)}
                    onCustomRangeChange={handleCustomRangeChange}
                    className="flex-2"
                  />
                  {shouldShowLocation && (
                    <FilterDropdown
                      label="Location"
                      value={selectedFilters.location}
                      options={filterOptions.location}
                      onChange={(value) => handleFilterChange('location', value)}
                      className="flex-2"
                    />
                  )}
                  {shouldShowFlexologist && (
                    <FilterDropdown
                      label="Flexologist"
                      value={selectedFilters.flexologist}
                      options={filterOptions.flexologist}
                      onChange={(value) => handleFilterChange('flexologist', value)}
                      className="flex-2"
                    />
                  )}
                </div>
              )}

              {!isFiltersLoading && (
                <>
                  {rpaAuditError && (
                    <div className="text-center py-8">
                      <div className="text-red-500 mb-2">Error loading opportunity data</div>
                      <p className="text-gray-600">Please try refreshing the page</p>
                    </div>
                  )}

                  <MetricsDisplay
                    totalNotes={rpaAuditData?.total_notes || 0}
                    totalNotesWithOpportunities={rpaAuditData?.total_notes_with_opportunities || 0}
                    totalQualityNotes={rpaAuditData?.total_quality_notes || 0}
                    isLoading={isRPAAuditLoading}
                  />

                  <div className="grid grid-cols-1 gap-6">
                    <div className="lg:col-span-1">
                      <OpportunityBarChart
                        data={opportunityData}
                        onBarClick={handleOpportunitySelect}
                        isLoading={isRPAAuditLoading}
                        selectedOpportunity={selectedOpportunity}
                      />
                    </div>
                    <Drilldown
                      selected={selectedOpportunity}
                      data={drilldownData}
                      isLoading={isRPAAuditDetailsLoading || isRPAAuditLoading}
                      hasInitialData={!!rpaAuditData}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            Performance Ranking
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
              <FilterDropdown
                label="Rank By"
                value={selectedRankBy}
                options={rankByOptions}
                onChange={handleRankByChange}
                className="flex-1"
              />

              <FilterDropdown
                label="Metric"
                value={selectedFilters.dataset}
                options={filterOptions.dataset}
                onChange={(value) => handleFilterChange('dataset', value)}
                className="flex-1"
              />
            </div>

            {rankingError && (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error loading ranking data</div>
                <p className="text-gray-600">Please try refreshing the page</p>
              </div>
            )}

            <RankingBarChart
              data={rankingData}
              isLoading={isRankingLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
