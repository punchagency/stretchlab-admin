import { type ColumnDef } from "@tanstack/react-table";
import type { BusinessData } from "@/types";


export const businessTableColumns = (onViewDetails: (businessId: number) => void): ColumnDef<BusinessData>[] => [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   cell: ({ row }) => {
  //     const id = row.getValue("id") as number;
  //     return (
  //       <span className="text-gray-700">{id}</span>
  //     );
  //   },
  // },
  {
    accessorKey: "business_username",
    header: "Business Username",
    cell: ({ row }) => {
      const username = row.getValue("business_username") as string;
      return (
        <span className="font-medium text-gray-900">{username}</span>
      );
    },
  },
  {
    accessorKey: "buisness_flexologists_count",
    header: "Flexologists Count",
    cell: ({ row }) => {
      const count = row.getValue("buisness_flexologists_count") as number;
      return (
        <span className="text-gray-700">{count}</span>
      );
    },
  },
  {
    accessorKey: "business_created_at",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("business_created_at") as string;
      const date = new Date(createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      return (
        <span className="text-gray-600">{formattedDate}</span> 
      );
    },
  },
  {
    accessorKey: "business_note_sub_status",
    header: "Note Subscription",
    cell: ({ row }) => {
      const status = row.getValue("business_note_sub_status") as string | null;
      const statusConfig = {
        "trialing": { label: "Trialing", color: "bg-blue-100 text-blue-800" },
        "active": { label: "Active", color: "bg-green-100 text-green-800" },
        "inactive": { label: "Inactive", color: "bg-red-100 text-red-800" },
      };
      const config = status ? statusConfig[status as keyof typeof statusConfig] ||
        { label: status, color: "bg-gray-100 text-gray-800" } :
        { label: "None", color: "bg-gray-100 text-gray-600" };

      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "business_rpa_sub_status",
    header: "RPA Subscription",
    cell: ({ row }) => {
      const status = row.getValue("business_rpa_sub_status") as string | null;
      const statusConfig = {
        "trialing": { label: "Trialing", color: "bg-blue-100 text-blue-800" },
        "active": { label: "Active", color: "bg-green-100 text-green-800" },
        "inactive": { label: "Inactive", color: "bg-red-100 text-red-800" },
      };
      const config = status ? statusConfig[status as keyof typeof statusConfig] ||
        { label: status, color: "bg-gray-100 text-gray-800" } :
        { label: "None", color: "bg-gray-100 text-gray-600" };

      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions", 
    cell: ({ row }) => {
      const business = row.original;

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(business.business_id);
          }}
          className="bg-primary-base text-white hover:bg-primary-dark py-1 text-xs px-3 font-medium rounded-[100px]"
        >
          View Detail
        </button>
      );
    },
  },
]; 