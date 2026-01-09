import { format } from "date-fns";
import { Modal } from "@/components/shared/Modal";
import { Button, Spinner, SvgIcon } from "@/components/shared";
import type { SupportTicket } from "@/types";

interface TicketModalProps {
    ticket: SupportTicket | null;
    onClose: () => void;
    respondMessage: string;
    setRespondMessage: (message: string) => void;
    handleRespond: () => void;
    isResponding: boolean;
    role_id?: number | null;
}

export const TicketModal = ({
    ticket,
    onClose,
    respondMessage,
    setRespondMessage,
    handleRespond,
    isResponding,
    role_id
}: TicketModalProps) => {
    if (!ticket) return null;

    return (
        <Modal
            show={!!ticket}
            onClose={onClose}
            size="lg"
        >
            <div className="flex flex-col space-y-6">
                <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary-base/10 flex items-center justify-center text-primary-base font-semibold text-lg">
                                {ticket?.users?.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-sm md:text-lg font-semibold text-gray-900">
                                    {ticket.subject}
                                </h3>
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                                    <span>{ticket?.users?.full_name}</span>
                                    <span>•</span>
                                    <span>{ticket?.users.email}</span>
                                </div>
                            </div>
                        </div>
                        <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${ticket.status === "open"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                                }`}
                        >
                            {ticket.status}
                        </span>
                    </div>
                    <div className=" text-xs md:text-sm text-gray-500">
                        Submitted on {format(new Date(ticket.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className=" text-xs md:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {ticket.message}
                    </p>
                </div>

                {role_id === 1 && (
                    <div className="border-t pt-6 space-y-4">
                        <h4 className="text-sm md:text-base font-semibold text-gray-900">Respond to Ticket</h4>
                        <div className="flex gap-3 border border-border rounded-2xl p-4 transition-colors focus-within:ring-1 focus-within:ring-primary-base bg-white">
                            <div className="mt-1">
                                <SvgIcon
                                    name="email-send"
                                    width={18}
                                    height={18}
                                    fill="#667185"
                                />
                            </div>
                            <textarea
                                value={respondMessage}
                                onChange={(e) => setRespondMessage(e.target.value)}
                                rows={5}
                                placeholder="Write your response here..."
                                className="w-full outline-none bg-transparent resize-none text-sm md:text-base text-foreground placeholder:text-sm placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={handleRespond}
                                disabled={isResponding || !respondMessage.trim()}
                                className="bg-primary-base text-white hover:bg-primary-base/90 px-8 py-2.5 rounded-lg flex items-center gap-2"
                            >
                                {isResponding ? (
                                    <>
                                        <Spinner />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <SvgIcon
                                            name="send"
                                            width={16}
                                            height={16}
                                            fill="white"
                                        />
                                        <span className=" text-sm">Send Response</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
