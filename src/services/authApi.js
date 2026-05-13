import { httpClient, normalizeApiError } from "./httpClient";

export const sendOtp = async (phone) => {
    try {
        const { data } = await httpClient.post("/auth/send-otp", { phone });
        return data;
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const verifyOtp = async ({ phone, code }) => {
    try {
        const { data } = await httpClient.post("/auth/verify-otp", { phone, code });
        return data;
    } catch (error) {
        throw normalizeApiError(error);
    }
};

export const resendOtp = async (phone) => {
    try {
        const { data } = await httpClient.post("/auth/resend-otp", { phone });
        return data;
    } catch (error) {
        throw normalizeApiError(error);
    }
};
