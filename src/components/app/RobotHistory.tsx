import { getRobotHistory } from "@/service/robot";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../datatable";
import type { ColumnDef } from "@tanstack/react-table";
import type { RobotHistoryType, BookingType } from "@/types/shared";
import { Modal } from "../shared";
import { useState } from "react";
import { HistoryInformation } from ".";
import { Loader2 } from "lucide-react";
import { DateRangeFilter } from "../shared/DateRangeFilter";
import type { DurationOption } from "@/types/dashboard";
import { AnimatePresence, motion } from "framer-motion";


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
          className={`${badgeColor[matchedStatus as keyof typeof badgeColor]
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
  const [selectedRange, setSelectedRange] = useState("yesterday");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<
    "noteAutomation" | "unloggedBookings"
  >("noteAutomation");

  const dateRangeOptions: DurationOption[] = [
    { value: "yesterday", label: "Yesterday" },
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    // { value: "this_year", label: "This Year" },
    { value: "custom", label: "Custom" },
  ];



  const { data, isPending } = useQuery({
    queryKey: ["robot-history", configId, selectedRange],
    queryFn: () => getRobotHistory(configId as number, selectedRange),
    // refetchOnWindowFocus: false,
    // enabled: !!configId,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (selectedRange === "custom") {
        return getRobotHistory(configId as number, selectedRange, customStartDate, customEndDate);
      }
      return getRobotHistory(configId as number, selectedRange);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["robot-history", configId, selectedRange], data);
    },
  });

  const mutating = mutation.isPending;

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    if (value !== "custom") {
      mutation.mutate();
    }
  };

  const handleCustomRangeChange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    mutation.mutate();
  };

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
        <div className="flex items-center justify-between relative">
          <h4 className="text-sm md:text-lg font-semibold mb-4">
            Automation History{" "}
            <span className="text-gray-500 text-xs md:text-sm">
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
          <div className="flex items-center gap-2">

            <DateRangeFilter
              label="Date Range"
              value={dateRangeOptions.find(opt => opt.value === selectedRange)?.label || "Yesterday"}
              options={dateRangeOptions}
              onChange={handleRangeChange}
              onCustomRangeChange={handleCustomRangeChange}
              className="w-50"
              showLabel={false}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setViewMode("noteAutomation")}
            className={`${viewMode === "noteAutomation" ? "bg-primary-base" : "bg-gray-300"
              } text-white font-semibold py-2 px-4 rounded-md text-xs md:text-base`}
          >
            Note Automation
          </button>
          <button
            onClick={() => setViewMode("unloggedBookings")}
            className={`${viewMode === "unloggedBookings"
                ? "bg-primary-base"
                : "bg-gray-300"
              } text-white font-semibold py-2 px-4 text-xs md:text-base rounded-md`}
          >
            Unlogged Bookings
          </button>
        </div>
        <div className="relative">
          {mutating && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center z-30 w-full absolute top-2 py-4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 font-semibold backdrop-blur-sm"
              >
                Fetching data...
              </motion.div>
            </AnimatePresence>
          )}
          {viewMode === "noteAutomation" ? (
            <DataTable
              columns={userColumns}
              handleClick={handleClick}
              data={data?.data.rpa_history}
              emptyText="No bookings processed today"
              searchFields={["client_name", "flexologist_name", "location", "booking_id"]}
              searchPlaceholder="Search by client name, flexologist name, location, booking id"
              enableSearch={true}

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
          close={() => setShowModal(false)}
          data={data?.data.rpa_history.find(
            (item: BookingType) => item.id === bookingId
          )}
        />
      </Modal>
    </>
  );
};

export default RobotHistory;