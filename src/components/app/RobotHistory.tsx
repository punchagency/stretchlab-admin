import { getRobotHistory } from "@/service/robot";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../datatable";
import type { ColumnDef } from "@tanstack/react-table";
import type { RobotHistoryType, BookingType } from "@/types/shared";
import { Modal } from "../shared";
import { useState } from "react";
import { HistoryInformation } from ".";
import { Loader2 } from "lucide-react";
const userColumns: ColumnDef<RobotHistoryType>[] = [
  {
    accessorKey: "client_name",
    header: "Client Name",
  },
  {
    accessorKey: "first_timer",
    header: "First Timer",
  },
  {
    accessorKey: "flexologist_name",
    header: "Flexologist",
  },

  {
    accessorKey: "location",
    header: "Location",
  },

  {
    accessorKey: "status",
    // id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statuses: Record<string, string> = {
        completed: "Completed",
        "no show": "No Show",
        "log the booking status": "Not Logged",
        "send the booking status": "Not Sent",
      };
      const badgeColor = {
        completed: "bg-[#E7F6EC] text-[#036B26]",
        "no show": "bg-[#FBEAE9] text-[#9E0A05]",
        "log the booking status": "bg-[#FEF6E7] text-[#865503]",
        "send the booking status": "bg-[#FEF6E7] text-[#865503]",
      } as const;

      const matchedStatus = Object.keys(statuses).find((key) =>
        status.toLowerCase().includes(key)
      );

      return matchedStatus ? (
        <div
          className={`${
            badgeColor[matchedStatus as keyof typeof badgeColor]
          } px-2 py-1.5 rounded-2xl w-24 text-center font-medium`}
        >
          {statuses[matchedStatus]}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No status</p>
      );
    },
  },
  {
    accessorKey: "appointment_date",
    header: "Appointment Date",
  },
];

const unloggedColumns: ColumnDef<RobotHistoryType>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "booking_id",
    header: "Booking ID",
  },
  {
    accessorKey: "booking_with",
    header: "Flexologist",
  },
  {
    accessorKey: "booking_location",
    header: "Location",
  },
  {
    accessorKey: "booking_detail",
    header: "Booking Detail",
  },
  {
    accessorKey: "session_mins",
    header: "Session Minutes",
  },
  {
    accessorKey: "appointment_date",
    header: "Appointment Date",
  },
  {
    accessorKey: "booking_date",
    header: "Booking Date",
  },
];

export const RobotHistory = ({ configId }: { configId: number }) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<
    "noteAutomation" | "unloggedBookings"
  >("noteAutomation");

  const { data, isPending } = useQuery({
    queryKey: ["robot-history", configId],
    queryFn: () => getRobotHistory(configId as number),
  });

  const mutation = useMutation({
    mutationFn: () => getRobotHistory(configId as number, true),
    onSuccess: (data) => {
      queryClient.setQueryData(["robot-history", configId], data);
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-base" />
        <p className="text-gray-500 text-base font-semibold">
          Fetching Todays Automation History
        </p>
      </div>
    );
  }

  const handleClick = (id: number) => {
    setBookingId(id);
    setShowModal(true);
  };

  return (
    <>
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold mb-4">
            Today's Automation History{" "}
            <span className="text-gray-500 text-sm">
              (
              {viewMode === "noteAutomation"
                ? data?.data.rpa_history.length
                : data?.data.rpa_unlogged_history.length}{" "}
              {viewMode === "noteAutomation"
                ? "processed bookings"
                : "unlogged bookings"}
              )
            </span>
          </h4>
          <button
            onClick={() => mutation.mutate()}
            className="text-primary-base font-semibold cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setViewMode("noteAutomation")}
            className={`${
              viewMode === "noteAutomation" ? "bg-primary-base" : "bg-gray-300"
            } text-white font-semibold py-2 px-4 rounded-md`}
          >
            Note Automation
          </button>
          <button
            onClick={() => setViewMode("unloggedBookings")}
            className={`${
              viewMode === "unloggedBookings"
                ? "bg-primary-base"
                : "bg-gray-300"
            } text-white font-semibold py-2 px-4 rounded-md`}
          >
            Unlogged Bookings
          </button>
        </div>
        <div>
          {viewMode === "noteAutomation" ? (
            <DataTable
              columns={userColumns}
              handleClick={handleClick}
              data={data?.data.rpa_history}
              emptyText="No bookings processed today"
            />
          ) : (
            <DataTable
              columns={unloggedColumns}
              handleClick={handleClick}
              data={data?.data.rpa_unlogged_history}
              emptyText="No unlogged bookings today"
            />
          )}
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} size="2xl">
        <HistoryInformation
          data={data?.data.rpa_history.find(
            (item: BookingType) => item.id === bookingId
          )}
        />
      </Modal>
    </>
  );
};

export default RobotHistory;
