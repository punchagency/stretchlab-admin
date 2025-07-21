import { MetricCard, RechartsBarChart, FilterDropdown, DateRangeFilter, MetricCardsSkeleton, BusinessDetailModal } from "@/components/shared";
import { DataTable, userTableColumns, businessTableColumns } from "@/components/datatable";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { useBusinessDetail } from "@/hooks/useBusinessDetail";
import { motion } from "motion/react";
import { getUserInfo } from "@/utils";

export const Dashboard = () => {
  const {
    dashboardMetrics,
    chartData,
    userTableData,
    businessTableData,
    selectedFilters,
    filterOptions,
    isMetricsLoading,
    isFiltersLoading,
    isChartLoading,
    isTableLoading,
    isBusinessTableLoading,
    metricsError,
    filtersError,
    chartError,
    tableError,
    businessTableError,
    maxValue,
    handleFilterChange,
    handleCustomRangeChange,
    shouldShowLocation,
    shouldShowFlexologist,
  } = useDashboard();

  const {
    businessInfo,
    isModalOpen,
    isBusinessInfoLoading,
    businessInfoError,
    openBusinessDetail,
    closeBusinessDetail,
  } = useBusinessDetail();

  const userInfo = getUserInfo();
  const handleMetricClick = (title: string) => {
    console.log(`Clicked on ${title}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl">
        <div className="border-b border-gray-200 px-4 sm:px-7">
          <h1 className="text-base font-semibold mb-3 text-gray-900">
            Performance Metrics Dashboard
          </h1>
        </div>

        <div className="px-5 mt-5 flex flex-col space-y-10">

          <div className="py-4 px-3 sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Check-Out Countdown</h2>
            {isMetricsLoading ? (
              <MetricCardsSkeleton />
            ) : metricsError ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error loading metrics</div>
                <p className="text-gray-600">Please try refreshing the page</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${userInfo?.role_id === 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
                } gap-4 mb-6`}>
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



          <div className="bg-[#F5F5F5] rounded-lg shadow-md py-4 px-3 sm:px-4">
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

                  <div className="flex flex-wrap gap-3 mb-6 justify-between flex-col sm:flex-row">
                    <FilterDropdown
                      label="Filter By"
                      value={selectedFilters.filterBy}
                      options={filterOptions.filterBy}
                      onChange={(value) => handleFilterChange('filterBy', value)}
                      className="flex-1"
                    />
                    <DateRangeFilter
                      label="Duration"
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




          <div className="mb-8 py-4  sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pl-2 sm:pl-0">My Team</h2>

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
                tableContainerClassName="bg-white"
              />
            )}

          </div>

         {userInfo?.role_id === 2 && <div className="mb-8 py-4 sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pl-2 sm:pl-0"> Business List</h2>

            {isBusinessTableLoading ? (
              <div className="flex justify-center items-center py-12">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-primary-base font-medium"
                >
                  Loading businesses...
                </motion.div>
              </div>
            ) : businessTableError ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-red-500 font-medium">Failed to load businesses</div>
              </div>
            ) : (
              <DataTable
                columns={businessTableColumns(openBusinessDetail)}
                data={businessTableData}
                emptyText="No businesses found"
                tableContainerClassName="bg-white"
              />
            )}

          </div>}

        </div>

      </div>

      <BusinessDetailModal
        businessInfo={businessInfo}
        isOpen={isModalOpen}
        onClose={closeBusinessDetail}
        isLoading={isBusinessInfoLoading}
      />
    </div>
  );
};
