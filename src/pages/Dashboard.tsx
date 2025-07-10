import { MetricCard, RechartsBarChart, FilterDropdown, MetricCardsSkeleton } from "@/components/shared";
import { DataTable, userTableColumns } from "@/components/datatable";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { motion } from "motion/react";

export const Dashboard = () => {
  const {
    dashboardMetrics,
    chartData,
    userTableData,
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
    shouldShowLocation,
    shouldShowFlexologist,
  } = useDashboard();

  const handleMetricClick = (title: string) => {
    console.log(`Clicked on ${title}`);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl">
        <div className="border-b border-gray-200 px-4 sm:px-7">
          <h1 className="text-base font-semibold mb-3 text-gray-900">
            Performance Metrics Dashboard
          </h1>
        </div>
      
        <div className="px-5 sm:px-7 mt-5">
          <div className="mb-8 py-4 sm:px-6 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Check-Out Countdown</h2>
            {isMetricsLoading ? (
              <MetricCardsSkeleton />
            ) : metricsError ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error loading metrics</div>
                <p className="text-gray-600">Please try refreshing the page</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {dashboardMetrics.map((metric, index) => (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    subtitle={metric.subtitle}
                    buttonText={metric.buttonText}
                    buttonVariant={metric.buttonVariant}
                    showCurrency={metric.showCurrency}
                    onButtonClick={() => handleMetricClick(metric.title)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        
        <div className="mb-8 py-4 sm:px-6">
          <div className="bg-[#F5F5F5] rounded-lg shadow-md py-4 sm:px-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Check-Out Countdown</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
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
                <>
                
                  <div className="flex flex-wrap gap-3 mb-6 justify-between">
                    <FilterDropdown
                      label="Filter By"
                      value={selectedFilters.filterBy}
                      options={filterOptions.filterBy}
                      onChange={(value) => handleFilterChange('filterBy', value)}
                      className="flex-1"
                    />
                    <FilterDropdown
                      label="Duration"
                      value={selectedFilters.duration}
                      options={filterOptions.duration}
                      onChange={(value) => handleFilterChange('duration', value)}
                      className="flex-1"
                    />
                    {shouldShowLocation && (
                      <FilterDropdown
                        label="Location"
                        value={selectedFilters.location}
                        options={filterOptions.location}
                        onChange={(value) => handleFilterChange('location', value)}
                        className="flex-1"
                      />
                    )}
                    {shouldShowFlexologist && (
                      <FilterDropdown
                        label="Flexologist"
                        value={selectedFilters.flexologist}
                        options={filterOptions.flexologist}
                        onChange={(value) => handleFilterChange('flexologist', value)}
                        className="flex-1"
                      />
                    )}
                    <FilterDropdown
                      label="Dataset"
                      value={selectedFilters.dataset}
                      options={filterOptions.dataset}
                      onChange={(value) => handleFilterChange('dataset', value)}
                      className="flex-2"
                    />
                  </div>

                  
                  <div className="p-1 relative">
                    {isChartLoading && (
                      <ChartSkeleton />
                    )}
                    {chartError && (
                      <div className="text-center py-8">
                        <div className="text-red-500 mb-2">Error loading chart data</div>
                        <p className="text-gray-600">Please try again</p>
                      </div>
                    )}
                    {!chartError && !isChartLoading && (
                      <RechartsBarChart 
                        data={chartData} 
                        title="" 
                        maxValue={maxValue} 
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        
        <div className="px-5 sm:px-7 mt-5">
          <div className="mb-8 py-4 sm:px-6 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Flexologist</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-hidden">
              {isTableLoading ? (
                <div className="flex justify-center items-center py-12">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary-base font-medium"
                  >
                    Loading users...
                  </motion.div>
                </div>
              ) : tableError ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-red-500 font-medium">Failed to load users</div>
                </div>
              ) : (
                <DataTable
                  columns={userTableColumns}
                  data={userTableData}
                  emptyText="No users found"
                  tableContainerClassName="w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
