const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const ADMIN_TOKEN_KEY = "admin_access_token";

const buildHeaders = (options = {}) => {
    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(options.headers || {}),
    };

    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

export const apiRequest = async (path, options = {}) => {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method || "GET",
        headers: buildHeaders(options),
        body: options.body
            ? isFormData
                ? options.body
                : JSON.stringify(options.body)
            : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || "Request failed");
    }

    return payload;
};
