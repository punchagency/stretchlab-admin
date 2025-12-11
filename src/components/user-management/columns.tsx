import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { type ColumnDef } from "@tanstack/react-table";
import { SvgIcon } from "@/components/shared";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";

export interface Manager {
    id: number;
    full_name: string;
    email: string;
    status: number;
    invited_at: string;
    permissions: any[];
    excluded_locations?: string[];
}

interface UserColumnsProps {
    isAccessing: number | null;
    handleAccess: (user_id: number, enable: boolean) => void;
    isResending: string;
    resendInvite: (email: string) => void;
    allPermissions: any[];
    isPermissionLoading: Set<string>;
    handlePermissionChange: (
        user_id: number,
        permission_tag: string,
        add_permission: boolean
    ) => void;
    setPendingPermission: (value: any) => void;
    setShowLocationModal: (value: boolean) => void;
}

export const getUserColumns = ({
    isAccessing,
    handleAccess,
    isResending,
    resendInvite,
    allPermissions,
    isPermissionLoading,
    handlePermissionChange,
    setPendingPermission,
    setShowLocationModal,
}: UserColumnsProps): ColumnDef<Manager>[] => [
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

                // Safe access to badgeColor
                const colorClass = badgeColor[status as keyof typeof badgeColor] || "bg-gray-100 text-gray-800";

                return (
                    <div
                        className={`${colorClass} px-2 py-1.5 rounded-2xl w-20 text-center font-medium`}
                    >
                        {statuses[status] || "Unknown"}
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
            id: "access_control",
            header: "Access",
            cell: ({ row }) => {
                const access = row.getValue("status") as number;
                const user_id = row.original.id;
                // access 1 = Active, 2 = Disabled (I assume from context)
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

                const userEmail = row.original.email;
                const status = row.original.status;

                return (
                    <Button
                        disabled={status === 1 || status === 2 || isResending === userEmail}
                        onClick={() => resendInvite(userEmail)}
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

                // We use the status from original data
                const status = user.status;

                return (
                    status === 1 ? <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="">
                                <MoreHorizontal className="h-5 w-5 text-gray-600" />
                            </Button>
                        </PopoverTrigger>

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
                                        </div>

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
