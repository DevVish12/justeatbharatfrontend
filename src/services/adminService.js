import { ADMIN_TOKEN_KEY, apiRequest } from "./api";

const adminApiPrefix =
    import.meta.env.VITE_ADMIN_API_PREFIX || "admin-auth-9x7k2";

const adminPath = (path) => `/${adminApiPrefix}${path}`;

export const registerAdmin = async (payload) =>
    apiRequest(adminPath("/register"), {
        method: "POST",
        body: payload,
    });

export const loginAdmin = async (payload) => {
    const response = await apiRequest(adminPath("/login"), {
        method: "POST",
        body: payload,
    });

    if (response.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
    }

    return response;
};

export const requestAdminPasswordReset = async (payload) =>
    apiRequest(adminPath("/forgot-password"), {
        method: "POST",
        body: payload,
    });

export const resetAdminPassword = async (payload) =>
    apiRequest(adminPath("/reset-password"), {
        method: "POST",
        body: payload,
    });

export const getAdminProfile = async () =>
    apiRequest(adminPath("/me"), {
        method: "GET",
    });

export const logoutAdmin = async () => {
    try {
        await apiRequest(adminPath("/logout"), { method: "POST" });
    } finally {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
};

export const isAdminLoggedIn = () => Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));

// Manual Petpooja sync (admin-only JWT protected on backend).
export const syncPetpoojaMenu = async () =>
    apiRequest("/admin/sync-petpooja-menu", {
        method: "POST",
    });
