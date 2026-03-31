import { httpClient, normalizeApiError } from "./httpClient";

export const fetchMyOrders = async ({ limit } = {}) => {
    try {
        const params = {};
        if (limit !== undefined) params.limit = limit;

        const { data } = await httpClient.get("/orders/my", { params });
        return data;
    } catch (error) {
        throw normalizeApiError(error);
    }
};
