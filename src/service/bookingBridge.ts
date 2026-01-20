import { api } from "./api";

export const getBookingBridgeConfig = async () => {
    const response = await api.get("/admin/booking-bridge/get-bridge-config");
    return response;
};

export const createBookingBridgeConfig = async (data: {
    clubready_username: string;
    clubready_password?: string;
    locations: string[];
    selected_locations: string[];
    active: boolean;
}) => {
    const response = await api.post("/admin/booking-bridge/create-bridge-config", data);
    return response;
};

export const updateBookingBridgeConfig = async (data: {
    id: number;
    clubready_username: string;
    clubready_password?: string;
    locations: string[];
    selected_locations: string[];
    active: boolean;
}) => {
    const response = await api.post("/admin/booking-bridge/update-bridge-config", data);
    return response;
};
