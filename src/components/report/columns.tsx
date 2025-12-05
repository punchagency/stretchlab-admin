import { type ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

interface GetReportColumnsProps {
    type: string;
    handleStatusChange: (id: number, currentCompleted: boolean | null) => void;
    isUpdating: boolean;
}

const getCompletionBadge = (completed: boolean | null) => {
    if (completed) {
        return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
            </span>
        );
    }
    return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
        </span>
    );
};

export const getReportColumns = ({
    type,
    handleStatusChange,
    isUpdating,
}: GetReportColumnsProps): ColumnDef<any>[] => {
    if (type === "health") {
        return [
            {
                accessorKey: "first_name",
                header: "Client Name",
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
                accessorKey: "due_date",
                header: "Due Date",
            },
            {
                accessorKey: "sold_by",
                header: "Sold By",
            },
            {
                accessorKey: "location",
                header: "Location",
                cell: ({ row }) => {
                    const location = row.getValue("location") as string;
                    return <p className="capitalize py-2 ">{location}</p>;
                },
            },
            // {
            //     accessorKey: "completed",
            //     header: "Completed",
            //     cell: ({ row }) => {
            //         const completed = row.getValue("completed") as boolean | null;
            //         return getCompletionBadge(completed);
            //     },
            // },
            // {
            //     id: "change_status",
            //     header: "Change Status",
            //     cell: ({ row }) => {
            //         const completed = row.original.completed as boolean | null;
            //         const id = row.original.id;

            //         return (
            //             <Switch
            //                 checked={completed === true}
            //                 onCheckedChange={() => handleStatusChange(id, completed)}
            //                 disabled={isUpdating}
            //                 className="data-[state=checked]:bg-primary-base"
            //             />
            //         );
            //     },
            // },
            // {
            //     accessorKey: "completed_at",
            //     header: "Completed At",
            //     cell: ({ row }) => {
            //         const completedAt = row.getValue("completed_at") as string | null;
            //         if (!completedAt) return <span>N/A</span>;
            //         const date = new Date(completedAt);
            //         const formatted = date.toLocaleString("en-US", {
            //             year: "numeric",
            //             month: "short",
            //             day: "numeric",
            //             hour: "2-digit",
            //             minute: "2-digit",
            //         });
            //         return <span className="text-gray-600">{formatted}</span>;
            //     },
            // },
            // {
            //     accessorKey: "updated_at",
            //     header: "Updated At",
            //     cell: ({ row }) => {
            //         const updatedAt = row.getValue("updated_at") as string | null;
            //         if (!updatedAt) return <span>N/A</span>;
            //         const date = new Date(updatedAt);
            //         const formatted = date.toLocaleString("en-US", {
            //             year: "numeric",
            //             month: "short",
            //             day: "numeric",
            //             hour: "2-digit",
            //             minute: "2-digit",
            //         });
            //         return <span className="text-gray-600">{formatted}</span>;
            //     },
            // },
        ];
    }

    if (type === "resign_soon") {
        return [
            {
                accessorKey: "full_name",
                header: "Client Name",
                cell: ({ row }) => {
                    const fullName = row.getValue("full_name") as string;
                    return <p className="capitalize py-2">{fullName}</p>;
                },
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
                accessorKey: "package",
                header: "Package",
                cell: ({ row }) => {
                    const value = row.getValue("package") as string;
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
            // {
            //     accessorKey: "sessions_left",
            //     header: "Sessions Left",
            // },
            {
                accessorKey: "sessions_left",
                header: "Sessions Left",
                cell: ({ row }) => {
                    const value = row.getValue("sessions_left") as string;
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
                accessorKey: "expiration_date",
                header: "Expiration Date",
            },
            {
                accessorKey: "completed",
                header: "Completed",
                cell: ({ row }) => {
                    const completed = row.getValue("completed") as boolean | null;
                    return getCompletionBadge(completed);
                },
            },
            {
                id: "change_status",
                header: "Change Status",
                cell: ({ row }) => {
                    const completed = row.original.completed as boolean | null;
                    const id = row.original.id;
                    return (
                        <Switch
                            className="data-[state=checked]:bg-primary-base"
                            checked={completed === true}
                            onCheckedChange={() => handleStatusChange(id, completed)}
                            disabled={isUpdating}
                        />
                    );
                },
            },
            {
                accessorKey: "completed_at",
                header: "Completed At",
                cell: ({ row }) => {
                    const completedAt = row.getValue("completed_at") as string | null;
                    if (!completedAt) return <span>N/A</span>;
                    const date = new Date(completedAt);
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
            {
                accessorKey: "updated_at",
                header: "Updated At",
                cell: ({ row }) => {
                    const updatedAt = row.getValue("updated_at") as string | null;
                    if (!updatedAt) return <span>N/A</span>;
                    const date = new Date(updatedAt);
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
    }

    // Default (Unused credit report / increase)
    return [
        {
            accessorKey: "first_name",
            header: "Client Name",
            cell: ({ row }) => {
                const first = row.getValue("first_name") as string;
                const last = row.original.last_name;
                return <p className="capitalize py-2">{`${first || ""} ${last || ""}`.trim()}</p>;
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
            header: "Max Monthly Credits",
            cell: ({ row }) => {
                const value = row.getValue("package_name") as string;
                const shortValue = value.includes('-') ? value.split('-').pop()?.trim() : value;

                const isLong = (shortValue || "").length > 20;
                return isLong ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[220px] truncate cursor-default py-2">{shortValue}</div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">{shortValue}</TooltipContent>
                    </Tooltip>
                ) : (
                    <div className="max-w-[180px] truncate cursor-default">{shortValue}</div>
                );
            },
        },
        {
            accessorKey: "unused_credit",
            header: "Unused Credit",
        },
        // {
        //     accessorKey: "completed",
        //     header: "Completed",
        //     cell: ({ row }) => {
        //         const completed = row.getValue("completed") as boolean | null;
        //         return getCompletionBadge(completed);
        //     },
        // },
        // {
        //     id: "change_status",
        //     header: "Change Status",
        //     cell: ({ row }) => {
        //         const completed = row.original.completed as boolean | null;
        //         const id = row.original.id;
        //         return (
        //             <Switch
        //                 checked={completed === true}
        //                 onCheckedChange={() => handleStatusChange(id, completed)}
        //                 disabled={isUpdating}
        //                 className="data-[state=checked]:bg-primary-base"
        //             />
        //         );
        //     },
        // },
        // {
        //     accessorKey: "completed_at",
        //     header: "Completed At",
        //     cell: ({ row }) => {
        //         const completedAt = row.getValue("completed_at") as string | null;
        //         if (!completedAt) return <span>N/A</span>;
        //         const date = new Date(completedAt);
        //         const formatted = date.toLocaleString("en-US", {
        //             year: "numeric",
        //             month: "short",
        //             day: "numeric",
        //             hour: "2-digit",
        //             minute: "2-digit",
        //         });
        //         return <span className="text-gray-600">{formatted}</span>;
        //     },
        // },
        // {
        //     accessorKey: "updated_at",
        //     header: "Updated At",
        //     cell: ({ row }) => {
        //         const updatedAt = row.getValue("updated_at") as string | null;
        //         if (!updatedAt) return <span>N/A</span>;
        //         const date = new Date(updatedAt);
        //         const formatted = date.toLocaleString("en-US", {
        //             year: "numeric",
        //             month: "short",
        //             day: "numeric",
        //             hour: "2-digit",
        //             minute: "2-digit",
        //         });
        //         return <span className="text-gray-600">{formatted}</span>;
        //     },
        // },
    ];
};
