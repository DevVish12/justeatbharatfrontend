import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "../hooks/use-toast";
import { isAdminLoggedIn, logoutAdmin } from "../services/adminService";
import { listOrders, updateOrderStatus } from "../services/orderService";
import AdminSidebar from "./AdminSidebar";
import { getAdminUrl } from "./adminPaths";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    // Readable, no seconds (example: "Mar 13, 2026, 8:58 PM")
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
};

const safeItemsCount = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.reduce((sum, it) => sum + (Number(it?.quantity) || 0), 0);
};

const itemsSummary = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items
    .map((it) => {
      const name = String(it?.name || "Item");
      const variant = String(it?.variant || "").trim();
      const qty = Number(it?.quantity) || 0;
      const label = variant ? `${name} (${variant})` : name;
      return `${label} x${qty}`;
    })
    .filter(Boolean)
    .join(", ");
};

const currency = (value) => `₹${Number(value || 0).toFixed(2)}`;

const statusVariant = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return "secondary";
  if (s === "PREPARING") return "default";
  return "outline";
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const pageSize = 9;
  const [page, setPage] = useState(1);

  const isAuthError = (error) => {
    const message = String(error?.message || "").toLowerCase();
    return (
      message.includes("token expired") ||
      message.includes("invalid token") ||
      message.includes("unauthorized")
    );
  };

  const handleAuthExpired = async () => {
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
        const response = await listOrders();
        if (!ignore) {
          setOrders(Array.isArray(response?.orders) ? response.orders : []);
        }
      } catch (error) {
        if (!ignore) {
          toast({
            variant: "destructive",
            title: "Failed to load orders",
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
    return [...orders].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [orders]);

  const totalPages = useMemo(() => {
    const total = sorted.length;
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [sorted.length, pageSize]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const pageOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sorted.slice(start, end);
  }, [sorted, page, pageSize]);

  const rangeLabel = useMemo(() => {
    const total = sorted.length;
    if (!total) return "Showing 0 of 0";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(total, page * pageSize);
    return `Showing ${start}-${end} of ${total}`;
  }, [sorted.length, page, pageSize]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  const handleStatusChange = async (order, status) => {
    const id = order?.id;
    if (!id) return;

    setIsSubmitting(true);
    try {
      const response = await updateOrderStatus({ id, order_status: status });
      const updated = response?.order;
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      }
      toast({ title: "Order updated" });
    } catch (error) {
      if (isAuthError(error)) {
        await handleAuthExpired();
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar activeItem="orders" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h1 className="text-2xl font-semibold">Orders</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                View orders and update order status.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Order List</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isLoading ? "Loading…" : rangeLabel}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>

                  <span className="text-xs text-muted-foreground">
                    Page {page} / {totalPages}
                  </span>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                      <th className="px-3 py-2 font-medium">Customer</th>
                      <th className="px-3 py-2 font-medium">Items</th>
                      <th className="px-3 py-2 font-medium">Total</th>
                      <th className="px-3 py-2 font-medium">Created</th>
                      <th className="px-3 py-2 font-medium">More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageOrders.map((o, index) => (
                      <tr key={o.id} className="border-b border-border/60">
                        <td className="px-3 py-2">
                          {(page - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-3 py-2">
                          <div className="space-y-0.5">
                            <p className="font-mono text-xs text-foreground">
                              {o.order_id || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {o.order_type || "—"}
                              {o.table_no ? ` · Table ${o.table_no}` : ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground">
                              {o.user_name || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {o.phone || "—"}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-2">{safeItemsCount(o)}</td>
                        <td className="px-3 py-2 font-medium">
                          {currency(o.total)}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={o.order_status || "PLACED"}
                              onChange={(e) =>
                                handleStatusChange(o, e.target.value)
                              }
                              disabled={isSubmitting || isLoading}
                              className="h-9 rounded-md border border-border bg-card px-2 text-sm"
                              aria-label={`Status for ${o.order_id || o.id}`}
                            >
                              <option value="PLACED">PLACED</option>
                              <option value="PREPARING">PREPARING</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </select>

                            <Badge
                              variant={statusVariant(o.order_status)}
                              className="hidden lg:inline-flex"
                            >
                              {String(o.order_status || "PLACED")}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {formatDateTime(o.created_at)}
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => setActiveOrder(o)}
                          >
                            View more
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {!isLoading && sorted.length === 0 ? (
                      <tr>
                        <td
                          className="px-3 py-6 text-center text-muted-foreground"
                          colSpan={8}
                        >
                          No orders yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {isLoading ? (
                <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(activeOrder)}
        onOpenChange={(open) => {
          if (!open) setActiveOrder(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
            <DialogDescription>
              {activeOrder?.order_id ? (
                <span className="font-mono text-xs">
                  {activeOrder.order_id}
                </span>
              ) : (
                ""
              )}
            </DialogDescription>
          </DialogHeader>

          {activeOrder ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="mt-1 text-sm font-semibold">
                    {activeOrder.user_name || "—"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeOrder.phone || "—"}
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Order</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant(activeOrder.order_status)}>
                      {String(activeOrder.order_status || "PLACED")}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {activeOrder.order_type || "—"}
                      {activeOrder.table_no
                        ? ` · Table ${activeOrder.table_no}`
                        : ""}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Created: {formatDateTime(activeOrder.created_at)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">Payment</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeOrder.payment_method || "—"} ·{" "}
                      {activeOrder.payment_status || "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Update status:</p>
                    <select
                      value={activeOrder.order_status || "PLACED"}
                      onChange={(e) =>
                        handleStatusChange(activeOrder, e.target.value)
                      }
                      disabled={isSubmitting || isLoading}
                      className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                      aria-label={`Update status for ${activeOrder.order_id || activeOrder.id}`}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="mt-1 text-sm font-semibold">
                    {currency(activeOrder.subtotal)}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Discount</p>
                  <p className="mt-1 text-sm font-semibold">
                    -{currency(activeOrder.discount)}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Tax</p>
                  <p className="mt-1 text-sm font-semibold">
                    {currency(activeOrder.tax)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Total</p>
                  <p className="text-lg font-semibold">
                    {currency(activeOrder.total)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold">Items</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Qty: {safeItemsCount(activeOrder)}
                </p>
                <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                  {itemsSummary(activeOrder) || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-semibold">Special instructions</p>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap break-words">
                  {String(activeOrder.special_instructions || "").trim() || "—"}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
