import { format } from "date-fns";
import type { SupportTicket } from "@/types";

interface TicketCardProps {
    ticket: SupportTicket;
    onClick: (ticket: SupportTicket) => void;
}

export const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
    return (
        <div
            onClick={() => onClick(ticket)}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-base/10 flex items-center justify-center text-primary-base font-semibold text-xs shrink-0">
                        {ticket.users?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={ticket.users?.full_name}>
                            {ticket?.users?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate" title={ticket.users?.email}>
                            {ticket?.users?.email}
                        </p>
                    </div>
                </div>
                <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full shrink-0 ${ticket.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {ticket.status}
                </span>
            </div>

            <h4 className=" text-xs md:text-sm font-semibold text-gray-900 mb-1 truncate" title={ticket.subject}>
                {ticket.subject}
            </h4>
            <p
                className=" text-xs md:text-sm text-gray-500 mb-4 line-clamp-3 flex-1 break-words"
                title={ticket.message}
            >
                {ticket.message}
            </p>

            <div className="flex items-center text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                <span>
                    {format(
                        new Date(ticket.created_at),
                        "MMM d, yyyy h:mm a"
                    )}
                </span>
            </div>
        </div>
    );
};
