import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAdminReport, changeReportStatus, type AdminReportResponse } from "@/service/report";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";

export const useReportData = () => {
    const [type, setType] = useState<string>("health");

    const { data, isLoading, error, refetch } = useQuery<AdminReportResponse>({
        queryKey: ["adminReport", type],
        queryFn: () => getAdminReport(type),
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const statusMutation = useMutation({
        mutationFn: changeReportStatus,
        onSuccess: () => {
            renderSuccessToast("Status updated successfully");
            refetch();
        },
        onError: (error: any) => {
            renderErrorToast(error?.response?.data?.message || "Failed to update status");
        },
    });

    const handleStatusChange = (id: number, currentCompleted: boolean | null) => {
        const newStatus = currentCompleted ? "pending" : "completed";
        statusMutation.mutate({
            id,
            type,
            status: newStatus,
        });
    };

    return {
        type,
        setType,
        data,
        isLoading,
        error,
        refetch,
        handleStatusChange,
        isUpdating: statusMutation.isPending,
    };
};
