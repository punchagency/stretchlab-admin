import {
  Button as Button2,
  ContainLoader,
  SvgIcon,
  Modal,
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
    handleFlexAccess,
    isUpdatingFlex,
    showFlexConfirmation,
    setShowFlexConfirmation,
    pendingFlexAction,
    confirmUpdateFlex,
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
    handleFlexAccess,
    isUpdatingFlex,
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

      <Modal show={showFlexConfirmation} onClose={() => setShowFlexConfirmation(false)} size="sm">
        <div className="flex flex-col gap-4 py-4 px-2 md:px-6">
          <h1 className="text-lg md:text-xl font-semibold text-center mb-2">Confirm Flex Access Change</h1>
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to {pendingFlexAction?.status ? "give" : "restrict"} flex access for{" "}
            <span className="font-semibold">{pendingFlexAction?.email}</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button2 onClick={() => setShowFlexConfirmation(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
              Cancel
            </Button2>
            <Button2
              onClick={confirmUpdateFlex}
              disabled={isUpdatingFlex === pendingFlexAction?.email}
              className={`px-6 py-2 rounded-lg text-white ${pendingFlexAction?.status ? "bg-primary-base hover:bg-primary-base/80" : "bg-red-500 hover:bg-red-600"}`}
            >
              {isUpdatingFlex === pendingFlexAction?.email ? "Updating..." : pendingFlexAction?.status ? "Give Access" : "Restrict"}
            </Button2>
          </div>
        </div>
      </Modal>
    </div>
  );
};
