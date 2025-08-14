import { MetricCard, RechartsBarChart, FilterDropdown, DateRangeFilter, MetricCardsSkeleton, BusinessDetailModal, Button, TableSkeleton, Activities } from "@/components/shared";
import { DataTable, userTableColumns, businessTableColumns } from "@/components/datatable";
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { useDashboard } from "@/hooks/useDashboard";
import { useBusinessDetail } from "@/hooks/useBusinessDetail";
import { SubscriptionInfoCard } from "@/components/dashboard";

import { getUserInfo } from "@/utils";
import { RefreshCcw } from "lucide-react";

export const Dashboard = () => {
  const {
    dashboardMetrics,
    dashboardMetricsData,
    chartData,
    userTableData,
    businessTableData,
    activitiesData,
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
    handleMyTeamDurationChange,
    handleMyTeamCustomRangeChange,
    myTeamDuration,
    shouldShowLocation,
    shouldShowFlexologist,
    retryMetrics,
    retryFilters,
    retryChart,
    retryUserTable,
    retryBusinessTable,
    retryActivities,
  } = useDashboard();

  const {
    businessInfo,
    isModalOpen,
    isBusinessInfoLoading,
    openBusinessDetail,
    closeBusinessDetail,
    refetchBusinessInfo,
  } = useBusinessDetail();

  const userInfo = getUserInfo();
  const handleMetricClick = (title: string) => {
    console.log(`Clicked on ${title}`);
  };
   console.log(isChartLoading)
   console.log(isTableLoading)
  return (
    <div className="min-h-screen bg-white">
      <div className="">


        <div className="px-3 sm:px-5 mt-5 flex flex-col space-y-10">

          <div className="py-4 px-3 sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Platform Live Metrics</h2>
            {isMetricsLoading ? (
              <MetricCardsSkeleton />
            ) : metricsError ? (
              <div className="text-center py-8 flex items-center justify-center flex-col">
                <div className="text-red-500 mb-2">Error loading metrics</div>

                <Button
                  onClick={() => retryMetrics()}
                  className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${userInfo?.role_id === 1 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
                } gap-4`}>
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
                {userInfo?.role_id === 1 && <SubscriptionInfoCard
                  {...dashboardMetricsData?.data.subscriptions_info}
                />}
              </div>
            )}

          </div>

          {(userInfo?.role_id === 1 || userInfo?.role_id === 4) && <div className="py-4 px-3 sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Activities</h2>
            <Activities
              data={activitiesData}
              isLoading={isActivitiesLoading}
              error={activitiesError}
              onRetry={retryActivities}
            />
          </div>}


          <div className="bg-[#F5F5F5] rounded-lg shadow-md py-4 px-3 sm:px-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Company Metrics</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
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
                    <FilterDropdown
                      label="Dataset"
                      value={selectedFilters.dataset}
                      options={filterOptions.dataset || []}
                      onChange={(value) => handleFilterChange('dataset', value)}
                      className="flex-2"
                      showSearch={true}
                    />
                  </div>


                  <div className="p-1 relative">
                    {isChartLoading && (
                      <ChartSkeleton />
                    )}
                    {chartError && (
                      <div className="text-center py-8 flex items-center justify-center flex-col">
                        <div className="text-red-500 mb-2">Error loading chart data</div>
                        <Button
                          onClick={() => retryChart()}
                          className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                        >
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    )}
                    {!chartError && !isChartLoading && (
                      <RechartsBarChart
                        data={chartData}
                        title=""
                        maxValue={maxValue}
                        dataSet={selectedFilters.dataset}
                      />
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
          {(userInfo?.role_id === 1 || userInfo?.note_verified) && <div className="mb-8 py-4  sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pl-2 sm:pl-0">My Team</h2>

            {isTableLoading ? (

              <TableSkeleton rows={5} columns={4} />

            ) : tableError ? (
              <div className="flex flex-col justify-center items-center py-12">
                <div className="text-red-500 font-medium mb-4">Failed to load users</div>
                <Button
                  onClick={() => retryUserTable()}
                  className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <DataTable
                columns={userTableColumns}
                data={userTableData.filter(flexologist => flexologist?.status === 1).map(flexologist => ({
                  ...flexologist,
                  full_name: flexologist?.full_name.trim(),
                }))}
                emptyText="No users found"
                tableContainerClassName="bg-white"
                enableSorting={true}
                enableSearch={true}
                searchFields={["full_name", "id"]}
                searchPlaceholder="Search by Name or ID"
                enableMyTeamDropdown={true}
                selectedDuration={myTeamDuration}
                onDurationChange={handleMyTeamDurationChange}
                onCustomRangeChange={handleMyTeamCustomRangeChange}
                durationOptions={filterOptions.duration}
              />
            )}

          </div>}

          {userInfo?.role_id === 1  && <div className="mb-8 py-4 sm:px-4 bg-[#F5F5F5] rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pl-2 sm:pl-0"> Business List</h2>

            {isBusinessTableLoading ? (

              <TableSkeleton rows={5} columns={4} />
            ) : businessTableError ? (
              <div className="flex flex-col justify-center items-center py-12">
                <div className="text-red-500 font-medium mb-4">Failed to load businesses</div>
                <Button
                  onClick={() => retryBusinessTable()}
                  className="bg-primary-base text-white hover:bg-primary-base/80 px-4 py-2 flex items-center justify-center"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <DataTable
                columns={businessTableColumns(openBusinessDetail)}
                data={businessTableData}
                emptyText="No businesses found"
                tableContainerClassName="bg-white"
                enableSorting={true}
                enableSearch={true}
                searchFields={["business_username", "id"]}
                searchPlaceholder="Search by Business Name or ID"
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
        onRetry={() => refetchBusinessInfo()}
      />
    </div>
  );
};
