import { apiRequest } from "@/services/api";
import { useEffect, useMemo, useState } from "react";

const normalize = (value) => String(value || "").trim();

const getOfferText = (coupon) => {
  const type = coupon?.discountType;
  const value = coupon?.discountValue;
  const min = coupon?.minOrder;

  if (type === "flat") {
    return `Flat ₹${value || 0} off${min ? ` on orders above ₹${min}` : ""}`;
  }
  if (type === "percent") {
    return `${value || 0}% off${min ? ` on orders above ₹${min}` : ""}`;
  }
  if (type === "free_item") {
    return `Free item${min ? ` on orders above ₹${min}` : ""}`;
  }
  if (type === "bogo") {
    return `BOGO offer${min ? ` on orders above ₹${min}` : ""}`;
  }
  return coupon?.title || "";
};

export default function PromosModal({ open, onClose, onSelectCode }) {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let ignore = false;
    setIsLoading(true);
    setError("");

    apiRequest("/coupons", { method: "GET" })
      .then((res) => {
        if (ignore) return;
        setCoupons(Array.isArray(res?.coupons) ? res.coupons : []);
      })
      .catch((e) => {
        if (ignore) return;
        setCoupons([]);
        setError(e?.message || "Failed to load promos");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [open]);

  const sorted = useMemo(() => {
    return [...coupons].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [coupons]);

  const copyCode = async (code) => {
    const value = normalize(code);
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Promos</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground text-lg"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No promos available.
            </p>
          ) : (
            sorted.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {c.code}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {c.description || getOfferText(c)}
                    </p>
                    <p className="mt-2 text-xs font-medium text-foreground">
                      {getOfferText(c)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => copyCode(c.code)}
                      className="text-xs font-semibold border border-border rounded-lg px-3 py-2 bg-card"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectCode) onSelectCode(c.code);
                        if (onClose) onClose();
                      }}
                      className="text-xs font-semibold bg-primary text-primary-foreground rounded-lg px-3 py-2"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
