import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const normalizeApiError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";

  return new Error(message);
};
