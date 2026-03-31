import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { fetchMyReservations } from "@/services/userReservationService";
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

const getWhenLabel = (reservation) => {
  const startsAt = new Date(reservation?.startsAt);
  const endsAt = new Date(reservation?.endsAt);
  const now = Date.now();

  const startMs = startsAt.getTime();
  const endMs = endsAt.getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return "—";

  if (now < startMs) return "Upcoming";
  if (now >= startMs && now < endMs) return "Active";
  return "Past";
};

const toTimeMs = (value) => {
  const d = new Date(value);
  const ms = d.getTime();
  return Number.isFinite(ms) ? ms : 0;
};

const badgeVariantForWhen = (label) => {
  const l = String(label || "")
    .trim()
    .toUpperCase();
  if (l === "ACTIVE") return "secondary";
  if (l === "UPCOMING") return "default";
  if (l === "PAST") return "outline";
  return "outline";
};

const badgeVariantForStatus = (status) => {
  const s = String(status || "")
    .trim()
    .toUpperCase();
  if (s === "CONFIRMED" || s === "APPROVED") return "secondary";
  if (s === "CANCELLED" || s === "REJECTED") return "destructive";
  if (s === "PENDING") return "outline";
  return "outline";
};

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await fetchMyReservations({ limit: 200 });
        if (!ignore) {
          setReservations(
            Array.isArray(response?.reservations) ? response.reservations : [],
          );
        }
      } catch (error) {
        if (!ignore) {
          toast({
            variant: "destructive",
            title: "Failed to load reservations",
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
    const now = Date.now();

    return [...reservations].sort((a, b) => {
      const aStart = toTimeMs(a?.startsAt);
      const aEnd = toTimeMs(a?.endsAt);
      const bStart = toTimeMs(b?.startsAt);
      const bEnd = toTimeMs(b?.endsAt);

      const aPast = aEnd > 0 && aEnd <= now;
      const bPast = bEnd > 0 && bEnd <= now;
      if (aPast !== bPast) return aPast ? 1 : -1;

      // Upcoming/Active: sort by earliest start first.
      if (!aPast && !bPast) {
        if (aStart !== bStart) return aStart - bStart;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      }

      // Past: newest ended first.
      if (aEnd !== bEnd) return bEnd - aEnd;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  }, [reservations]);

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
    return (
      <p className="text-sm text-muted-foreground">Loading reservations...</p>
    );
  }

  if (!sorted.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Your reservations will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pageItems.map((r) => {
          const whenLabel = getWhenLabel(r);
          const statusLabel = String(r.status || "").trim() || "—";
          return (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Reservation</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {r.tableNumber ? `Table ${r.tableNumber}` : "—"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Created</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {formatDateTime(r.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant={badgeVariantForWhen(whenLabel)}>
                    {whenLabel}
                  </Badge>
                  <Badge variant={badgeVariantForStatus(statusLabel)}>
                    {statusLabel}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Starts</p>
                  <p className="mt-1 text-sm text-foreground">
                    {formatDateTime(r.startsAt)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Ends</p>
                  <p className="mt-1 text-sm text-foreground">
                    {formatDateTime(r.endsAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left bg-muted/30">
                <th className="px-4 py-3 font-medium whitespace-nowrap">#</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Created
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  When
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Table
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Starts
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Ends
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r, index) => {
                const whenLabel = getWhenLabel(r);
                const statusLabel = String(r.status || "").trim() || "—";
                return (
                  <tr
                    key={r.id}
                    className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={badgeVariantForWhen(whenLabel)}>
                        {whenLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.tableNumber ? `Table ${r.tableNumber}` : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(r.startsAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(r.endsAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={badgeVariantForStatus(statusLabel)}>
                        {statusLabel}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

export default MyReservations;
