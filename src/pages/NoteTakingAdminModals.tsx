import { Modal, Button as Button2, Input, SvgIcon } from "@/components/shared";
import { useCallback } from "react";

type PendingAction = {
  type: "access" | "status" | "delete";
  email: string;
  value: number | boolean;
} | null;

interface NoteTakingAdminModalsProps {
  showModal: boolean;
  onCloseModal: () => void;
  email: string;
  setEmail: (value: string) => void;
  formError: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  showAccessConfirmation: boolean;
  onCloseAccess: () => void;
  pendingAction: PendingAction;
  isAccessing: string;
  confirmUpdateAccess: () => void;

  showStatusConfirmation: boolean;
  onCloseStatus: () => void;
  isUpdating: string;
  confirmUpdateUserStatus: () => void;


  showDeleteConfirmation: boolean;
  onCloseDelete: () => void;
  isDeleting: string;
  confirmDeleteUser: () => void;
}

export const NoteTakingAdminModals = (props: NoteTakingAdminModalsProps) => {
  const {

    showModal,
    onCloseModal,
    email,
    setEmail,
    formError,
    isLoading,
    handleSubmit,


    showAccessConfirmation,
    onCloseAccess,
    pendingAction,
    isAccessing,
    confirmUpdateAccess,


    showStatusConfirmation,
    onCloseStatus,
    isUpdating,
    confirmUpdateUserStatus,

    // Delete Confirmation
    showDeleteConfirmation,
    onCloseDelete,
    isDeleting,
    confirmDeleteUser,
  } = props;

  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [setEmail]
  );

  return (
    <>
    
      <Modal show={showModal} onClose={onCloseModal}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 px-2 md:px-10">
          <h1 className="text-lg md:text-2xl font-semibold text-center mb-4">Invite Flexologist</h1>
          <Input
            label="Email Address"
            type="email"
            icon="mail"
            placeholder="flexologist@gmail.com"
            value={email}
            name="email"
            onChange={onEmailChange}
          />
          {formError && (
            <div className="bg-red-100 rounded-lg px-2 py-3">
              <p className="text-red-500 font-medium text-sm text-center">{formError}</p>
            </div>
          )}
          <Button2 disabled={isLoading} className="bg-primary-base mt-2 py-3 w-fit mx-auto flex items-center gap-2 text-white">
            <SvgIcon name="email-send" fill="#fff" />
            {isLoading ? "Sending..." : "Send Invite"}
          </Button2>
        </form>
      </Modal>


      <Modal show={showAccessConfirmation} onClose={onCloseAccess} size="sm">
        <div className="flex flex-col gap-4 py-4 px-2 md:px-6">
          <h1 className="text-lg md:text-xl font-semibold text-center mb-2">Confirm Access Change</h1>
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to {pendingAction?.value === 2 ? "disable" : "enable"} access for{" "}
            <span className="font-semibold">{pendingAction?.email}</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button2 onClick={onCloseAccess} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
              Cancel
            </Button2>
            <Button2
              onClick={confirmUpdateAccess}
              disabled={isAccessing === pendingAction?.email}
              className={`px-6 py-2 rounded-lg text-white ${pendingAction?.value === 2 ? "bg-red-500 hover:bg-red-600" : "bg-primary-base hover:bg-primary-base/80"}`}
            >
              {isAccessing === pendingAction?.email ? "Updating..." : pendingAction?.value === 2 ? "Disable" : "Enable"}
            </Button2>
          </div>
        </div>
      </Modal>

    
      <Modal show={showStatusConfirmation} onClose={onCloseStatus} size="sm">
        <div className="flex flex-col gap-4 py-4 px-2 md:px-6">
          <h1 className="text-lg md:text-xl font-semibold text-center mb-2">Confirm Admin Access Change</h1>
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to {pendingAction?.value ? "give" : "restrict"} admin access for{" "}
            <span className="font-semibold">{pendingAction?.email}</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button2 onClick={onCloseStatus} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
              Cancel
            </Button2>
            <Button2
              onClick={confirmUpdateUserStatus}
              disabled={isUpdating === pendingAction?.email}
              className={`px-6 py-2 rounded-lg text-white ${pendingAction?.value ? "bg-primary-base hover:bg-primary-base/80" : "bg-red-500 hover:bg-red-600"}`}
            >
              {isUpdating === pendingAction?.email ? "Updating..." : pendingAction?.value ? "Give Access" : "Restrict"}
            </Button2>
          </div>
        </div>
      </Modal>


      <Modal show={showDeleteConfirmation} onClose={onCloseDelete} size="sm">
        <div className="flex flex-col gap-4 py-4 px-2 md:px-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <SvgIcon name="trash" fill="#DC2626" />
            </div>
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-center mb-2">Delete Flexologist</h1>
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{pendingAction?.email}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button2 onClick={onCloseDelete} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
              Cancel
            </Button2>
            <Button2 onClick={confirmDeleteUser} disabled={isDeleting === pendingAction?.email} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
              {isDeleting === pendingAction?.email ? "Deleting..." : "Delete"}
            </Button2>
          </div>
        </div>
      </Modal>
    </>
  );
};