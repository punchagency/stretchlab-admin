import { type ColumnDef } from "@tanstack/react-table";
import type { LocationAnalyticsItem, } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


const getDescription = (dataSet: string | undefined) => {
    switch (dataSet) {
        case "% App Submissions":
            return {
                valueColumn: "Average Note Quality %",
                totalColumn: "Total Flexologist Appointment",
                hoveredValueText: "% of Appointment Submitted with the App",
            }

        case "Total Client Visits":
            return {
                valueColumn: "Flexologist Appointment",
                totalColumn: "Total Appointment",
                hoveredValueText: "Total Appointment of Flexologist",
            }

        case "Avg. Note Quality %":
            return {
                valueColumn: "Average Note Quality %",
                totalColumn: "Total Flexologist Appointment",
                hoveredValueText: "Average % Quality of Appointment Notes",
            }


        default:
            return {
                valueColumn: "",
                totalColumn: "",
                hoveredValueText: "",
            }
    }
};

interface LocationTableColumnsProps {
    metric?: string;
    selectedLocation?: string;
}

export const getLocationTableColumns = (props?: LocationTableColumnsProps): ColumnDef<LocationAnalyticsItem>[] => {
    const { metric, selectedLocation } = props || {};
    const { valueColumn, totalColumn, hoveredValueText } = getDescription(metric);
    
    const columns: ColumnDef<LocationAnalyticsItem>[] = [
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
            header: valueColumn,
            cell: ({ row }) => {
                const value = row.getValue("value") as number;

                return (
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600">
                                    {metric === "Total Client Visits" ? value : `${value}%`}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{hoveredValueText} {selectedLocation ? `at ` : ""}  <span className="font-bold capitalize">{selectedLocation ? ` ${selectedLocation}` : ""}</span></p>
                        </TooltipContent>
                    </Tooltip>
                );
            },
        },
    ];

    // Only add the total column if the metric is not "Total Client Visits"
    if (metric !== "Total Client Visits") {
        columns.push({
            accessorKey: "total",
            header: totalColumn,
            cell: ({ row }) => {
                const total = row.getValue("total") as number;

                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                        {total}
                    </span>
                );
            },
        });
    }

    return columns;
};

export const locationTableColumns: ColumnDef<LocationAnalyticsItem>[] = getLocationTableColumns(); 