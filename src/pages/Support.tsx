import { useState, useEffect } from "react";
import { renderSuccessToast, renderErrorToast } from "@/components/utils";
import { contactSupport, getTickets, respondTicket } from "@/service/support";
import { getUserInfo } from "@/utils";
import type { SupportTicket } from "@/types";
import { AdminTicketList, ContactSupportForm, TicketModal } from "@/components/support";

export const Support = () => {
    const userInfo = getUserInfo();
    const isAdmin = userInfo?.role_id === 1;

    // Contact Form State
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    // Admin State
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isTicketsLoading, setIsTicketsLoading] = useState(false);
    const [respondMessage, setRespondMessage] = useState("");
    const [isResponding, setIsResponding] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            fetchTickets();
        }
    }, [isAdmin]);

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

    const handleContactChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
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

    const handleRespond = async () => {
        if (!selectedTicket || !respondMessage.trim()) {
            renderErrorToast("Please enter a response message");
            return;
        }

        setIsResponding(true);
        try {
            const response = await respondTicket(selectedTicket.id, respondMessage);
            if (response.status === 200 || response.status === 201) {
                renderSuccessToast("Response sent successfully");
                setRespondMessage("");
                setSelectedTicket(null);
                fetchTickets();
            } else {
                renderErrorToast("Failed to send response");
            }
        } catch (error) {
            console.error(error);
            renderErrorToast("An error occurred while sending the response");
        } finally {
            setIsResponding(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="px-3 sm:px-5 mt-5 flex flex-col space-y-10">
                {isAdmin ? (
                    <AdminTicketList
                        tickets={tickets}
                        isLoading={isTicketsLoading}
                        onTicketClick={setSelectedTicket}
                    />
                ) : (
                    <ContactSupportForm
                        formData={formData}
                        isLoading={isLoading}
                        handleChange={handleContactChange}
                        handleSubmit={handleContactSubmit}
                    />
                )}
            </div>

            <TicketModal
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                respondMessage={respondMessage}
                setRespondMessage={setRespondMessage}
                handleRespond={handleRespond}
                isResponding={isResponding}
                role_id={userInfo?.role_id}
            />
        </div>
    );
};
