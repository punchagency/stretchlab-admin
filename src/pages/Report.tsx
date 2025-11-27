import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/datatable";
import { FilterDropdown } from "@/components/shared";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ContainLoader } from "@/components/shared/FullLoader";
import { ErrorHandle } from "@/components/app/ErrorHandle";
import { useQuery } from "@tanstack/react-query";
import { getAdminReport, type AdminReportResponse } from "@/service/report";

export const Report = () => {
  const [type, setType] = useState<string>("health");

  const { data, isLoading, error, refetch } = useQuery<AdminReportResponse>({
    queryKey: ["adminReport", type],
    queryFn: () => getAdminReport(type),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<any>[] =
    type === "health"
      ? [
        {
          accessorKey: "first_name",
          header: "Name",
          cell: ({ row }) => {
            const first = row.getValue("first_name") as string;
            const last = row.original.last_name;
            return <span className="capitalize">{`${first || ""} ${last || ""}`.trim()}</span>;
          },
        },
        {
          accessorKey: "email",
          header: "Email",
        },
        {
          accessorKey: "user_id",
          header: "User ID",
        },
        {
          accessorKey: "gsl_category",
          header: "GSL Category",
        },
        {
          accessorKey: "details",
          header: "Details",
          cell: ({ row }) => {
            const value = row.getValue("details") as string;
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[220px] truncate cursor-default py-2">{value}</div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">{value}</TooltipContent>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "amount",
          header: "Amount",
        },
        {
          accessorKey: "due_date",
          header: "Due Date",
        },
          {
          accessorKey: "due_status",
          header: "Due Status",
        },
        {
          accessorKey: "agreement_date",
          header: "Agreement Date",
        },
        {
          accessorKey: "agreement_id",
          header: "Agreement ID",
        },
        {
          accessorKey: "processed_by",
          header: "Processed By",
        },
         {
          accessorKey: "sold_by",
          header: "Sold By",
        },
        {
          accessorKey: "invoice_id",
          header: "Invoice ID",
        },
        {
          accessorKey: "invoice_category",
          header: "Invoice Category",
        },
        {
          accessorKey: "invoice_class",
          header: "Invoice Class",
        },
        {
          accessorKey: "invoice_type",
          header: "Invoice Type",
        },
        {
          accessorKey: "location",
          header: "Location",
          cell: ({ row }) => {
            const location = row.getValue("location") as string;
            return <span className="capitalize">{location}</span>;
          },
        },
        {
          accessorKey: "user_pay_preference",
          header: "User Pay Preference",
        },
       
        {
          accessorKey: "cell_phone",
          header: "Cell Phone",
        },
      ]
      : [
        {
          accessorKey: "first_name",
          header: "Name",
          cell: ({ row }) => {
            const first = row.getValue("first_name") as string;
            const last = row.original.last_name;
            return <span className="capitalize">{`${first || ""} ${last || ""}`.trim()}</span>;
          },
        },
        {
          accessorKey: "email",
          header: "Email",
        },
        {
          accessorKey: "user_id",
          header: "User ID",
        },
        {
          accessorKey: "location",
          header: "Location",
          cell: ({ row }) => {
            const value = row.getValue("location") as string;
            const isLong = (value || "").length > 20;
            return isLong ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[180px] truncate capitalize cursor-default">{value}</div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs capitalize">{value}</TooltipContent>
              </Tooltip>
            ) : (
              <div className="max-w-[180px] truncate capitalize cursor-default">{value}</div>
            );
          },
        },
        {
          accessorKey: "package_name",
          header: "Package",
          cell: ({ row }) => {
            const value = row.getValue("package_name") as string;
            const isLong = (value || "").length > 20;
            return isLong ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[220px] truncate cursor-default py-2">{value}</div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">{value}</TooltipContent>
              </Tooltip>
            ) : (
              <div className="max-w-[220px] truncate cursor-default">{value}</div>
            );
          },
        },
        {
          accessorKey: "unused_credit",
          header: "Unused Credit",
        },
        {
          accessorKey: "cell_phone",
          header: "Cell Phone",
        },
        {
          accessorKey: "created_at",
          header: "Created At",
          cell: ({ row }) => {
            const created = row.getValue("created_at") as string;
            const date = new Date(created);
            const formatted = date.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            return <span className="text-gray-600">{formatted}</span>;
          },
        },
      ];

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
          {type === "health" ? "Healthcare setup error report" : "Unused credit report"}
        </h3>
        <FilterDropdown
          // label="Report Type"
          value={type}
          options={[
            { value: "increase", label: "Unused credit report" },
            { value: "health", label: "Healthcare setup error report" },
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
            : ["first_name", "last_name", "email", "user_id", "location", "package_name"]
        }
        searchPlaceholder="Search by name, email, user ID"
      />
    </div>
  );
};