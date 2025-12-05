import { type ColumnDef } from "@tanstack/react-table";
import type { UserData } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const userTableColumns: ColumnDef<UserData>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   cell: ({ row }) => {
  //     const id = row.getValue("id") as number; 
  //     return (
  //       <span className="text-gray-700 font-mono text-sm">#{id}</span>
  //     ); 
  //   },
  // },
  { 
    accessorKey: "full_name",
    header: "Name",   
    cell: ({ row }) => { 
      const user = row.original;  
      const decodedName = user?.full_name ? decodeURIComponent(user.full_name) : "";
      const initials = decodedName?.split(" ").map(n => n[0]).join("").toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
            {user?.profile_picture_url ? (
              <img
                src={user?.profile_picture_url}
                alt={decodedName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {initials}
              </span>
            )} 
          </div>
          <span className="font-medium text-gray-900">{decodedName}</span>
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
      const lastLogin = row.getValue("last_login") as string | null;
      if (!lastLogin) return <span className="text-gray-400 italic">No login</span>;

      const date = new Date(lastLogin);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });  
            
      return <span className="text-gray-600">{formattedDate}</span>;
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string | null;
      const b = rowB.getValue(columnId) as string | null;
      if (!a && !b) return 0;
      if (!a) return -1;
      if (!b) return 1;   
      return new Date(a).getTime() - new Date(b).getTime();
    },
  },  
  {
    accessorKey: "bookings",
    header: "Bookings",

    cell: ({ row }) => {
      const bookings = row.getValue("bookings") as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-gray-600">{bookings}</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs text-white">
              Number of bookings for this flexologist.
            </p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "submitted_bookings",
    header: "Submitted Bookings",
    cell: ({ row }) => {
      const submittedBookings = row.getValue("submitted_bookings") as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-gray-600">{submittedBookings}</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs text-white">Number of submitted bookings for this flexologist.</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "percentage_submitted_bookings",
    header: "Percentage Submitted",
    cell: ({ row }) => {
      const percentageSubmittedBookings = row.getValue("percentage_submitted_bookings") as string;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-gray-600 text-center">{Math.round(Number(percentageSubmittedBookings))}%</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs  text-white">Percentage of submitted bookings for this flexologist.</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
]; 