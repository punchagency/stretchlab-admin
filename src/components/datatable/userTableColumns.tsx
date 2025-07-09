import { type ColumnDef } from "@tanstack/react-table";
import type { UserData } from "@/types";

export const userTableColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return (
        <span className="text-gray-700 font-mono text-sm">#{id}</span>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.full_name.split(" ").map(n => n[0]).join("").toUpperCase();
      
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
            {user.profile_picture_url ? (
              <img 
                src={user.profile_picture_url} 
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {initials}
              </span>
            )}
          </div>
          <span className="font-medium text-gray-900">{user.full_name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as number;
      const statusConfig = {
        1: { label: "Active", color: "bg-green-100 text-green-800" },
        0: { label: "Inactive", color: "bg-red-100 text-red-800" },
      };
      const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: "Unknown", color: "bg-gray-100 text-gray-800" };
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "last_login",
    header: "Last Login",
    cell: ({ row }) => {
      const lastLogin = row.getValue("last_login") as string;
      const date = new Date(lastLogin);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return (
        <span className="text-gray-600">{formattedDate}</span>
      );
    },
  },
]; 