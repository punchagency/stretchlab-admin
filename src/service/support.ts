import { api } from "./api";

export const contactSupport = async (subject: string, message: string) => {
    const response = await api.post("/admin/support/contact", {
        subject,
        message,
    });
    return response;
};

export const getTickets = async () => {
    const response = await api.get("/admin/support/get_tickets");
    return response;
};

export const respondTicket = async (ticket_id: number | string, message: string) => {
    const response = await api.post("/admin/support/respond-ticket", {
        ticket_id,
        message,
    });
    return response;
};
