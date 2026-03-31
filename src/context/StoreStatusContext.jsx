import { fetchStoreStatus } from "@/services/storeService";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const StoreStatusContext = createContext(null);

export const StoreStatusProvider = ({ children }) => {
  const [storeOpen, setStoreOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchStoreStatus();
      setStoreOpen(Boolean(res?.store_open));
    } catch {
      // Fail-open to avoid blocking the UI due to transient network issues.
      setStoreOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ storeOpen, loading, refresh, setStoreOpen }),
    [storeOpen, loading, refresh],
  );

  return (
    <StoreStatusContext.Provider value={value}>
      {children}
    </StoreStatusContext.Provider>
  );
};

export const useStoreStatus = () => {
  const ctx = useContext(StoreStatusContext);
  if (!ctx) {
    throw new Error("useStoreStatus must be used within StoreStatusProvider");
  }
  return ctx;
};
