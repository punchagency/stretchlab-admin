import { useState } from "react";
import { MetricCard, RechartsBarChart, FilterDropdown } from "@/components/shared";
import { DataTable } from "@/components/datatable";
import { type ColumnDef } from "@tanstack/react-table";

// Dummy data for the dashboard
const dashboardMetrics = [
  {
    title: "Revenue",
    value: "$42,300",
    subtitle: "This Month",
    buttonText: "View Details",
    buttonVariant: "primary" as const,
    showCurrency: true,
  },
  {
    title: "Bookings",
    value: "1,120",
    subtitle: "+8.3% Vs Last Month",
    buttonText: "See Sessions",
    buttonVariant: "primary" as const,
    showCurrency: false,
  },
  {
    title: "Security Incidents",
    value: "87%",
    subtitle: "+1% Vs Last Month",
    buttonText: "Utilization",
    buttonVariant: "primary" as const,
    showCurrency: false,
  },
  {
    title: "System Uptime",
    value: "+54",
    subtitle: "Excellent",
    buttonText: "Growth",
    buttonVariant: "primary" as const,
    showCurrency: false,
  },
];

const chartData = [
  { label: "Jan", value: 220 },
  { label: "Feb", value: 350 },
  { label: "Mar", value: 280 },
  { label: "Apr", value: 220 },
  { label: "May", value: 320 },
  { label: "Jun", value: 380 },
  { label: "Jul", value: 290 },
  { label: "Aug", value: 180 },
  { label: "Sep", value: 240 },
  { label: "Oct", value: 360 },
  { label: "Nov", value: 330 },
  { label: "Dec", value: 270 },
];

// Dummy user data for the table
interface UserData {
  id: string;
  name: string;
  status: "Accepted" | "Pending" | "Declined";
  email: string;
}

const userData: UserData[] = [
  { id: "1", name: "John Doe", status: "Accepted", email: "TaylorStudio.Com" },
  { id: "2", name: "Jane Smith", status: "Pending", email: "Morgan@Studio.Com" },
  { id: "3", name: "Michael Johnson", status: "Declined", email: "TaylorStudio.Com" },
  { id: "4", name: "Emily Davis", status: "Pending", email: "TaylorStudio.Com" },
  { id: "5", name: "David Wilson", status: "Accepted", email: "Taylor@Studio.Com" },
];

const userColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium">
            {row.getValue<string>("name").split(" ").map(n => n[0]).join("")}
          </span>
        </div>
        <span className="font-medium">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors = {
        Accepted: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Declined: "bg-red-100 text-red-800",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.getValue("email")}</span>
    ),
  },
];

// Filter options
const filterOptions = {
  location: ["By Location", "By Flexologist"],
  week: ["Weekly", "Monthly", "Yearly"],
  locations: ["All Locations", "Studio A", "Studio B", "Studio C", "Studio D"],
  flexologists: ["All Flexologists", "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Wilson"],
  clients: ["Total Client Visits", "% App Submissions", "Avg 1st Visit Quality %", "Avg Subsequent Visit Quality %", "By Flexologist", "Avg Aggregate Quality %"],
};

export const Dashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    location: "By Location",
    week: "Weekly",
    locations: "All Locations",
    flexologists: "All Flexologists",
    clients: "Total Client Visits",
  });

  const handleMetricClick = (title: string) => {
    console.log(`Clicked on ${title}`);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 sm:px-7">
          <h1 className="text-base font-semibold mb-3 text-gray-900">
            Performance Metrics Dashboard
          </h1>
        </div>


        <div className="px-5 sm:px-7 mt-5">
          <div className="mb-8 py-4 sm:px-6 bg-[#F5F5F5] rounded-lg shadow-md" >
            <h2 className="text-base font-semibold text-gray-900 mb-4">Check-Out Countdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          </div>
        </div>


        {/* Chart Section */}
        <div className="mb-8 py-4 sm:px-6 " >
          <div className=" bg-[#F5F5F5] rounded-lg shadow-md py-4 sm:px-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Check-Out Countdown</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6 justify-between">
                <FilterDropdown
                  label="Location"
                  value={selectedFilters.location}
                  options={filterOptions.location}
                  onChange={(value) => handleFilterChange('location', value)}
                />
                <FilterDropdown
                  label="Week"
                  value={selectedFilters.week}
                  options={filterOptions.week}
                  onChange={(value) => handleFilterChange('week', value)}
                />
                <FilterDropdown
                  label="Locations"
                  value={selectedFilters.locations}
                  options={filterOptions.locations}
                  onChange={(value) => handleFilterChange('locations', value)}
                />
                <FilterDropdown
                  label="Flexologists"
                  value={selectedFilters.flexologists}
                  options={filterOptions.flexologists}
                  onChange={(value) => handleFilterChange('flexologists', value)}
                />
                <FilterDropdown
                  label="Clients"
                  value={selectedFilters.clients}
                  options={filterOptions.clients}
                  onChange={(value) => handleFilterChange('clients', value)}
                />
              </div>

              {/* Bar Chart */}
              <div className=" p-1">
                <RechartsBarChart data={chartData} title="" maxValue={400} />
              </div>
            </div>
          </div>
        </div>
        {/* Another Metrics Section */}
        {/* <div className="px-5 sm:px-7 mt-5">
        <div className="mb-8 py-4 sm:px-6 bg-[#F5F5F5] rounded-lg shadow-md">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Check-Out Countdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Revenue"
              value="$42,300"
              subtitle="This Month"
              buttonText="View Details"
              buttonVariant="primary"
              showCurrency={true}
              onButtonClick={() => handleMetricClick("Revenue")}
            />
            <MetricCard
              title="Bookings"
              value="1,120"
              subtitle="+8.3% Vs Last Month"
              buttonText="See Sessions"
              buttonVariant="primary"
              showCurrency={false}
              onButtonClick={() => handleMetricClick("Bookings")}
            />
          </div>
        </div>
        </div> */}

        {/* User Table */}
        <div className="px-5 sm:px-7 mt-5">
        <div className="mb-8 py-4 sm:px-6 bg-[#F5F5F5] rounded-lg shadow-md">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Check-Out Countdown</h2>

          <div className=" bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-hidden">
            <DataTable
              columns={userColumns}
              data={userData}
              emptyText="No users found"
              tableContainerClassName="w-full"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
