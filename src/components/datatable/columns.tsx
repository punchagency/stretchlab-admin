import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { Switch } from "../ui/switch";
import { SvgIcon } from "../shared";
export type Payment = {
  id: number;
  full_name: string;
  email: string;
  status: number;
  invited_at: string;
  resend_invite: boolean;
  role_id: number;
  permissions?: any
  locations?: {
    list: Array<{
      active: boolean;
      name: string;
      primary: boolean;
    }>;
    total: number;
  };
};

const resendInvite = (email: string) => {
  console.log(email);
};

const handleAccess = (access: number, email: string) => {
  console.log(access, email);
};

export const userColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
        4: "Declined",
        5: "Expired",
      };

      return status ? (
        <div className="bg-[#FEF6E7] text-[#865503] px-2 py-1.5 rounded-2xl w-20 text-center font-medium">
          {statuses[status]}
        </div>
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          onCheckedChange={() => handleAccess(access, email)}
          checked={access === 1}
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
          disabled={status === 1 || status === 2}
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
];
