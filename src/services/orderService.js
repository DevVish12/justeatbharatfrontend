import { apiRequest } from "./api";

export const createOrder = async (payload) =>
    apiRequest("/orders/create", {
        method: "POST",
        body: payload,
    });

export const verifyRazorpayPayment = async (payload) =>
    apiRequest("/orders/verify", {
        method: "POST",
        body: payload,
    });

export const listOrders = async ({ limit } = {}) => {
    const query = limit ? `?limit=${encodeURIComponent(String(limit))}` : "";
    return apiRequest(`/orders${query}`, { method: "GET" });
};

export const updateOrderStatus = async (payload) =>
    apiRequest("/orders/status", {
        method: "PUT",
        body: payload,
    });
