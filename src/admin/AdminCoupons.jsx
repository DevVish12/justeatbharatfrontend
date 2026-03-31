import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { toast } from "../hooks/use-toast";
import { isAdminLoggedIn, logoutAdmin } from "../services/adminService";
import { apiRequest } from "../services/api";
import AdminSidebar from "./AdminSidebar";
import { getAdminUrl } from "./adminPaths";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
};

const AdminCoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  const isAuthError = (message) => {
    const m = String(message || "").toLowerCase();
    return (
      m.includes("token expired") ||
      m.includes("expired token") ||
      m.includes("invalid token") ||
      m.includes("unauthorized") ||
      m.includes("jwt")
    );
  };

  const handleAuthFailure = async (error) => {
    toast({
      variant: "destructive",
      title: "Session expired",
      description: "Please login again.",
    });
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate(getAdminUrl("login"), { replace: true });
      return;
    }

    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const couponRes = await apiRequest("/coupons", { method: "GET" });

        if (ignore) return;

        setCoupons(Array.isArray(couponRes?.coupons) ? couponRes.coupons : []);
      } catch (error) {
        if (!ignore) {
          if (isAuthError(error?.message)) {
            await handleAuthFailure(error);
            return;
          }
          toast({
            variant: "destructive",
            title: "Failed to load coupons",
            description: error.message,
          });
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const sorted = useMemo(() => {
    return [...coupons].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [coupons]);

  const pageSize = 6;
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = useMemo(() => {
    return sorted.slice(startIndex, endIndex);
  }, [sorted, startIndex, endIndex]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  const toggleStatus = async (coupon) => {
    setIsSubmitting(true);
    try {
      const nextStatus = coupon.status === "active" ? "inactive" : "active";
      const res = await apiRequest(`/coupons/${coupon.id}`, {
        method: "PUT",
        body: { status: nextStatus },
      });
      const updated = res?.coupon;
      if (updated) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
      }
      toast({ title: "Status updated" });
    } catch (error) {
      if (isAuthError(error?.message)) {
        await handleAuthFailure(error);
        return;
      }
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCoupon = async (id) => {
    setIsSubmitting(true);
    try {
      await apiRequest(`/coupons/${id}`, { method: "DELETE" });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Coupon deleted" });
    } catch (error) {
      if (isAuthError(error?.message)) {
        await handleAuthFailure(error);
        return;
      }
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar activeItem="coupons" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Coupons</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage promo codes (table view).
                </p>
              </div>

              <Button
                type="button"
                disabled={isLoading || isSubmitting}
                onClick={() => navigate(`${getAdminUrl("coupons")}/new`)}
              >
                Create Coupon
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left bg-muted/30">
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Code
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Type
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Value
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">
                        Min Order
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">
                        Dish
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">
                        Free Item
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Expiry
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">
                          {c.code}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {c.discountType}
                        </td>
                        <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                          {c.discountValue === null ||
                          c.discountValue === undefined
                            ? "—"
                            : c.discountType === "percent"
                              ? `${c.discountValue}%`
                              : `₹${c.discountValue}`}
                        </td>
                        <td className="px-4 py-3 tabular-nums whitespace-nowrap hidden lg:table-cell">
                          {c.minOrder ? `₹${c.minOrder}` : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                          {c.dishId || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                          {c.freeItemId || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {c.expiryDate ? formatDateTime(c.expiryDate) : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Button
                            type="button"
                            variant={
                              c.status === "active" ? "secondary" : "default"
                            }
                            size="sm"
                            disabled={isSubmitting || isLoading}
                            onClick={() => toggleStatus(c)}
                          >
                            {c.status}
                          </Button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() =>
                                navigate(
                                  `${getAdminUrl("coupons")}/edit/${String(c.id)}`,
                                )
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={isSubmitting || isLoading}
                              onClick={() => deleteCoupon(c.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && sorted.length === 0 ? (
                      <tr>
                        <td
                          className="px-4 py-10 text-center text-muted-foreground"
                          colSpan={9}
                        >
                          No coupons yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {isLoading ? (
                <p className="p-4 text-sm text-muted-foreground">Loading...</p>
              ) : null}

              {!isLoading && sorted.length > 0 ? (
                <div className="flex flex-col gap-3 p-4 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">
                      Showing {startIndex + 1}-{endIndex} of {totalItems} coupon
                      {totalItems === 1 ? "" : "s"}.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tip: Use “Create Coupon” to open the form page.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-muted-foreground mr-1">
                      Page {safePage} / {totalPages}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={
                        isLoading ||
                        isSubmitting ||
                        safePage <= 1 ||
                        totalItems === 0
                      }
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={
                        isLoading ||
                        isSubmitting ||
                        safePage >= totalPages ||
                        totalItems === 0
                      }
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
