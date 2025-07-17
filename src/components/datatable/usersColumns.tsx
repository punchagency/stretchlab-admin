import type { ColumnDef } from "@tanstack/react-table";
import type { UserTableData, UserDetail } from "@/types/users";
import { Button } from "@/components/shared";

export const usersColumns: ColumnDef<UserTableData>[] = [
  {
    accessorKey: "businessName",
    header: "Business Name",
  },
  {
    accessorKey: "robotProcess",
    header: "Robot Process",
  },
  {
    accessorKey: "noteTaking",
    header: "Note Taking",
  },
  {
    accessorKey: "createdAt",
    header: "Created at / Joined",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          onClick={() => {}}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          View Detail
        </Button>
      );
    },
  },
];

export const userDetailColumns: ColumnDef<UserDetail>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]; 