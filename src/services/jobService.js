import { apiRequest } from "./api";

export const submitJobApplication = async ({
    name,
    email,
    phone,
    position,
    resumeFile,
}) => {
    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("email", email || "");
    formData.append("phone", phone || "");
    formData.append("position", position || "");

    if (resumeFile) {
        formData.append("resume", resumeFile);
    }

    return apiRequest("/jobs/apply", {
        method: "POST",
        body: formData,
    });
};

export const fetchAdminJobApplications = async () =>
    apiRequest("/admin/job-applications", {
        method: "GET",
    });

export const deleteAdminJobApplication = async (id) =>
    apiRequest(`/admin/job-applications/${id}`, {
        method: "DELETE",
    });
