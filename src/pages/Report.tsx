import { DataTable } from "@/components/datatable";
import { FilterDropdown } from "@/components/shared";
import { ContainLoader } from "@/components/shared/FullLoader";
import { ErrorHandle } from "@/components/app/ErrorHandle";
import { useReportData } from "@/components/report/useReportData";
import { getReportColumns } from "@/components/report/columns";

export const Report = () => {
  const {
    type,
    setType,
    data,
    isLoading,
    error,
    refetch,
    handleStatusChange,
    isUpdating,
  } = useReportData();

  const columns = getReportColumns({
    type,
    handleStatusChange,
    isUpdating,
  });

  if (isLoading) {
    return (
      <div className="w-full h-[90%]">
        <ContainLoader text="Fetching report..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[90%]">
        <ErrorHandle retry={refetch} />
      </div>
    );
  }

  const tableData = data?.data || [];

  return (
    <div className="p-4 sm:p-6 sm:pt-0 min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-4">
        <h3 className="md:text-2xl text-lg font-semibold capitalize">
          {type === "health"
            ? "Healthcare setup error report"
            : type === "resign_soon"
              ? "Resign Soon Report"
              : "Unused credit report"}
        </h3>
        <FilterDropdown
          value={type}
          options={[
            { value: "increase", label: "Unused credit report" },
            { value: "health", label: "Healthcare setup error report" },
            { value: "resign_soon", label: "Resign Soon Report" },
          ]}
          onChange={(value) => setType(value)}
          className="w-full md:w-70"
        />
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        emptyText="No data found"
        tableContainerClassName="bg-white"
        enableSorting
        enableSearch
        searchFields={
          type === "health"
            ? ["first_name", "last_name", "details", "user_id", "cell_phone"]
            : type === "resign_soon"
              ? ["full_name", "location", "package", "sessions_left"]
              : ["first_name", "last_name", "email", "user_id", "location", "package_name"]
        }
        searchPlaceholder="Search by name, email, user ID"
      />
    </div>
  );
};