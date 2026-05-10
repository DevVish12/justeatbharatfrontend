import { apiRequest } from "@/services/api";
import { Check, Copy, Tag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const getOfferText = (coupon) => {
  const type = coupon?.discountType;
  const value = coupon?.discountValue;
  const min = coupon?.minOrder;

  if (type === "flat") {
    return `Flat ₹${value || 0} off${min ? ` on orders above ₹${min}` : ""}`;
  }
  if (type === "percent") {
    return `${value || 0}% OFF${min ? ` on orders above ₹${min}` : ""}`;
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
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
    );
  }, [coupons]);

  if (isLoading || (error && sorted.length === 0)) return null;
  if (sorted.length === 0) return null;

  return (
    <>
      {/* ── Offer Strip ── */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-3 bg-white rounded-xl px-4 py-3 hover:shadow-md transition-shadow"
        style={{
          border: "1px solid #F0F0F0",
          boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
        }}
      >
        {/* Tag icon circle */}
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#FFF3E8" }}
        >
          <Tag
            className="w-4 h-4"
            style={{ color: "#FF6B00", strokeWidth: 2 }}
          />
        </span>

        {/* Text block */}
        <div className="flex-1 text-left min-w-0">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "#1A1A1A" }}
          >
            {getOfferText(sorted[0])}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#888" }}>
            Use{" "}
            <span className="font-bold" style={{ color: "#FF6B00" }}>
              {sorted[0].code}
            </span>
          </p>
        </div>

        {/* Offers count */}
        <div
          className="flex items-center gap-0.5 text-xs font-bold shrink-0"
          style={{ color: "#FF6B00" }}
        >
          {sorted.length} offers
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </button>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => {
              setShowModal(false);
              setSelectedCode(null);
            }}
          />

          {/* Sheet */}
          <div
            className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl flex flex-col"
            style={{
              maxHeight: "80vh",
              boxShadow: "0 -4px 30px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-5 py-4"
              style={{ borderBottom: "1px solid #F0F0F0" }}
            >
              <Tag
                className="w-5 h-5 shrink-0"
                style={{ color: "#FF6B00", strokeWidth: 2 }}
              />
              <h3
                className="flex-1 text-base font-bold"
                style={{ color: "#1A1A1A" }}
              >
                Available Coupons
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCode(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#555" }} />
              </button>
            </div>

            {/* Coupon list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {sorted.map((offer) => {
                const isSelected = selectedCode === offer.code;
                return (
                  <button
                    key={offer.code}
                    onClick={() => setSelectedCode(offer.code)}
                    className="w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all"
                    style={{
                      border: isSelected
                        ? "1.5px solid #FF6B00"
                        : "1.5px solid #EFEFEF",
                      background: isSelected ? "#FFF9F5" : "#fff",
                    }}
                  >
                    {/* Radio */}
                    <span
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: isSelected ? "#FF6B00" : "#BDBDBD",
                        background: isSelected ? "#FF6B00" : "transparent",
                      }}
                    >
                      {isSelected && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: "#fff" }}
                        />
                      )}
                    </span>

                    {/* Coupon info */}
                    <div className="min-w-0">
                      <p
                        className="text-sm font-semibold leading-snug"
                        style={{ color: "#1A1A1A" }}
                      >
                        {getOfferText(offer)}
                      </p>
                      <p
                        className="text-xs font-bold mt-1 tracking-wide"
                        style={{ color: "#FF6B00" }}
                      >
                        {offer.code}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div
              className="px-4 py-4"
              style={{ borderTop: "1px solid #F0F0F0" }}
            >
              <button
                onClick={handleCopy}
                disabled={!selectedCode}
                className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: selectedCode ? "#FF6B00" : "#FDDCC8",
                  color: selectedCode ? "#fff" : "#fff",
                  cursor: selectedCode ? "pointer" : "not-allowed",
                }}
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