import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useGlobalLoader } from "@/context/GlobalLoaderContext";
import { fetchStoreStatus, updateStoreStatus } from "@/services/storeService";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn, logoutAdmin } from "../services/adminService";
import AdminSidebar from "./AdminSidebar";
import { getAdminUrl } from "./adminPaths";

const StoreSettings = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useGlobalLoader();

  // Instant redirect if not logged in
  if (!isAdminLoggedIn()) {
    navigate(getAdminUrl("login"), { replace: true });
    return null;
  }

  const [storeOpen, setStoreOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const badge = useMemo(() => {
    return storeOpen
      ? { label: "OPEN", className: "bg-emerald-600 text-white" }
      : { label: "CLOSED", className: "bg-red-600 text-white" };
  }, [storeOpen]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      showLoader("Loading store settings…");
      try {
        const res = await fetchStoreStatus();
        if (!ignore) setStoreOpen(Boolean(res?.store_open));
      } catch (error) {
        if (!ignore) {
          toast("Failed to load store status", {
            description: error?.message || "Request failed",
          });
        }
      } finally {
        if (!ignore) setLoading(false);
        hideLoader();
      }
    };

    load();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleToggle = async () => {
    const next = !storeOpen;
    setSaving(true);
    showLoader("Updating store status…");
    try {
      const res = await updateStoreStatus({ store_open: next });
      setStoreOpen(Boolean(res?.store_open));
      toast("Store status updated", {
        description: Boolean(res?.store_open)
          ? "Store is now OPEN"
          : "Store is now CLOSED",
      });
    } catch (error) {
      const message = String(error?.message || "").toLowerCase();
      const isAuthError =
        message.includes("token expired") ||
        message.includes("invalid token") ||
        message.includes("unauthorized");

      if (isAuthError) {
        await logoutAdmin();
        navigate(getAdminUrl("login"), { replace: true });
        return;
      }

      toast("Failed to update store", {
        description: error?.message || "Request failed",
      });
    } finally {
      hideLoader();
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex w-full">
        <AdminSidebar activeItem="storeSettings" onLogout={logoutAdmin} />

        <main className="flex-1 min-w-0 p-4 md:p-8 md:ml-72">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Store Settings
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Control whether customers can place orders.
                </p>
              </div>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Store Status</p>
                <p className="text-sm text-muted-foreground">
                  When CLOSED, Add to Cart / Checkout / Place Order are
                  disabled.
                </p>
              </div>

              <div className="mt-5">
                <Button
                  type="button"
                  onClick={handleToggle}
                  disabled={loading || saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? "Saving…" : storeOpen ? "Set CLOSED" : "Set OPEN"}
                </Button>
              </div>
            </div>

            {loading ? (
              <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StoreSettings;
