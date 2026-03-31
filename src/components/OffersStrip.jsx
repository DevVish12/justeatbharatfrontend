import { apiRequest } from "@/services/api";
import { Check, ChevronDown, Copy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

const OffersStrip = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    apiRequest("/coupons", { method: "GET" })
      .then((res) => {
        setCoupons(Array.isArray(res?.coupons) ? res.coupons : []);
      })
      .catch((e) => {
        setCoupons([]);
        setError(e?.message || "Failed to load coupons");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleCopy = () => {
    if (selectedCode) {
      navigator.clipboard.writeText(selectedCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowModal(false);
        setSelectedCode(null);
      }, 1500);
    }
  };

  const sorted = useMemo(() => {
    return [...coupons].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0),
    );
  }, [coupons]);

  // Show nothing if loading or error and no coupons
  if (isLoading || (error && sorted.length === 0)) return null;
  if (sorted.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-3 bg-accent border rounded-lg px-3 py-2.5 hover:border-primary/40 transition-colors"
        style={{ borderWidth: "1px", borderColor: "#E6E6E6" }}
      >
        <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-black text-[10px]">%</span>
        </span>
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {getOfferText(sorted[0])}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Use Code{" "}
            <span className="font-bold text-primary">{sorted[0].code}</span>
          </p>
        </div>
        <div className="flex items-center gap-0.5 text-[10px] text-primary font-bold shrink-0">
          {sorted.length} OFFERS <ChevronDown className="w-3 h-3" />
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-foreground/50"
            onClick={() => {
              setShowModal(false);
              setSelectedCode(null);
            }}
          />
          <div className="relative bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[75vh] flex flex-col shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">
                Select a Coupon
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCode(null);
                }}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sorted.map((offer) => (
                <button
                  key={offer.code}
                  onClick={() => setSelectedCode(offer.code)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedCode === offer.code
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedCode === offer.code
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedCode === offer.code && (
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {getOfferText(offer)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Code:{" "}
                      <span className="font-bold text-primary">
                        {offer.code}
                      </span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-border">
              <button
                onClick={handleCopy}
                disabled={!selectedCode}
                className="w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 bg-primary text-primary-foreground hover:opacity-90"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Code & Apply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OffersStrip;
