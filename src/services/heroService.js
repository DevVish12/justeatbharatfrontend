import { apiRequest } from "./api";

export const fetchHeroBanners = async () => apiRequest("/hero", { method: "GET" });

export const uploadHeroBanner = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiRequest("/admin/hero/upload", {
        method: "POST",
        body: formData,
    });
};

export const toggleHeroBanner = async (id) =>
    apiRequest(`/admin/hero/toggle/${id}`, { method: "PATCH" });

export const deleteHeroBanner = async (id) =>
    apiRequest(`/admin/hero/${id}`, { method: "DELETE" });
