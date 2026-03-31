import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchUserMe, firebaseLogin, logoutUser, updateUserMe } from "@/services/userAuthService";

const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const response = await fetchUserMe();
      setUser(response?.user || null);
      return response?.user || null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      setIsAuthLoading(true);
      try {
        const response = await fetchUserMe();
        if (!ignore) {
          setUser(response?.user || null);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsAuthLoading(false);
        }
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, []);

  const completeFirebaseLogin = useCallback(async (idToken) => {
    const response = await firebaseLogin(idToken);
    setUser(response?.user || null);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async ({ name }) => {
    const response = await updateUserMe({ name });
    setUser(response?.user || null);
    return response?.user || null;
  }, []);

  const value = useMemo(
    () => ({ user, setUser, isAuthLoading, refreshMe, completeFirebaseLogin, updateProfile, logout }),
    [user, isAuthLoading, refreshMe, completeFirebaseLogin, updateProfile, logout],
  );

  return (
    <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }
  return ctx;
};
