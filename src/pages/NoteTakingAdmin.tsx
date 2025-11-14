import { useQuery } from "@tanstack/react-query";
import {
  fetchUsers,
  inviteFlexologist,
  updateUserAccess,
  updateUserStatus,
  deleteUser,
} from "@/service/notetaking";
import { useState } from "react";
import {
  // Button as Button2,
  BulkInviteModal,
  ContainLoader,
  SvgIcon,
} from "@/components/shared";
import { DataTable, type Payment } from "@/components/datatable";
import type { ApiError, BillingInfo } from "@/types";
import {
  renderErrorToast,
  renderSuccessToast,
  renderWarningToast,
} from "@/components/utils";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorHandle, PaymentCollection } from "@/components/app";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserInfo } from "@/utils/user";
import { Checkbox } from "@/components/ui/checkbox";
import { NoteTakingAdminModals } from "./NoteTakingAdminModals";

export const NoteTakingAdmin = () => {
  const { data, isPending, error, isFetching, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showBulkInviteModal, setShowBulkInviteModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccessing, setIsAccessing] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [update, setUpdate] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [isUpdating, setIsUpdating] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAccessConfirmation, setShowAccessConfirmation] = useState(false);
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "access" | "status" | "delete";
    email: string;
    id?: number;
    value: number | boolean;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState("");

  const userInfo = getUserInfo();
  const canSeeResendColumn =
    userInfo?.role_id === 1 ||
    userInfo?.role_id === 2 ||
    userInfo?.permissions?.some(
      (perm: any) => perm.permission_tag === "invite_flex"
    );
  // Handle user selection for resend invite
  const handleUserSelection = (email: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, email]);
    } else {
      setSelectedUsers(prev => prev.filter(userEmail => userEmail !== email));
    }
  };

  // Handle resend invite for selected users (only status 3 users)
  const handleResendInvite = () => {
    if (selectedUsers.length === 0) {
      renderWarningToast("Please select at least one user to resend invite");
      return;
    }
    setShowResendModal(true);
  };

  // Clear selected users
  const clearSelectedUsers = () => {
    setSelectedUsers([]);
  };

  const getTooltipDescription = (status: number) => {
    switch (status) {
      case 1:
        return "Flexologist is Active";
      case 2:
        return "Flexologist is Disabled";
      case 3:
        return "Flexologist is Invited, but not yet accepted";
      case 4:
        return "Flexologist has accept invite, but has not yet to verify clubready details.";
      case 5:
        return "Flexologist has accepted invite, but has not yet added clubready details.";

      default:
        return "";
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-[90%]">
        <ContainLoader text="Fetching users..." />
      </div>
    );
  }
  if (error) {
    return <ErrorHandle retry={refetch} />;
  }

  // previous resend invite functionality
  // const resendInvite = async (email: string) => {
  //   setIsResending(email);
  //   try {
  //     const response = await inviteFlexologist(email, true);
  //     if (response.status === 200) {
  //       renderSuccessToast(response.data.message);
  //       // refetch();
  //       setEmail("");
  //       setShowModal(false);
  //     }
  //   } catch (error) {
  //     const apiError = error as ApiError;
  //     if (apiError.response.status === 409) {
  //       renderWarningToast(apiError.response.data.message);
  //     } else {
  //       renderErrorToast(apiError.response.data.message);
  //     }
  //   } finally {
  //     setIsResending("");
  //   }
  // };

  const handleUpdateUserStatus = async (email: string, restrict: boolean) => {
    setPendingAction({ type: "status", email, value: restrict });
    setShowStatusConfirmation(true);
  };

  const confirmUpdateUserStatus = async () => {
    if (!pendingAction || pendingAction.type !== "status") return;


    const { email, value } = pendingAction;
    setIsUpdating(email);
    try {
      const response = await updateUserStatus(email, value as boolean);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        refetch();
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
    } finally {
      setIsUpdating("");
      setShowStatusConfirmation(false);
      setPendingAction(null);
    }
  };

  const handleAccess = async (status: number, email: string) => {
    setPendingAction({ type: "access", email, value: status });

    setShowAccessConfirmation(true);
  };

  const confirmUpdateAccess = async () => {
    if (!pendingAction || pendingAction.type !== "access") return;
    const { email, value } = pendingAction;
    setIsAccessing(email);
    try {
      const response = await updateUserAccess(email, value as number);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        refetch().finally(() => {
          setIsAccessing("");
        });
      } else {
        renderErrorToast(response.data.message);
        setIsAccessing("");
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message);
      setIsAccessing("");
    } finally {
      setShowAccessConfirmation(false);
      setPendingAction(null);
    }
  };

  const handleDeleteUser = (id: number, email: string) => {
    setPendingAction({ type: "delete", email, id, value: false });
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = async () => {
    if (!pendingAction || pendingAction.type !== "delete") return;
    const { email, id } = pendingAction;
    setIsDeleting(email);
    try {
      const response = await deleteUser(id as number);
      if (response.status === 200) {
        renderSuccessToast(response.data.message || "User deleted successfully");
        refetch();
      }
    } catch (error) {
      const apiError = error as ApiError;
      renderErrorToast(apiError.response.data.message || "Failed to delete user");
    } finally {
      setIsDeleting("");
      setShowDeleteConfirmation(false);
      setPendingAction(null);
    }
  };

  const handleSingleInvite = async (email: string) => {
    setIsSendingInvite(email);
    try {
      const response = await inviteFlexologist(email, false);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        // refetch();
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response.status === 409) {
        renderWarningToast(apiError.response.data.message);
      } else {
        renderErrorToast(apiError.response.data.message);
      }
    } finally {
      setIsSendingInvite("");
    }
  };
  const userColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("full_name") as string;
        const locations = row.original.locations?.list ?? [];
      
        // Find the index of the active location
        const activeLocationIndex =
          locations.findIndex((l) => l.active && !l.primary) !== -1
            ? locations.findIndex((l) => l.active && !l.primary)
            : locations.findIndex((l) => l.active && l.primary);
      
        return (
          <Tooltip>
            <TooltipTrigger>
              <span className="cursor-help underline decoration-dotted underline-offset-4">
                {name}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs ">
              {locations.length > 0 ? (
                <div className="space-y-1">
                  {locations.map((loc, idx) => {
                    const isActive = idx === activeLocationIndex;
      
                    return (
                      <div key={`${loc.name}-${idx}`} className="flex items-center gap-2">
                        <span className="text-white/90 capitalize">{loc.name}</span>
                        {isActive && (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-700 rounded-full" />
                            <span className="ml-0.5 inline-block rounded bg-white/20 px-1 py-[1px] text-[10px] leading-none">
                              active
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span>No locations</span>
              )}
            </TooltipContent>
          </Tooltip>
        );
      },      
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      // id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as number;
        const statuses: Record<number, string> = {
          1: "Active",
          2: "Disabled",
          3: "Invited",
          4: "Pending",
          5: "Pending",
        };
        const badgeColor = {
          1: "bg-[#E7F6EC] text-[#036B26]",
          2: "bg-[#FBEAE9] text-[#9E0A05]",
          3: "bg-[#FEF6E7] text-[#865503]",
          4: "bg-[#FEF6E7] text-[#865503]",
          5: "bg-[#FEF6E7] text-[#865503]",
        } as const;

        return status ? (
          <Tooltip>
            <TooltipTrigger>
              <div
                className={`${badgeColor[status as keyof typeof badgeColor]
                  } px-2 py-1.5 rounded-2xl w-20 text-center font-medium`}
              >
                {statuses[status]}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipDescription(status)}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <p className="text-gray-500">Not Invited</p>
        );
      },
    },
    {
      accessorKey: "invited_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Invited
          </Button>
        );
      },
      cell: ({ row }) => {
        const dateInvited = row.getValue("invited_at") as string;

        return dateInvited ? (
          <div className=" font-medium">
            {new Date(dateInvited).toLocaleDateString()}
          </div>
        ) : (
          <p className="text-gray-500">Not Invited</p>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Access",
      cell: ({ row }) => {
        const access = row.getValue("status") as number;
        const email = row.getValue("email") as string;
        return access === 1 || access === 2 ? (
          <Switch
            className="data-[state=checked]:bg-primary-base"
            onCheckedChange={() => handleAccess(access === 1 ? 2 : 1, email)}
            checked={access === 1}
            disabled={isAccessing === email}
          />
        ) : (
          <p className="text-gray-500">No Access</p>
        );
      },
    },

    ...(canSeeResendColumn
      ? [{
        id: "resend_invite",
        header: () => {
          // const selectableUsers = data?.data?.users?.filter((user: any) =>
          //   user.status === 3
          // ) || [];
          // const allSelectableSelected = selectableUsers.length > 0 &&
          //   selectableUsers.every((user: any) => selectedUsers.includes(user.email));
          // const someSelectableSelected = selectableUsers.some((user: any) =>
          //   selectedUsers.includes(user.email)
          // );

          // const handleSelectAll = (checked: boolean) => {
          //   if (checked) {
          //     const selectableEmails = selectableUsers.map((user: any) => user.email);
          //     setSelectedUsers(selectableEmails);
          //   } else {
          //     setSelectedUsers([]);
          //   }
          // };

          return (
            <div className="flex items-center justify-center gap-2">
              {/* <Tooltip>
              <TooltipTrigger asChild>
                <Checkbox
                  checked={allSelectableSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all eligible users for resend invite"
                  className={`h-5 w-5 rounded-sm border-2 transition-all duration-200 ${someSelectableSelected && !allSelectableSelected
                    ? 'border-primary-base bg-gray-100 data-[state=checked]:bg-primary-base data-[state=checked]:border-primary-base'
                    : 'border-primary-base hover:border-primary-base/80 data-[state=checked]:bg-primary-base data-[state=checked]:border-primary-base'
                    }`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select all eligible users for resend invite</p>
              </TooltipContent>
            </Tooltip> */}
              <span className="text-sm font-medium text-gray-700">Invite Actions</span>
            </div>
          );
        },
        cell: ({ row }) => {
          const email = row.getValue("email") as string;
          const status = row.getValue("status") as number;

          // For users with null status (never invited), show Send Invite button
          if (status === null) {
            return (
              <div className="flex items-center justify-center">
                <Button
                  onClick={() => handleSingleInvite(email)}
                  disabled={isSendingInvite === email}
                  className="cursor-pointer w-32"
                  variant="outline"
                >
                  <SvgIcon name="email-send" fill="#98A2B3" />
                  {isSendingInvite === email ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            );
          }

          // For users with status 3 (invited but not accepted), show checkbox for bulk resend
          if (status === 3) {
            return (
              <div className="flex items-center justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Checkbox
                      checked={selectedUsers.includes(email)}
                      onCheckedChange={(value: boolean) => handleUserSelection(email, !!value)}
                      aria-label={`Select ${email} for resend invite`}
                      className="h-6 w-6 rounded-sm border-2 transition-all duration-200 border-primary-base hover:border-primary-base/80 hover:bg-primary-base/5 data-[state=checked]:bg-primary-base data-[state=checked]:border-primary-base data-[state=checked]:shadow-md"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select {email} for resend invite</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          }

          // For all other statuses, show disabled state
          return (
            <div className="flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                {status === 1 ? 'Active' : status === 2 ? 'Disabled' : status === 4 ? 'Pending' : status === 5 ? 'Pending' : 'Unknown'}
              </p>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<Payment>,]
      : []),

    // Commented out existing resend invite column
    // {
    //   accessorKey: "resend_invite",
    //   header: "Resend Invite",
    //   cell: ({ row }) => {
    //     const email = row.getValue("email") as string;
    //     const status = row.getValue("status") as number;

    //     return (
    //       <Button
    //         disabled={
    //           status === 1 ||
    //           status === 2 ||
    //           status === 5 ||
    //           isResending === email
    //         }
    //         onClick={() => resendInvite(email)}
    //         className="cursor-pointer w-32"
    //         variant="outline"
    //       >
    //         <SvgIcon name="email-send" fill="#98A2B3" />
    //         {!status ? "Send Invite" : "Resend"}
    //       </Button>
    //     );
    //   },
    // },
    ...(userInfo?.role_id === 1 || userInfo?.role_id === 2
      ? [
        {
          accessorKey: "update_status",
          header: "Admin Access",
          cell: ({ row }: { row: Row<Payment> }) => {
            const email = row.getValue("email") as string;
            const role_id = row.original.role_id as number;
            const status = row.original.status as number;
            const isRestricting = role_id === 8;
            return (
              <Button
                onClick={() =>
                  handleUpdateUserStatus(email, isRestricting ? false : true)
                }
                className={`cursor-pointer w-32 ${isRestricting
                  ? "bg-red-500 text-white hover:bg-red-600 transition-all duration-300 border-red-500 hover:text-white"
                  : "bg-primary-base text-white hover:bg-primary-base/80 transition-all duration-300 border-primary-base hover:text-white"
                  }`}
                variant="outline"
                disabled={status !== 1}
              >
                {isUpdating === email
                  ? "Updating..."
                  : isRestricting
                    ? "Restrict"
                    : "Grant"}
              </Button>
            );
          },
        },
      ]
      : []),
    {
      id: "delete_user",
      header: "Remove",
      cell: ({ row }: { row: Row<Payment> }) => {
        const email = row.getValue("email") as string;
        const user = row.original as any;
        const status = user.status as number;
        const id = user.id as number;
        const disabled = status !== 3 || isDeleting === email;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleDeleteUser(id, email)}
                disabled={disabled}
                variant="outline"
                size="sm"
              >
                <SvgIcon name="trash" fill="#DC2626" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{status === 3 ? "Delete Flexologist" : "Only invited (status 3) can be removed"}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    if (!validateEmail(email)) {
      setFormError("Invalid email address");
      return;
    }
    try {
      setIsLoading(true);
      const response = await inviteFlexologist(email, proceed);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        refetch();
        setEmail("");
        setShowModal(false);
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response.status === 409) {
        renderWarningToast(apiError.response.data.message);
      } else if (apiError.response.status === 402) {
        if (apiError.response.data.payment_id) {
          setPaymentInfo(true);
          setBillingInfo(apiError.response.data.payment_info as BillingInfo);
        } else {
          setPaymentInfo(true);
        }
      } else {
        renderErrorToast(apiError.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-7">
      <h3 className="md:text-2xl text-lg font-semibold mb-8 md:mb-16">
        Note Taking Admin Dashboard
      </h3>
      {isFetching && !isPending && (
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
          handleModal={() => setShowModal(true)}
          handleBulkInvite={() => setShowBulkInviteModal(true)}
          handleResendInvite={handleResendInvite}
          selectedUsersCount={selectedUsers.length}
          columns={userColumns}
          data={data.data.users}
          note={true}
          emptyText="No Flexologists invited yet."
          enableSorting
        />
      </div>

      {/* Centralized modals */}
      <NoteTakingAdminModals
        // Invite Flexologist
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
        email={email}
        setEmail={setEmail}
        formError={formError}
        isLoading={isLoading}
        handleSubmit={handleSubmit}

        // Access Confirmation
        showAccessConfirmation={showAccessConfirmation}
        onCloseAccess={() => setShowAccessConfirmation(false)}
        pendingAction={pendingAction}
        isAccessing={isAccessing}
        confirmUpdateAccess={confirmUpdateAccess}

        // Status Confirmation
        showStatusConfirmation={showStatusConfirmation}
        onCloseStatus={() => setShowStatusConfirmation(false)}
        isUpdating={isUpdating}
        confirmUpdateUserStatus={confirmUpdateUserStatus}

        // Delete Confirmation
        showDeleteConfirmation={showDeleteConfirmation}
        onCloseDelete={() => setShowDeleteConfirmation(false)}
        isDeleting={isDeleting}
        confirmDeleteUser={confirmDeleteUser}
      />
      {paymentInfo && (
        <PaymentCollection
          show={paymentInfo}
          onClose={() => setPaymentInfo(false)}
          robot={false}
          billingInfo={billingInfo}
          update={update}
          setUpdate={setUpdate}
          setProceed={setProceed}
        />
      )}

      <BulkInviteModal
        show={showBulkInviteModal}
        onClose={() => setShowBulkInviteModal(false)}
        onSuccess={() => {
          refetch();
          setShowBulkInviteModal(false);
        }}
      />

      <BulkInviteModal
        show={showResendModal}
        onClose={() => {
          setShowResendModal(false);
          clearSelectedUsers();
        }}
        onSuccess={() => {
          // refetch();
          setShowResendModal(false);
          clearSelectedUsers();
        }}
        isResendMode={true}
        selectedEmails={selectedUsers}
      />

    </div>
  );
};
