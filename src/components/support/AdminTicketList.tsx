import { SvgIcon, TableSkeleton } from "@/components/shared";
import { TicketCard } from "./TicketCard";
import type { SupportTicket } from "@/types";

interface AdminTicketListProps {
    tickets: SupportTicket[];
    isLoading: boolean;
    onTicketClick: (ticket: SupportTicket) => void;
}

export const AdminTicketList = ({
    tickets,
    isLoading,
    onTicketClick
}: AdminTicketListProps) => {
    return (
        <div className="bg-[#F5F5F5] rounded-lg shadow-md py-4 px-3 sm:px-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
                Support Tickets
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-4">
                        <TableSkeleton />
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-primary-base/10 p-4 rounded-full w-fit mx-auto mb-4">
                            <SvgIcon
                                name="support"
                                width={32}
                                height={32}
                                className="text-primary-base"
                                fill="currentColor"
                            />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                            No tickets found
                        </h3>
                        <p className="text-gray-500 mt-1">
                            There are no support tickets at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 text-left">
                        {tickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onClick={onTicketClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
