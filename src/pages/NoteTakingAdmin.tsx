import { useQuery } from "@tanstack/react-query";
import {
  fetchUsers,
  inviteFlexologist,
  updateUserAccess,
  updateUserStatus,
} from "@/service/notetaking";
import { useState } from "react";
import {
  Button as Button2,
  ContainLoader,
  Input,
  Modal,
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

export const NoteTakingAdmin = () => {
  const { data, isPending, error, isFetching, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState("");
  const [isAccessing, setIsAccessing] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [update, setUpdate] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [isUpdating, setIsUpdating] = useState("");
  // Confirmation modal states
  const [showAccessConfirmation, setShowAccessConfirmation] = useState(false);
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "access" | "status";
    email: string;
    value: number | boolean;
  } | null>(null);

  const userInfo = getUserInfo();


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

  const resendInvite = async (email: string) => {
    setIsResending(email);
    try {
      const response = await inviteFlexologist(email, true);
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
      } else {
        renderErrorToast(apiError.response.data.message);
      }
    } finally {
      setIsResending("");
    }
  };

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
  const userColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
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
                className={`${
                  badgeColor[status as keyof typeof badgeColor]
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
          <p className="text-gray-500">No Access control</p>
        );
      },
    },

    {
      accessorKey: "resend_invite",
      header: "Resend Invite",
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        const status = row.getValue("status") as number;
 
        return (
          <Button
            disabled={
              status === 1 ||
              status === 2 ||
              status === 5 ||
              isResending === email
            }
            onClick={() => resendInvite(email)}
            className="cursor-pointer w-32"
            variant="outline"
          >
            <SvgIcon name="email-send" fill="#98A2B3" />
            {!status ? "Send Invite" : "Resend"}
          </Button>
        );
      },
    },
    ...(userInfo?.role_id === 1 || userInfo?.role_id === 2
      ? [
          {
            accessorKey: "update_status",
            header: "Give Admin Access",
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
                  className={`cursor-pointer w-32 ${
                    isRestricting
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
                    : "Give Access"}
                </Button>
              );
            },
          },
        ]
      : []),
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
          columns={userColumns}
          data={data.data.users}
          note={true}
          emptyText="No Flexologists invited yet."
        />
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 py-4 px-2 md:px-10"
        >
          <h1 className="text-lg md:text-2xl font-semibold text-center mb-4">
            Invite Flexologist
          </h1>
          <Input
            label="Email Address"
            type="email"
            icon="mail"
            placeholder="flexologist@gmail.com"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {formError && (
            <div className="bg-red-100 rounded-lg px-2 py-3">
              <p className="text-red-500 font-medium text-sm text-center">
                {formError}
              </p>
            </div>
          )}
          <Button2
            disabled={isLoading}
            className="bg-primary-base mt-2 py-3 w-fit mx-auto flex items-center gap-2 text-white"
          >
            <SvgIcon name="email-send" fill="#fff" />
            {isLoading ? "Sending..." : "Send Invite"}
          </Button2>
        </form>
      </Modal>
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

      {/* Access Confirmation Modal */}

      <Modal
        show={showAccessConfirmation}
        onClose={() => setShowAccessConfirmation(false)}
        size="sm"
      >
        <div className="flex flex-col gap-4 py-4 px-2 md:px-6">
          <h1 className="text-lg md:text-xl font-semibold text-center mb-2">
            Confirm Access Change
          </h1>
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to {pendingAction?.value === 1 ? 'disable' : 'enable'} access for{" "}
            <span className="font-semibold">{pendingAction?.email}</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button2
              onClick={() => setShowAccessConfirmation(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </Button2>
            <Button2
              onClick={confirmUpdateAccess}
              disabled={isAccessing === pendingAction?.email}
              className="bg-primary-base hover:bg-primary-base/80 text-white px-6 py-2 rounded-lg"
            >
              {isAccessing === pendingAction?.email ? "Updating..." : "Confirm"}
            </Button2>
          </div>
        </div>
      </Modal>

      {/* Status Confirmation Modal */}
      <Modal show={showStatusConfirmation} onClose={() => setShowStatusConfirmation(false)} size="sm">
        <div className="flex flex-col gap-4 py-4 px-2 md:px-6">
          <h1 className="text-lg md:text-xl font-semibold text-center mb-2">
            Confirm Admin Access Change
          </h1>
          <p className="text-gray-600 text-center mb-4">
            Are you sure you want to {pendingAction?.value ? 'give' : 'restrict'} admin access for{" "}
            <span className="font-semibold">{pendingAction?.email}</span>?
          </p>
          <div className="flex gap-3 justify-center">
            <Button2
              onClick={() => setShowStatusConfirmation(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </Button2>
            <Button2
              onClick={confirmUpdateUserStatus}
              disabled={isUpdating === pendingAction?.email}
              className={`px-6 py-2 rounded-lg text-white ${
                pendingAction?.value 
                  ? "bg-primary-base hover:bg-primary-base/80" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isUpdating === pendingAction?.email ? "Updating..." : pendingAction?.value ? "Give Access" : "Restrict"}
            </Button2>
          </div>
        </div>
      </Modal>
    </div>
  );
};
