import { apiRequest } from "./api";

export const fetchStoreStatus = async () => apiRequest("/store/status", { method: "GET" });

export const updateStoreStatus = async ({ store_open }) =>
    apiRequest("/store/status", {
        method: "POST",
        body: { store_open },
    });
