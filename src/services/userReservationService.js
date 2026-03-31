import { httpClient, normalizeApiError } from "./httpClient";

export const fetchMyReservations = async ({ limit } = {}) => {
    try {
        const params = {};
        if (limit !== undefined) params.limit = limit;

        const { data } = await httpClient.get("/reservations/my", { params });
        return data;
    } catch (error) {
        throw normalizeApiError(error);
    }
};
