import { httpClient, normalizeApiError } from "./httpClient";

export const firebaseLogin = async (idToken) => {
  try {
    const { data } = await httpClient.post("/auth/firebase-login", { idToken });
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const fetchUserMe = async () => {
  try {
    const { data } = await httpClient.get("/auth/me");
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await httpClient.post("/auth/logout");
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const updateUserMe = async ({ name }) => {
  try {
    const { data } = await httpClient.put("/auth/me", { name });
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
