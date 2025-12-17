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
