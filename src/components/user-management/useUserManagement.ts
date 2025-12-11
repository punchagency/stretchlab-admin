import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    fetchManagers,
    inviteManager,
    updateManagerAccess,
    grantOrRevokePermission,
} from "@/service/user";
import {
    renderErrorToast,
    renderSuccessToast,
    renderWarningToast,
} from "@/components/utils";
import type { ApiError } from "@/types";

export const useUserManagement = () => {
    const {
        data,
        isPending: isPendingManagers,
        error,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["managers"],
        queryFn: fetchManagers,
    });

    const [isResending, setIsResending] = useState("");
    const [isAccessing, setIsAccessing] = useState<number | null>(null);
    const [isPermissionLoading, setIsPermissionLoading] = useState<Set<string>>(
        new Set()
    );

    // Location modal state
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [pendingPermission, setPendingPermission] = useState<{
        userId: number;
        permissionTag: string;
        addPermission: boolean;
    } | null>(null);

    const resendInvite = async (email: string, onSuccess?: () => void) => {
        setIsResending(email);
        try {
            const response = await inviteManager(email);
            if (response.status === 200) {
                renderSuccessToast(response.data.message);
                refetch();
                onSuccess?.();
            }
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.response?.status === 409) {
                renderWarningToast(apiError.response.data.message);
            } else {
                renderErrorToast(apiError.response.data.message);
            }
        } finally {
            setIsResending("");
        }
    };

    const handleAccess = async (user_id: number, enable: boolean) => {
        setIsAccessing(user_id);
        try {
            const response = await updateManagerAccess(user_id, enable);
            if (response.status === 200) {
                renderSuccessToast(response.data.message);
                refetch().finally(() => {
                    setIsAccessing(null);
                });
            } else {
                renderErrorToast(response.data.message);
                setIsAccessing(null);
            }
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(
                apiError.response?.data?.message || "Error updating access"
            );
            setIsAccessing(null);
        }
    };

    const handlePermissionChange = async (
        user_id: number,
        permission_tag: string,
        add_permission: boolean
    ) => {
        // If granting exclude_location permission, show location modal
        if (permission_tag === "exclude_location" && add_permission) {
            setPendingPermission({
                userId: user_id,
                permissionTag: permission_tag,
                addPermission: add_permission,
            });
            setShowLocationModal(true);
            return;
        }

        const key = `${user_id}-${permission_tag}`;
        setIsPermissionLoading((prev) => new Set(prev).add(key));

        try {
            const response = await grantOrRevokePermission({
                user_id,
                permission_tag,
                add_permission,
            });

            if (response.status >= 200) {
                renderSuccessToast(response.data.message);
                refetch();
            } else {
                renderErrorToast(response.data.message);
            }
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(
                apiError.response?.data?.message || "Error updating permission"
            );
        } finally {
            setIsPermissionLoading((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const handleLocationConfirm = async (selectedLocations: string[]) => {
        if (!pendingPermission) return;

        const { userId, permissionTag, addPermission } = pendingPermission;
        const key = `${userId}-${permissionTag}`;
        setIsPermissionLoading((prev) => new Set(prev).add(key));

        try {
            const response = await grantOrRevokePermission({
                user_id: userId,
                permission_tag: permissionTag,
                add_permission: addPermission,
                excluded_locations: selectedLocations,
            });

            if (response.status >= 200) {
                renderSuccessToast(response.data.message);
                refetch();
                setShowLocationModal(false);
                setPendingPermission(null);
            } else {
                renderErrorToast(response.data.message);
            }
        } catch (error) {
            const apiError = error as ApiError;
            renderErrorToast(
                apiError.response?.data?.message || "Error updating permission"
            );
        } finally {
            setIsPermissionLoading((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const sendInvite = async (email: string) => {
        const response = await inviteManager(email);
        if (response.status === 200) {
            renderSuccessToast(response.data.message);
            refetch();
            return true;
        }
        return false;
    };

    return {
        managersData: data,
        isPendingManagers,
        errorManagers: error,
        isFetchingManagers: isFetching,
        refetchManagers: refetch,
        resendInvite,
        isResending,
        handleAccess,
        isAccessing,
        handlePermissionChange,
        isPermissionLoading,
        showLocationModal,
        setShowLocationModal,
        pendingPermission,
        setPendingPermission,
        handleLocationConfirm,
        sendInvite,
    };
};
