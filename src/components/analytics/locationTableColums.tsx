import { type ColumnDef } from "@tanstack/react-table";
import type { LocationAnalyticsItem, } from "@/types";

interface LocationTableColumnsProps {
  metric?: string;
}

export const getLocationTableColumns = (props?: LocationTableColumnsProps): ColumnDef<LocationAnalyticsItem>[] => {
  const { metric } = props || {};

  return [
    {
        accessorKey: "name",
        header: "Flexologist Name",
        cell: ({ row }) => {
            const name = row.getValue("name") as string;
            return (
                <span className="text-gray-700 text-sm capitalize">{name}</span>
            );
        },
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
            const value = row.getValue("value") as number;

            return (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">
                        { metric === "Total Client Visits" ? value : `${value}%`}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const total = row.getValue("total") as number;

            return (
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                    {total}
                </span>
            );
        },
    },
  ];
};

export const locationTableColumns: ColumnDef<LocationAnalyticsItem>[] = getLocationTableColumns(); 