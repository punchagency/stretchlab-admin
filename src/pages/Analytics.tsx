import { FilterDropdown, DateRangeFilter, Button } from '../components/shared';
import { OpportunityBarChart, RankingBarChart, Drilldown, MetricsDisplay } from '../components/analytics';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Info, RefreshCcw } from 'lucide-react';
import { DataTable } from '@/components/datatable';
import { getLocationTableColumns } from '@/components/analytics';
import { TableSkeleton } from '@/components/shared';


export const Analytics = () => {
  const {
    selectedFilters,
    filterOptions,
    selectedOpportunity,
    selectedLocation,
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
    handleLocationSelect,
    shouldShowLocation,
    shouldShowFlexologist,
    retryFilters,
    retryRPAAudit,
    retryRanking,
    locationData,
    isLocationLoading,
    locationError,
    retryLocation,
  } = useAnalytics();


  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 px-4 sm:px-7">
        <h1 className="text-base font-semibold mb-3 text-gray-900">
          Appointment Quality Audit
        </h1>
      </div>

      <div className='p-3 sm:p-5'>
        <div className='flex items-center gap-2 mb-4 p-3 rounded-lg border bg-orange-50 border-orange-200'>
          <Info className="w-5 h-5 text-orange-500" />
          <p className=" md:text-sm text-xs text-orange-600 font-medium">
          Currently, return appointment analysis is the only option available.
          </p>

        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">

          <DateRangeFilter
            label="Time Period"
            value={filterOptions.duration.find(opt => opt.value === selectedFilters.duration)?.label || selectedFilters.duration}
            options={filterOptions.duration}
            onChange={(value) => handleFilterChange('duration', value)}
            onCustomRangeChange={handleCustomRangeChange}
            className="flex-1"
          />
          <FilterDropdown
            label="Appointment Type"
            value={filterOptions.filterMetric?.find(opt => opt.value === selectedFilters.filterMetric)?.label || selectedFilters.filterMetric || "all"}
            options={filterOptions.filterMetric || []}
            onChange={(value) => handleFilterChange('filterMetric', value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="p-3 sm:p-5 flex flex-col space-y-10">
        <div className="bg-[#F5F5F5] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-5">
          <div className=''>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Performance
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 mb-6 flex flex-col gap-6">

              {isFiltersLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">Loading filters...</div>
                </div>
              ) : filtersError ? (
                <div className="text-center py-8 flex items-center justify-center flex-col">
                  <div className="text-red-500 mb-2">Error loading filters</div>
                  <Button
                    onClick={() => retryFilters()}
                    className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
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

                  {shouldShowLocation && (
                    <FilterDropdown
                      label="Location"
                      value={selectedFilters.location}
                      options={filterOptions.location}
                      onChange={(value) => handleFilterChange('location', value)}
                      className="flex-1"
                      showSearch={true}
                    />
                  )}
                  {shouldShowFlexologist && (
                    <FilterDropdown
                      label="Flexologist"
                      value={selectedFilters.flexologist}
                      options={filterOptions.flexologist}
                      onChange={(value) => handleFilterChange('flexologist', value)}
                      className="flex-2"
                      showSearch={true}
                    />
                  )}
                </div>
              )}

              {!isFiltersLoading && (
                <>
                  {rpaAuditError && (
                    <div className="text-center py-8 flex items-center justify-center flex-col">
                      <div className="text-red-500 mb-2">Error loading opportunity data</div>
                      <Button
                        onClick={() => retryRPAAudit()}
                        className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                      >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  )}

                  <MetricsDisplay
                    totalNotes={rpaAuditData?.total_notes || 0}
                    totalNotesWithOpportunities={rpaAuditData?.total_notes_with_opportunities || 0}
                    totalQualityNotes={rpaAuditData?.total_quality_notes || 0}
                    isLoading={isRPAAuditLoading}
                    totalNotesWithOpportunitiesPercentage={rpaAuditData?.total_notes_with_opportunities_percentage || 0}
                    totalQualityNotesPercentage={rpaAuditData?.total_quality_notes_percentage || 0}
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

        {!isFiltersLoading && <div className="bg-[#F5F5F5] rounded-lg shadow-sm border border-gray-200 p-3 sm:p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            Performance Ranking
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6">

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
              {/* <FilterDropdown
                label="Rank By"
                value={selectedRankBy}
                options={rankByOptions}
                onChange={handleRankByChange}
                className="flex-1"
              /> */}

              <FilterDropdown
                label="Appointment"
                value={selectedFilters.dataset}
                options={filterOptions.dataset || []}
                onChange={(value) => handleFilterChange('dataset', value)}
                className="flex-1"
              />
            </div>

            {rankingError && (
              <div className="text-center py-8 flex items-center justify-center flex-col">
                <div className="text-red-500 mb-2">Error loading ranking data</div>
                <Button
                  onClick={() => retryRanking()}
                  className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}

            <RankingBarChart
              data={rankingData}
              isLoading={isRankingLoading}
              dataSet={selectedFilters.dataset}
              onBarClick={handleLocationSelect}
              selectedLocation={selectedLocation}
              selectedDataset={selectedFilters.dataset}
            />
            <div className='mt-6'>
              {isRankingLoading || isLocationLoading ?
                <TableSkeleton rows={5} columns={4} /> : locationError ? <div className="text-center py-8 flex items-center justify-center flex-col">
                  <div className="text-red-500 mb-2">Error loading location data</div>
                  <Button
                    onClick={() => retryLocation()}
                    className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div> :
                  <>



                    <DataTable
                      columns={getLocationTableColumns({
                        metric: selectedFilters.dataset,
                        selectedLocation: selectedLocation || undefined
                      }) as any}
                      data={locationData || []}
                      emptyText="No data found"
                      tableContainerClassName="bg-white xs:w-[80vw]"
                      enableSearch
                      searchPlaceholder="Search by Flexologist Name"
                      searchFields={["name"]}

                    />
                  </>
              }
            </div>

          </div>
        </div>}
      </div>
    </div>
  );
};
