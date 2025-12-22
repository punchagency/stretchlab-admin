import { useState } from "react";
import { Button } from "@/components/shared";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { deleteUser, removeData } from "@/service/settings";
import { deleteUserCookie } from "@/utils";
import { renderErrorToast } from "@/components/utils";

export const AccountDeletionSection = () => {
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [isRemoveDataModalOpen, setIsRemoveDataModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleLogout = () => {
        deleteUserCookie();
        window.location.href = "/login";
    };

    const handleRemoveData = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await removeData();
            if (response.status === 200 || response.status === 204) {
                handleLogout();
            } else {
                setError(true);
                renderErrorToast("Failed to remove data. Please try again.");
            }
        } catch (err) {
            setError(true);
            renderErrorToast("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await deleteUser();
            if (response.status === 200 || response.status === 204) {
                handleLogout();
            } else {
                setError(true);
                renderErrorToast("Failed to delete account. Please try again.");
            }
        } catch (err) {
            setError(true);
            renderErrorToast("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-border pb-3 sm:pb-4 px-2 sm:px-6">
                <h2 className="text-base text-gray-900 mb-1 font-semibold">
                    Account Deletion
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Manage your account data and existence.
                </p>
            </div>

            <div className="space-y-6 px-2 sm:px-6">
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-gray-900">Remove Data</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                        This will permanently remove all your data associated with this account.
                    </p>
                    <div className="w-full sm:w-auto">
                        <Button
                            onClick={() => {
                                setError(false);
                                setIsRemoveDataModalOpen(true);
                            }}
                            className="py-2 px-4 text-sm border border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white transition-colors rounded-md flex items-center justify-center"
                        >
                            Remove Data
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-border pt-4">
                    <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                        This will permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <div className="w-full sm:w-auto">
                        <Button
                            onClick={() => {
                                setError(false);
                                setIsDeleteUserModalOpen(true);
                            }}
                            className="py-2 px-4 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors rounded-md flex items-center justify-center"
                        >
                            Delete My Account
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isRemoveDataModalOpen}
                onClose={() => setIsRemoveDataModalOpen(false)}
                onConfirm={handleRemoveData}
                title="Remove Data"
                message="Are you sure you want to remove all your data? This action cannot be undone."
                loading={loading}
                error={error}
                confirmText="Remove"
                confirmButtonClassName="bg-red-500 hover:bg-red-600"
                confirmPhrase="remove data"
            />

            <ConfirmModal
                isOpen={isDeleteUserModalOpen}
                onClose={() => setIsDeleteUserModalOpen(false)}
                onConfirm={handleDeleteUser}
                title="Delete Account"
                message="Are you sure you want to delete your account? This will permanently delete your account and all associated data. This action cannot be undone."
                loading={loading}
                error={error}
                confirmText="Delete"
                confirmButtonClassName="bg-red-500 hover:bg-red-600"
                confirmPhrase="delete account"
            />
        </div>
    );
};
