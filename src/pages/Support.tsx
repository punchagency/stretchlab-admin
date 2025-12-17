import { useState, useEffect } from "react";
import { Button, Input, Spinner, SvgIcon, TableSkeleton } from "@/components/shared";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";
import { contactSupport, getTickets } from "@/service/support";
import { getUserInfo } from "@/utils";
import type { SupportTicket } from "@/types";
import { format } from "date-fns";
import { Modal } from "@/components/shared/Modal";

export const Support = () => {
    const userInfo = getUserInfo();
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isTicketsLoading, setIsTicketsLoading] = useState(false);


    useEffect(() => {
        if (userInfo?.role_id === 1) {
            fetchTickets();
        }
    }, [userInfo?.role_id]);

    const fetchTickets = async () => {
        setIsTicketsLoading(true);
        try {
            const response = await getTickets();
            if (response.status === 200) {
                setTickets(response.data.data);
            }
        } catch (error) {
            console.error(error);
            renderErrorToast("Failed to fetch tickets");
        } finally {
            setIsTicketsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) {
            renderErrorToast("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const response = await contactSupport(formData.subject, formData.message);
            if (response.status === 200 || response.status === 201) {
                renderSuccessToast("Support request sent successfully");
                setFormData({ subject: "", message: "" });
            } else {
                renderErrorToast("Failed to send support request");
            }
        } catch (error) {
            console.error(error);
            renderErrorToast("An error occurred while sending the request");
        } finally {
            setIsLoading(false);
        }
    };

    if (userInfo?.role_id === 1) {
        return (
            <div className="min-h-screen bg-white">
                <div className="px-3 sm:px-5 mt-5 flex flex-col space-y-10">
                    <div className="bg-[#F5F5F5] rounded-lg shadow-md py-4 px-3 sm:px-4">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            Support Tickets
                        </h2>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {isTicketsLoading ? (
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
                                        <div
                                            key={ticket.id}
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-base/10 flex items-center justify-center text-primary-base font-semibold text-xs shrink-0">
                                                        {ticket.users.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate" title={ticket.users.full_name}>
                                                            {ticket.users.full_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate" title={ticket.users.email}>
                                                            {ticket.users.email}
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

                                            <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate" title={ticket.subject}>
                                                {ticket.subject}
                                            </h4>
                                            <p
                                                className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1 break-words"
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Modal
                    show={!!selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    size="md"
                >
                    {selectedTicket && (
                        <div className="flex flex-col space-y-6">
                            <div className="border-b pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary-base/10 flex items-center justify-center text-primary-base font-semibold text-lg">
                                            {selectedTicket.users.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {selectedTicket.subject}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{selectedTicket.users.full_name}</span>
                                                <span>•</span>
                                                <span>{selectedTicket.users.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${selectedTicket.status === "open"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Submitted on {format(new Date(selectedTicket.created_at), "MMMM d, yyyy 'at' h:mm a")}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedTicket.message}
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="px-3 sm:px-5 mt-5 flex flex-col space-y-10">
                <div className="bg-[#F5F5F5] rounded-lg shadow-md py-4 px-3 sm:px-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                        Contact Support
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 max-w-2xl mx-auto">
                        <div className="flex flex-col items-center mb-6">
                            <div className="bg-primary-base/10 p-4 rounded-full mb-4">
                                <SvgIcon
                                    name="support"
                                    width={48}
                                    height={48}
                                    className="text-primary-base"
                                    fill="currentColor"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                How can we help?
                            </h3>
                            <p className="text-gray-500 text-center mt-2">
                                Send us a message and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Subject"
                                type="text"
                                name="subject"
                                placeholder="Brief summary of the issue"
                                value={formData.subject}
                                onChange={handleChange}
                                icon="edit"
                                className="bg-white"
                            />

                            <div className="space-y-1">
                                <label className="flex items-center justify-between text-gray-700 font-medium">
                                    Message
                                </label>
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
                                        name="message"
                                        rows={6}
                                        placeholder="Describe your issue in detail..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full outline-none bg-transparent resize-none text-base text-foreground placeholder:text-sm placeholder:text-muted-foreground"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    disabled={isLoading}
                                    className="bg-primary-base text-white hover:bg-primary-base/90 px-8 py-3 rounded-xl flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <SvgIcon
                                                name="send"
                                                width={18}
                                                height={18}
                                                fill="white"
                                            />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
