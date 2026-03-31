import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { fetchMyOrders } from "@/services/userOrderService";
import { useEffect, useMemo, useState } from "react";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
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

const badgeVariantForPayment = (status) => {
  const s = String(status || "")
    .trim()
    .toUpperCase();
  if (s === "PAID" || s === "SUCCESS") return "secondary";
  if (s === "FAILED" || s === "FAIL" || s === "CANCELLED") return "destructive";
  if (s === "PENDING" || s === "UNPAID") return "outline";
  return "outline";
};

const badgeVariantForOrder = (status) => {
  const s = String(status || "")
    .trim()
    .toUpperCase();
  if (s === "COMPLETED" || s === "DELIVERED") return "secondary";
  if (s === "CANCELLED" || s === "REJECTED") return "destructive";
  if (s === "PREPARING" || s === "CONFIRMED" || s === "ACCEPTED")
    return "default";
  return "outline";
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchMyOrders({ limit: 200 });
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
  }, []);

  const sorted = useMemo(() => {
    return [...orders].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [orders]);

  const pageSize = 10;
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

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading orders...</p>;
  }

  if (!sorted.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Your orders will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pageItems.map((o) => {
          const instructions = String(o.special_instructions || "").trim();
          const items = itemsSummary(o);
          const paymentStatus = String(o.payment_status || "").trim() || "—";
          const orderStatus = String(o.order_status || "").trim() || "—";
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-foreground">
                    {o.order_id || "—"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Date</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {formatDateTime(o.created_at)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={badgeVariantForOrder(orderStatus)}>
                    {orderStatus}
                  </Badge>
                  <Badge variant={badgeVariantForPayment(paymentStatus)}>
                    {paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="mt-1 text-sm text-foreground">{items || "—"}</p>
              </div>

              <div className="mt-3 rounded-xl border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">
                  Special instructions
                </p>
                <p className="mt-1 text-sm text-foreground whitespace-pre-wrap break-words">
                  {instructions || "—"}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="mt-1 font-medium tabular-nums">
                    {currency(o.subtotal)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Discount</p>
                  <p className="mt-1 font-medium tabular-nums">
                    -{currency(o.discount)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Tax</p>
                  <p className="mt-1 font-medium tabular-nums">
                    {currency(o.tax)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="mt-1 font-semibold tabular-nums">
                    {currency(o.total)}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Payment</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-sm text-foreground">
                    {o.payment_method || "—"}
                  </p>
                  <Badge variant={badgeVariantForPayment(paymentStatus)}>
                    {paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-muted/30">
                <th className="px-4 py-3 font-medium whitespace-nowrap">#</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Order ID
                </th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Instructions</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Subtotal
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Discount
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Tax</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Total
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Payment
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((o, index) => {
                const instructions = String(
                  o.special_instructions || "",
                ).trim();
                const paymentStatus =
                  String(o.payment_status || "").trim() || "—";
                const orderStatus = String(o.order_status || "").trim() || "—";
                return (
                  <tr
                    key={o.id}
                    className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(o.created_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                      {o.order_id || "—"}
                    </td>
                    <td className="px-4 py-3 max-w-[360px]">
                      <span className="text-xs text-muted-foreground">
                        {itemsSummary(o) || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <span className="text-xs text-muted-foreground break-words">
                        {instructions || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                      {currency(o.subtotal)}
                    </td>
                    <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                      -{currency(o.discount)}
                    </td>
                    <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                      {currency(o.tax)}
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums whitespace-nowrap">
                      {currency(o.total)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className="text-xs text-foreground">
                          {o.payment_method || "—"}
                        </p>
                        <Badge
                          className="w-fit"
                          variant={badgeVariantForPayment(paymentStatus)}
                        >
                          {paymentStatus}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={badgeVariantForOrder(orderStatus)}>
                        {orderStatus}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (shared) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-muted-foreground mr-1">
            Page {safePage} / {totalPages}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={safePage <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={safePage >= totalPages || isLoading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
