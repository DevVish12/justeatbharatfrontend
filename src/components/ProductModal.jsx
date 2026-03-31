import { useCart } from "@/context/CartContext";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { getImage } from "@/lib/imageMap";
import { useRef, useState } from "react";

// ── Theme ──────────────────────────────────────────────────────────────────
const PRIMARY = "#e85d04";
const PRIMARY_BG = "#fff4ee";
const PRIMARY_DK = "#c84d00";

// ── Helpers ────────────────────────────────────────────────────────────────
const formatINR = (n) =>
  Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// ── Component ──────────────────────────────────────────────────────────────
const ProductModal = ({ item, onClose }) => {
  const { storeOpen } = useStoreStatus();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const touchStartY = useRef(null);
  const { addItem } = useCart();

  if (!item) return null;

  const isEgg = Boolean(item.isEgg);
  const variants = item.variants || [];
  const addonsList = Array.isArray(item.addons) ? item.addons : [];
  const tagList = Array.isArray(item.tags)
    ? item.tags.filter(Boolean)
    : typeof item.tags === "string"
      ? item.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const hasCustomization = variants.length > 0 || addonsList.length > 0;
  const activeVariant =
    selectedVariant || (variants.length > 0 ? variants[0] : null);

  // ── Price ──────────────────────────────────────────────────────────────
  const basePrice = Number(activeVariant?.price ?? item.price ?? 0);
  const addonsTotal = selectedAddons.reduce(
    (s, a) => s + Number(a.price ?? 0),
    0,
  );
  const totalPrice = basePrice + addonsTotal;

  // ── Addon toggle ───────────────────────────────────────────────────────
  const toggleAddon = (addon) =>
    setSelectedAddons((prev) =>
      prev.some((a) => (a.id ?? a.name) === (addon.id ?? addon.name))
        ? prev.filter((a) => (a.id ?? a.name) !== (addon.id ?? addon.name))
        : [...prev, addon],
    );

  // ── Add to cart ────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!storeOpen) return;
    addItem(item, activeVariant || undefined, selectedAddons);
    onClose();
  };

  // ── Swipe-to-close (bottom-sheet) ─────────────────────────────────────
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (
      touchStartY.current !== null &&
      e.changedTouches[0].clientY - touchStartY.current > 80
    )
      onClose();
    touchStartY.current = null;
  };

  // ── Description truncation ─────────────────────────────────────────────
  const DESC_LIMIT = 90;
  const longDesc = item.description && item.description.length > DESC_LIMIT;
  const descText =
    longDesc && !descExpanded
      ? item.description.slice(0, DESC_LIMIT) + "…"
      : item.description;

  // ── Veg / Egg / Non-veg dot ────────────────────────────────────────────
  const dotColor = isEgg ? PRIMARY : item.isVeg ? "#16a34a" : PRIMARY;

  // ── CSS ────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

    @keyframes pmFadeIn  { from{opacity:0}        to{opacity:1} }
    @keyframes pmSlideUp { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }

    .pm-overlay { animation: pmFadeIn  0.18s ease both; }
    .pm-wrapper { animation: pmSlideUp 0.24s cubic-bezier(.32,1.1,.48,1) both; }

    /* ── Close button — white pill, every screen ── */
    .pm-close {
      position:absolute; top:14px; right:14px; z-index:300;
      width:34px; height:34px; border-radius:50%;
      background:#fff; border:none;
      box-shadow:0 2px 12px rgba(0,0,0,0.18);
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      color:#374151; padding:0;
      transition:background 0.15s, transform 0.12s;
    }
    .pm-close:hover { background:#f3f4f6; transform:scale(1.06); }
    .pm-close:active { transform:scale(0.94); }

    /* ── Shimmer skeleton ── */
    .img-shimmer {
      position:absolute; inset:0;
      background:linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%);
      background-size:1200px 100%;
      animation:shimmer 1.6s infinite linear;
    }

    /* ── Tag pills ── */
    .pm-tag {
      display:inline-flex; align-items:center;
      font-size:11px; font-weight:700;
      padding:3px 10px; border-radius:20px;
      line-height:1.4;
    }
    .pm-tag-orange { background:${PRIMARY_BG}; color:${PRIMARY}; }
    .pm-tag-purple { background:#f3e8ff; color:#7c3aed; }
    .pm-tag-green  { background:#ecfdf5; color:#16a34a; }

    /* ── Variant card ── */
    .pm-v-card {
      border:1.5px solid #e5e7eb; border-radius:14px;
      padding:11px 12px; cursor:pointer; position:relative;
      background:#fff;
      transition:border-color 0.15s, background 0.15s, box-shadow 0.15s;
    }
    .pm-v-card.active {
      border-color:${PRIMARY}; background:${PRIMARY_BG};
      box-shadow:0 0 0 1px ${PRIMARY}22;
    }
    .pm-v-radio {
      position:absolute; top:10px; right:10px;
      width:18px; height:18px; border-radius:50%;
      border:2px solid #d1d5db;
      display:flex; align-items:center; justify-content:center;
      transition:border-color 0.15s;
    }
    .pm-v-card.active .pm-v-radio { border-color:${PRIMARY}; }
    .pm-v-dot {
      width:9px; height:9px; border-radius:50%;
      background:${PRIMARY}; opacity:0;
      transition:opacity 0.15s;
    }
    .pm-v-card.active .pm-v-dot { opacity:1; }

    /* ── Addon row ── */
    .pm-addon-row {
      display:flex; align-items:center; justify-content:space-between;
      border:1.5px solid #e5e7eb; border-radius:14px;
      padding:11px 13px; cursor:pointer; background:#fff;
      transition:border-color 0.15s, background 0.15s;
    }
    .pm-addon-row.checked { border-color:${PRIMARY}; background:${PRIMARY_BG}; }

    /* ── Checkbox ── */
    .pm-checkbox {
      width:19px; height:19px; border-radius:5px;
      border:2px solid #d1d5db; background:#fff;
      display:flex; align-items:center; justify-content:center;
      transition:background 0.15s, border-color 0.15s;
      flex-shrink:0;
    }
    .pm-checkbox.checked { background:${PRIMARY}; border-color:${PRIMARY}; }

    /* ── Cart bar button ── */
    .pm-add-btn {
      background:none; border:none; color:#fff;
      font-family:'Nunito',sans-serif; font-size:14px; font-weight:800;
      letter-spacing:0.7px; cursor:pointer;
      display:flex; align-items:center; gap:7px;
      transition:opacity 0.15s;
    }
    .pm-add-btn:hover { opacity:0.88; }

    /* ════════════════════ MOBILE ════════════════════ */
    @media (max-width:768px) {
      .pm-wrapper {
        display:flex !important; flex-direction:column !important;
        width:100vw !important; max-width:100vw !important; min-width:0 !important;
        height:100dvh !important; max-height:100dvh !important;
        border-radius:0 !important; overflow:hidden !important;
        position:fixed !important; left:0 !important; top:0 !important;
        box-shadow:none !important;
      }
      .pm-overlay.no-custom-ov { align-items:flex-end !important; }
      .pm-wrapper.no-custom-wr {
        position:relative !important; height:auto !important; max-height:92dvh !important;
        border-radius:22px 22px 0 0 !important;
        box-shadow:0 -6px 40px rgba(0,0,0,0.22) !important;
        animation:pmSlideUp 0.28s cubic-bezier(.32,1.1,.48,1) both !important;
      }
      .pm-left {
        width:100% !important; max-width:100vw !important; min-width:0 !important;
        padding-bottom:0 !important; background:#fff !important; border-radius:0 !important;
        overflow:visible !important;
      }
      .pm-left.no-custom { flex:none !important; height:auto !important; }
      .pm-img-wrap {
        width:100vw !important; max-width:100vw !important;
        height:260px !important;
      }
      .pm-dish-info { padding:14px 15px 10px !important; max-width:100vw !important; }
      .pm-right {
        width:100vw !important; max-width:100vw !important; min-width:0 !important;
        border-left:none !important; border-top:1px solid #f0f0f0 !important;
        overflow:visible !important; padding-bottom:72px !important;
        display:flex !important; flex-direction:column !important;
      }
      .pm-right-scroll { max-height:none !important; overflow:visible !important; }
      .pm-cart-bar {
        position:fixed !important; left:0 !important; bottom:0 !important;
        width:100vw !important; z-index:1001 !important;
        border-radius:0 !important; box-shadow:0 -2px 20px rgba(0,0,0,0.08) !important;
        margin:0 !important;
        padding:8px 14px env(safe-area-inset-bottom,8px) !important;
        background:#fff !important;
        border-top:1px solid #f3f4f6 !important;
      }
      .pm-cart-bar.no-custom-cart {
        position:static !important; width:100% !important;
        box-shadow:none !important;
        padding:8px 14px env(safe-area-inset-bottom,8px) !important;
        border-top:1px solid #f3f4f6 !important;
      }
      .pm-close { top:12px !important; right:12px !important; }
      .pm-drag  { display:block !important; }
    }
    @media (max-width:480px) {
      .pm-img-wrap { height:220px !important; }
    }
  `;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 pm-overlay${!hasCustomization ? " no-custom-ov" : ""}`}
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{css}</style>

      <div
        className={`pm-wrapper${!hasCustomization ? " no-custom-wr" : ""}`}
        onTouchStart={!hasCustomization ? onTouchStart : undefined}
        onTouchEnd={!hasCustomization ? onTouchEnd : undefined}
        style={{
          display: "grid",
          gridTemplateColumns: hasCustomization
            ? "minmax(320px,460px) 1fr"
            : "1fr",
          width: "100%",
          maxWidth: hasCustomization ? 980 : 460,
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 8px 60px rgba(0,0,0,0.45)",
          height: "auto",
          position: "relative",
        }}
      >
        {/* Drag handle — mobile bottom-sheet only */}
        <div
          className="pm-drag"
          style={{
            display: "none",
            position: "absolute",
            top: 9,
            left: "50%",
            transform: "translateX(-50%)",
            width: 38,
            height: 4,
            borderRadius: 999,
            background: "#d1d5db",
            zIndex: 400,
            pointerEvents: "none",
          }}
        />

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div
          className={`pm-left${!hasCustomization ? " no-custom" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            overflow: "hidden",
            minWidth: 0,
            flex: hasCustomization ? 1 : "unset",
            minHeight: hasCustomization ? 0 : "auto",
            gridColumn: hasCustomization ? "auto" : "1 / span 2",
            position: "relative",
          }}
        >
          {/* ── Image ── */}
          <div
            className="pm-img-wrap"
            style={{
              width: "100%",
              height: 240,
              background: "#f8f8f8",
              position: "relative",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {!imgLoaded && <div className="img-shimmer" />}
            <img
              src={getImage(item.image)}
              alt={item.name}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.35s",
              }}
              loading="lazy"
            />
          </div>

          {/* ── Dish info ── */}
          <div
            className="pm-dish-info"
            style={{
              flex: hasCustomization ? 1 : "unset",
              padding: "16px 20px 14px",
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            {/* Row: veg dot + tags + share */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  flexWrap: "wrap",
                  flex: 1,
                }}
              >
                {/* Veg / Egg / Non-veg indicator */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    flexShrink: 0,
                    border: `2px solid ${dotColor}`,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: dotColor,
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />
                </div>

                {/* Tags — no emojis, clean pills */}
                {(item.isBestseller ||
                  item.isCombo ||
                  item.isRecommended ||
                  tagList.length > 0) && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {item.isBestseller && (
                      <span className="pm-tag pm-tag-orange">Bestseller</span>
                    )}
                    {item.isCombo && (
                      <span className="pm-tag pm-tag-purple">Combo</span>
                    )}
                    {item.isRecommended && (
                      <span className="pm-tag pm-tag-orange">Recommended</span>
                    )}
                    {tagList.map((tag) => (
                      <span key={tag} className="pm-tag pm-tag-green">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Share — working Web Share API with clipboard fallback */}
              <button
                onClick={async () => {
                  const shareData = {
                    title: item.name,
                    text: item.description || item.name,
                    url: window.location.href,
                  };
                  try {
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }
                  } catch (_) {}
                }}
                style={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#111827",
                marginBottom: 5,
                lineHeight: 1.25,
                letterSpacing: "-0.3px",
              }}
            >
              {item.name}
            </h1>

            {/* Description */}
            {item.description && (
              <p
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 1.6,
                  marginBottom: 6,
                }}
              >
                {descText}
                {longDesc && (
                  <button
                    onClick={() => setDescExpanded((v) => !v)}
                    style={{
                      background: "none",
                      border: "none",
                      color: PRIMARY,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      padding: "0 0 0 3px",
                    }}
                  >
                    {descExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            )}

            {item.isCustomisable && (
              <p
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  marginBottom: 5,
                  fontStyle: "italic",
                }}
              >
                Customisable
              </p>
            )}

            {/* Stars */}
            <div style={{ display: "flex", gap: 1, marginBottom: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 16,
                    color: s <= 4 ? "#f59e0b" : "#e5e7eb",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        {hasCustomization && (
          <div
            className="pm-right"
            style={{
              borderLeft: "1px solid #f0f0f0",
              display: "flex",
              flexDirection: "column",
              background: "#fafafa",
              overflow: "hidden",
              minHeight: 0,
              position: "relative",
            }}
          >
            <div
              className="pm-right-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 16px 24px",
                minHeight: 0,
              }}
            >
              {/* VARIANTS */}
              {variants.length > 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      margin: "6px 0 12px",
                    }}
                  >
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#374151",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                      }}
                    >
                      Choose Size
                    </span>
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 9,
                      marginBottom: 6,
                    }}
                  >
                    {variants.map((v) => {
                      const active = activeVariant?.name === v.name;
                      return (
                        <div
                          key={v.name}
                          className={`pm-v-card${active ? " active" : ""}`}
                          onClick={() => setSelectedVariant(v)}
                        >
                          <div className="pm-v-radio">
                            <span className="pm-v-dot" />
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#1f2937",
                              paddingRight: 24,
                              marginBottom: 4,
                              lineHeight: 1.3,
                            }}
                          >
                            {v.name}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: PRIMARY,
                            }}
                          >
                            ₹{formatINR(v.price)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ADDONS */}
              {addonsList.length > 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      margin: "10px 0 12px",
                    }}
                  >
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#374151",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                      }}
                    >
                      Add Extras
                    </span>
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {addonsList.map((addon, index) => {
                      const checked = selectedAddons.some(
                        (a) => (a.id ?? a.name) === (addon?.id ?? addon?.name),
                      );
                      return (
                        <div
                          key={addon?.id ?? `${addon?.name}-${index}`}
                          className={`pm-addon-row${checked ? " checked" : ""}`}
                          onClick={() => toggleAddon(addon)}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                            }}
                          >
                            {/* veg dot */}
                            <div
                              style={{
                                width: 17,
                                height: 17,
                                border: "2px solid #16a34a",
                                borderRadius: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  background: "#16a34a",
                                  borderRadius: "50%",
                                  display: "block",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#1f2937",
                              }}
                            >
                              {addon?.name}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            {addon?.price != null && (
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#374151",
                                }}
                              >
                                +₹{formatINR(addon.price)}
                              </span>
                            )}
                            <div
                              className={`pm-checkbox${checked ? " checked" : ""}`}
                            >
                              {checked && (
                                <svg
                                  width="11"
                                  height="11"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <polyline
                                    points="2,6 5,9 10,3"
                                    stroke="#fff"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ CLOSE BUTTON ══════════════ */}
        <button className="pm-close" onClick={onClose} aria-label="Close">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ══════════════ CART BAR — full-width pill button ══════════════ */}
        <div
          className={`pm-cart-bar${!hasCustomization ? " no-custom-cart" : ""}`}
          style={{
            background: "#fff",
            padding: "10px 16px 12px",
            position: "static",
            width: "100%",
            zIndex: 100,
            borderTop: "1px solid #f3f4f6",
          }}
        >
          {!storeOpen && (
            <div
              style={{
                marginBottom: 8,
                width: "100%",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 800,
                color: "#dc2626",
              }}
            >
              Restaurant is currently closed
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={!storeOpen}
            style={{
              width: "100%",
              background: PRIMARY,
              border: "none",
              borderRadius: 14,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              cursor: storeOpen ? "pointer" : "not-allowed",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: `0 4px 18px ${PRIMARY}55`,
              transition: "transform 0.12s, box-shadow 0.12s",
              opacity: storeOpen ? 1 : 0.6,
            }}
            onMouseDown={(e) => {
              if (!storeOpen) return;
              e.currentTarget.style.transform = "scale(0.98)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${PRIMARY}44`;
            }}
            onMouseUp={(e) => {
              if (!storeOpen) return;
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 4px 18px ${PRIMARY}55`;
            }}
          >
            {/* Price left */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                TOTAL
              </span>
              <span
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 900,
                  letterSpacing: "-0.2px",
                }}
              >
                ₹{formatINR(totalPrice)}
              </span>
            </div>

            {/* ADD TO CART right */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#fff",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.7px",
                  color: "#fff",
                }}
              >
                ADD TO CART
              </span>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
