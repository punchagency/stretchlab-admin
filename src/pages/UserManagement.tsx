import {
  Button as Button2,
  ContainLoader,
  SvgIcon,
} from "@/components/shared";
import { DataTable } from "@/components/datatable";
import { ErrorHandle } from "@/components/app";
import { AnimatePresence, motion } from "framer-motion";
import { LocationSelectionModal } from "@/components/user-management/LocationSelectionModal";
import { useUserManagement } from "@/components/user-management/useUserManagement";
import { getUserColumns } from "@/components/user-management/columns";
import { InviteUserModal } from "@/components/user-management/InviteUserModal";
import { useState } from "react";

export const UserManagement = () => {
  const {
    managersData,
    isPendingManagers,
    errorManagers,
    isFetchingManagers,
    refetchManagers,
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
  } = useUserManagement();

  const [showInviteModal, setShowInviteModal] = useState(false);

  if (isPendingManagers) {
    return (
      <div className="w-full h-[90%]">
        <ContainLoader text="Fetching users..." />
      </div>
    );
  }

  if (errorManagers) {
    return <ErrorHandle retry={refetchManagers} />;
  }

  const userColumns = getUserColumns({
    isAccessing,
    handleAccess,
    isResending,
    resendInvite: (email) => resendInvite(email),
    allPermissions: managersData?.data?.data.permissions || [],
    isPermissionLoading,
    handlePermissionChange,
    setPendingPermission,
    setShowLocationModal,
  });

  return (
    <div className="px-7">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 md:mb-10 gap-2">
        <h3 className="md:text-2xl text-lg font-semibold ">
          User Management
        </h3>
        <Button2
          onClick={() => setShowInviteModal(true)}
          className="flex items-center self-start md:ml-0 gap-2 py-3 text-white bg-primary-base"
        >
          <SvgIcon name="email-send" fill="#fff" />
          Invite Manager
        </Button2>
      </div>

      {isFetchingManagers && !isPendingManagers && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center absolute top-7 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 font-semibold"
          >
            Refreshing...
          </motion.div>
        </AnimatePresence>
      )}

      <div>
        <DataTable
          handleModal={() => setShowInviteModal(true)}
          columns={userColumns}
          data={managersData?.data?.data.managers.map((manager: any) => ({
            ...manager,
            full_name: manager.full_name?.trim(),
          }))}
          emptyText="No manager invited yet."
          enableSearch
          searchFields={["full_name", "email"]}
          searchPlaceholder="Search by name or email"
          enableSorting
        />
      </div>

      <InviteUserModal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={sendInvite}
      />

      <LocationSelectionModal
        show={showLocationModal}
        onClose={() => {
          setShowLocationModal(false);
          setPendingPermission(null);
        }}
        onConfirm={handleLocationConfirm}
        isLoading={pendingPermission ? isPermissionLoading.has(`${pendingPermission.userId}-${pendingPermission.permissionTag}`) : false}
        initialSelectedLocations={
          pendingPermission
            ? managersData?.data?.data.managers.find((m: any) => m.id === pendingPermission.userId)?.excluded_locations || []
            : []
        }
      />
    </div>
  );
};
