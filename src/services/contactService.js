import { apiRequest } from "./api";

export const submitContactMessage = async (payload) =>
  apiRequest("/contact", {
    method: "POST",
    body: payload,
  });

export const fetchAdminContacts = async () =>
  apiRequest("/admin/contacts", {
    method: "GET",
  });

export const deleteAdminContact = async (id) =>
  apiRequest(`/admin/contacts/${id}`, {
    method: "DELETE",
  });
