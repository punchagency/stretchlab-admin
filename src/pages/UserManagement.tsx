import { useQuery } from "@tanstack/react-query";
import {
  fetchManagers,
  inviteManager,
  updateManagerAccess,
  grantOrRevokePermission,
} from "@/service/user";
import { useState } from "react";
import {
  Button as Button2,
  ContainLoader,
  Input,
  Modal,
  SvgIcon,
} from "@/components/shared";
import { DataTable, type Payment } from "@/components/datatable";
import type { ApiError } from "@/types";
import {
  renderErrorToast,
  renderSuccessToast,
  renderWarningToast,
} from "@/components/utils";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorHandle } from "@/components/app";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { LocationSelectionModal } from "@/components/LocationSelectionModal";

export const UserManagement = () => {
  const { data, isPending, error, isFetching, refetch } = useQuery({
    queryKey: ["managers"],
    queryFn: fetchManagers,
  });

  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState("");
  const [isAccessing, setIsAccessing] = useState<number | null>(null);

  // ✅ Manage multiple permission loading states at once
  const [isPermissionLoading, setIsPermissionLoading] = useState<Set<string>>(new Set());

  // 🆕 Location modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingPermission, setPendingPermission] = useState<{
    userId: number;
    permissionTag: string;
    addPermission: boolean;
  } | null>(null);

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
      const response = await inviteManager(email);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        refetch();
        setEmail("");
        setShowModal(false);
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
      renderErrorToast(apiError.response?.data?.message || "Error updating access");
      setIsAccessing(null);
    }
  };

  // ✅ Allow multiple permission updates in parallel
  const handlePermissionChange = async (
    user_id: number,
    permission_tag: string,
    add_permission: boolean
  ) => {
    // 🆕 If granting exclude_location permission, show location modal
    if (permission_tag === "exclude_location" && add_permission) {
      setPendingPermission({ userId: user_id, permissionTag: permission_tag, addPermission: add_permission });
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
      renderErrorToast(apiError.response?.data?.message || "Error updating permission");
    } finally {
      setIsPermissionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  // 🆕 Handle location selection confirmation
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
      renderErrorToast(apiError.response?.data?.message || "Error updating permission");
    } finally {
      setIsPermissionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const userColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
        </Button>
      ),
    },
    {
      accessorKey: "status",
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

        return (
          <div
            className={`${badgeColor[status as keyof typeof badgeColor]} px-2 py-1.5 rounded-2xl w-20 text-center font-medium`}
          >
            {statuses[status]}
          </div>
        );
      },
    },
    {
      accessorKey: "invited_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="-ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Invited
        </Button>
      ),
      cell: ({ row }) => {
        const dateInvited = row.getValue("invited_at") as string;
        return dateInvited ? (
          <div className="font-medium">
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
        const user_id = row.original.id;
        return access === 1 || access === 2 ? (
          <Switch
            className="data-[state=checked]:bg-primary-base"
            onCheckedChange={() => handleAccess(user_id, access === 1 ? false : true)}
            checked={access === 1}
            disabled={isAccessing === user_id}
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
            disabled={status === 1 || status === 2 || isResending === email}
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
    {
      id: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const user = row.original;
        const allPermissions = data?.data?.data.permissions || [];
        const status = user.status
        return (
          status === 1 ? <Popover>.
            <PopoverTrigger asChild>
              <Button variant="outline" className="">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </Button>
            </PopoverTrigger>

            {/* ✅ Adjusted positioning */}
            <PopoverContent
              side="left"
              align="start"
              sideOffset={5}
              className="w-70 space-y-2 translate-x-[-5px]"
            >
              <h4 className="font-semibold text-sm mb-2">Manage Permissions</h4>

              {allPermissions.length === 0 && (
                <p className="text-gray-500 text-sm text-center">
                  No permissions available
                </p>
              )}

              {allPermissions.map((perm: any) => {
                const hasPermission = user.permissions?.some(
                  (p: any) => p.permission_tag === perm.permission_tag
                );
                const key = `${user.id}-${perm.permission_tag}`;
                const isExcludeLocation = perm.permission_tag === "exclude_location";

                return (
                  <div
                    key={perm.permission_tag}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {perm.permission_name}
                      </span>
                      {/* 🆕 Show excluded locations count badge */}
                      {/* {isExcludeLocation && hasPermission && user.excluded_locations?.length > 0 && (
                        <span className="text-xs bg-primary-light text-primary-base px-2 py-0.5 rounded-full font-semibold">
                          {user.excluded_locations.length} excluded
                        </span>
                      )} */}
                    </div>

                    {/* 🆕 Show Edit/Revoke for exclude_location when granted */}
                    {isExcludeLocation && hasPermission ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPermissionLoading.has(key)}
                          onClick={() => {
                            setPendingPermission({
                              userId: user.id,
                              permissionTag: perm.permission_tag,
                              addPermission: true
                            });
                            setShowLocationModal(true);
                          }}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPermissionLoading.has(key)}
                          onClick={() =>
                            handlePermissionChange(
                              user.id,
                              perm.permission_tag,
                              false
                            )
                          }
                          className="text-xs"
                        >
                          {isPermissionLoading.has(key) ? "Updating..." : "Revoke"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant={hasPermission ? "destructive" : "outline"}
                        disabled={isPermissionLoading.has(key)}
                        onClick={() =>
                          handlePermissionChange(
                            user.id,
                            perm.permission_tag,
                            !hasPermission
                          )
                        }
                        className="text-xs"
                      >
                        {isPermissionLoading.has(key)
                          ? "Updating..."
                          : hasPermission
                            ? "Revoke"
                            : "Grant"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </PopoverContent>
          </Popover> : <p className="text-gray-500">Not Access</p>
        );
      },
    },
  ];

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    if (!validateEmail(email)) {
      setFormError("Invalid email address");
      return;
    }
    try {
      setIsLoading(true);
      const response = await inviteManager(email);
      if (response.status === 200) {
        renderSuccessToast(response.data.message);
        refetch();
        setEmail("");
        setShowModal(false);
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 409) {
        renderWarningToast(apiError.response.data.message);
      } else {
        renderErrorToast(apiError.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-7">
      <div className="flex justify-between items-center mb-8 md:mb-10">
        <h3 className="md:text-2xl text-lg font-semibold ">
          User Management
        </h3>
        <Button2
          onClick={() => setShowModal(true)}
          className="flex items-center w-fit md:w-auto ml-auto md:ml-0 gap-2 py-3 text-white bg-primary-base"
        >
          <SvgIcon name="email-send" fill="#fff" />
          Invite Manager
        </Button2>
      </div>

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
          data={data?.data?.data.managers}
          emptyText="No manager invited yet."
          enableSearch
          searchFields={["full_name", "email"]}
          searchPlaceholder="Search by name or email"
          enableSorting
        />
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 py-4 px-2 md:px-10"
        >
          <h1 className="text-lg md:text-2xl font-semibold text-center mb-4">
            Invite User
          </h1>
          <Input
            label="Email Address"
            type="email"
            icon="mail"
            placeholder="user@gmail.com"
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

      {/* 🆕 Location Selection Modal */}
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
            ? data?.data?.data.managers.find((m: any) => m.id === pendingPermission.userId)?.excluded_locations || []
            : []
        }
      />
    </div>
  );
};
