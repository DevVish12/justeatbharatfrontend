import { useCart } from "@/context/CartContext";
import { getImage } from "@/lib/imageMap";
import { X } from "lucide-react";
import { useState } from "react";

const ProductModal = ({ item, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addItem } = useCart();

  if (!item) return null;

  const isEgg = Boolean(item.isEgg);
  const foodTypeLabel = isEgg ? "Egg" : item.isVeg ? "Veg" : "Non-Veg";
  const foodTypeBorderClass = isEgg
    ? "border-primary"
    : item.isVeg
      ? "border-veg"
      : "border-nonveg";
  const foodTypeDotClass = isEgg
    ? "bg-primary"
    : item.isVeg
      ? "bg-veg"
      : "bg-nonveg";

  const variants = item.variants || [];
  const activeVariant =
    selectedVariant || (variants.length > 0 ? variants[0] : null);
  const displayPrice = activeVariant?.price || item.price;

  const cuisineText = Array.isArray(item.cuisine)
    ? item.cuisine.filter(Boolean).join(", ")
    : typeof item.cuisine === "string"
      ? item.cuisine
      : "";

  const tagList = Array.isArray(item.tags)
    ? item.tags.filter(Boolean)
    : typeof item.tags === "string"
      ? item.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const addonsList = Array.isArray(item.addons) ? item.addons : [];

  const imageSourceLabel = item.custom_image
    ? "Custom"
    : item.item_image_url
      ? "Petpooja"
      : item.local_image
        ? "Local"
        : null;

  const hasCustomization = variants.length > 0 || addonsList.length > 0;

  const handleAdd = () => {
    addItem(item, activeVariant || undefined);
    onClose();
  };

  // Responsive styles for mobile
  const responsiveCSS = `
    @media (max-width: 768px) {
      .product-modal-wrapper {
        display: flex !important;
        flex-direction: column !important;
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 0 !important;
        max-height: 95vh !important;
        height: auto !important;
        border-radius: 0 !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        position: fixed !important;
        left: 0 !important;
        top: 0px !important;
        box-shadow: none !important;
      }
      .product-modal-left {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100vw !important;
        padding-bottom: 0 !important;
        background: #fff !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
      }
      .product-modal-left.no-custom {
        flex: none !important;
        min-height: unset !important;
        height: auto !important;
      }
      .product-modal-img {
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 0 !important;
        height: 200px !important;
        max-height: 220px !important;
        object-fit: cover !important;
        border-radius: 0 !important;
        display: block !important;
      }
      .product-modal-dish-info {
        padding: 16px 14px 0 14px !important;
        min-width: 0 !important;
        max-width: 100vw !important;
        overflow: visible !important;
      }
      .product-modal-right {
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 0 !important;
        border-left: none !important;
        border-top: 1px solid #e5e7eb !important;
        background: #fff !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        padding-bottom: 80px !important;
        display: flex !important;
        flex-direction: column !important;
      }
      .product-modal-scroll {
        max-height: none !important;
        overflow: visible !important;
        padding-bottom: 0 !important;
      }
      .product-modal-cart-bar {
        position: fixed !important;
        left: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        z-index: 1001 !important;
        border-radius: 0 !important;
        box-shadow: 0 -2px 16px 0 rgba(0,0,0,0.08) !important;
        margin: 0 !important;
        padding: 0 16px !important;
        height: 64px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }
      .product-modal-close-btn {
        top: 12px !important;
        right: 12px !important;
        width: 36px !important;
        height: 36px !important;
        z-index: 1002 !important;
        background: rgba(255,255,255,0.85) !important;
        border-radius: 50% !important;
        border: 1.5px solid #e5e7eb !important;
        position: absolute !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08) !important;
      }
      .product-modal-right-header {
        display: none !important;
      }
    }
    @media (max-width: 480px) {
      .product-modal-img {
        height: 160px !important;
        max-height: 180px !important;
      }
      .product-modal-cart-bar {
        height: 56px !important;
        font-size: 15px !important;
      }
    }
  `;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <style>{responsiveCSS}</style>
      <style>{`
        @media (max-width: 768px) {
          .product-modal-wrapper {
            height: auto !important;
            max-height: fit-content !important;
          }
          .product-modal-left.no-custom {
            flex: none !important;
            height: auto !important;
            min-height: unset !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
      <div
        className="wrapper product-modal-wrapper"
        style={{
          display: "grid",
          gridTemplateColumns: hasCustomization
            ? "minmax(320px, 460px) 1fr"
            : "1fr",
          width: "100%",
          maxWidth: hasCustomization ? 980 : 460,
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 0 80px rgba(0,0,0,0.6)",
          height: "auto",
          position: "relative",
        }}
      >
        {/* LEFT */}
        <div
          className={`left product-modal-left${!hasCustomization ? " no-custom" : ""}`}
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
            paddingBottom: 0,
          }}
        >
          <img
            className="dish-img product-modal-img"
            src={getImage(item.image)}
            alt={item.name}
            style={{
              width: "100%",
              height:
                variants.length > 0 ||
                addonsList.length > 0 ||
                tagList.length > 0 ||
                item.description
                  ? 220
                  : 140,
              objectFit: "cover",
              display: "block",
              transition: "height 0.2s",
            }}
            loading="lazy"
          />
          <div
            className="dish-info product-modal-dish-info"
            style={{
              flex: hasCustomization ? 1 : "unset",
              padding:
                item.description || item.isCustomisable
                  ? "16px 18px 0"
                  : "10px 18px 0",
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            <div
              className="top-row"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 8,
                flexWrap: "nowrap",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  flex: 1,
                }}
              >
                <div
                  className="veg-dot"
                  style={{
                    width: 22,
                    height: 22,
                    border: `2px solid ${isEgg ? "#e85d04" : item.isVeg ? "#1a6b3c" : "#e85d04"}`,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      background: isEgg
                        ? "#e85d04"
                        : item.isVeg
                          ? "#1a6b3c"
                          : "#e85d04",
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />
                </div>
                {/* TAGS NEAR DOT */}
                {(item.isBestseller ||
                  item.isCombo ||
                  item.isRecommended ||
                  tagList.length > 0) && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {item.isBestseller && (
                      <span
                        className="tag tag-orange"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: "#fff1e6",
                          color: "#e85d04",
                        }}
                      >
                        ⭐ Bestseller
                      </span>
                    )}
                    {item.isCombo && (
                      <span
                        className="tag tag-purple"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: "#f3e8ff",
                          color: "#7c3aed",
                        }}
                      >
                        🎁 Combo
                      </span>
                    )}
                    {item.isRecommended && (
                      <span
                        className="tag tag-orange"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: "#fff1e6",
                          color: "#e85d04",
                        }}
                      >
                        👍 Recommended
                      </span>
                    )}
                    {tagList.map((tag) => (
                      <span
                        key={tag}
                        className="tag tag-orange"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: "#fff1e6",
                          color: "#e85d04",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="share-btn"
                style={{
                  width: 34,
                  height: 34,
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  marginTop: 0,
                  marginLeft: 12,
                }}
              >
                <svg
                  width="14"
                  height="14"
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
            <h1
              className="dish-name"
              style={{
                fontSize: 21,
                fontWeight: 800,
                color: "#1a1a1a",
                marginBottom: item.description || item.isCustomisable ? 7 : 0,
              }}
            >
              {item.name}
            </h1>
            {item.description && (
              <p
                className="dish-desc"
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 1.55,
                  marginBottom: 6,
                }}
              >
                {item.description}
              </p>
            )}
            {item.isCustomisable && (
              <p
                className="customisable"
                style={{ fontSize: 13, color: "#6b7280", marginBottom: 7 }}
              >
                Customisable
              </p>
            )}
            {/* Star ratings (static 4/5 for demo) */}
            <div
              className="stars"
              style={{
                display: "flex",
                gap: 2,
                marginBottom: item.description || item.isCustomisable ? 10 : 0,
              }}
            >
              <span className="star" style={{ fontSize: 19, color: "#fbbf24" }}>
                ★
              </span>
              <span className="star" style={{ fontSize: 19, color: "#fbbf24" }}>
                ★
              </span>
              <span className="star" style={{ fontSize: 19, color: "#fbbf24" }}>
                ★
              </span>
              <span className="star" style={{ fontSize: 19, color: "#fbbf24" }}>
                ★
              </span>
              <span
                className="star star-empty"
                style={{ fontSize: 19, color: "#d1d5db" }}
              >
                ★
              </span>
            </div>
          </div>
        </div>
        {/* RIGHT (Customization section) - only render if hasCustomization is true */}
        {hasCustomization && (
          <div
            className="right product-modal-right"
            style={{
              borderLeft: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              overflow: "hidden",
              minHeight: 0,
              position: "relative",
              paddingBottom: 0,
            }}
          >
            <div
              className="right-header product-modal-right-header"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "14px 18px 0",
                minHeight: 0,
              }}
            >
              <button
                className="close-btn"
                onClick={onClose}
                style={{
                  width: 30,
                  height: 30,
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "50%",
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: "#6b7280",
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="right-scroll product-modal-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                padding:
                  variants.length > 0 ||
                  addonsList.length > 0 ||
                  tagList.length > 0
                    ? "0 18px 24px"
                    : "0 18px 10px",
                minHeight: 0,
              }}
            >
              {/* VARIANTS */}
              {variants.length > 0 && (
                <>
                  <div
                    className="sec-title"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      margin: "18px 0 12px",
                    }}
                  >
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#1a1a1a",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        minWidth: 120,
                        margin: "0 8px",
                        display: "block",
                      }}
                    >
                      Choose Size
                    </span>
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                  </div>
                  <div
                    className="v-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    {variants.map((v) => (
                      <div
                        key={v.name}
                        className={`v-card${activeVariant?.name === v.name ? " selected" : ""}`}
                        onClick={() => setSelectedVariant(v)}
                        style={{
                          border:
                            activeVariant?.name === v.name
                              ? "2px solid #1a6b3c"
                              : "1.5px solid #e5e7eb",
                          borderRadius: 12,
                          padding: 12,
                          cursor: "pointer",
                          position: "relative",
                          background:
                            activeVariant?.name === v.name ? "#e8f5ee" : "#fff",
                        }}
                      >
                        <div
                          className="v-radio"
                          style={{
                            position: "absolute",
                            top: 11,
                            right: 11,
                            width: 19,
                            height: 19,
                            border: `2px solid ${activeVariant?.name === v.name ? "#1a6b3c" : "#ccc"}`,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              background: "#1a6b3c",
                              borderRadius: "50%",
                              opacity: activeVariant?.name === v.name ? 1 : 0,
                              transition: "opacity 0.15s",
                              display: "block",
                            }}
                          />
                        </div>
                        <div
                          className="v-name"
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            lineHeight: 1.35,
                            paddingRight: 28,
                            marginBottom: 5,
                          }}
                        >
                          {v.name}
                        </div>
                        <div
                          className="v-price"
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1a1a1a",
                          }}
                        >
                          {v.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* ADDONS */}
              {addonsList.length > 0 && (
                <>
                  <div
                    className="sec-title"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      margin: "18px 0 12px",
                    }}
                  >
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "#1a1a1a",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        minWidth: 120,
                        margin: "0 8px",
                        display: "block",
                      }}
                    >
                      Add Extras
                    </span>
                    <div
                      style={{ flex: 1, height: 1, background: "#e5e7eb" }}
                    />
                  </div>
                  <div
                    className="addon-list"
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {addonsList.map((addon, index) => (
                      <div
                        key={
                          addon?.id ?? `${addon?.name}-${addon?.price}-${index}`
                        }
                        className="addon-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: 12,
                          padding: "12px 14px",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          className="addon-left"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            className="a-veg"
                            style={{
                              width: 20,
                              height: 20,
                              border: "2px solid #1a6b3c",
                              borderRadius: 3,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                background: "#1a6b3c",
                                borderRadius: "50%",
                                display: "block",
                              }}
                            />
                          </div>
                          <span
                            className="addon-name"
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#1a1a1a",
                            }}
                          >
                            {addon?.name}
                          </span>
                        </div>
                        <div
                          className="addon-right"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <span
                            className="addon-price"
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#1a1a1a",
                            }}
                          >
                            {addon?.price != null ? `₹${addon.price}` : ""}
                          </span>
                          <div
                            className="a-check"
                            style={{
                              width: 20,
                              height: 20,
                              border: "2px solid #ccc",
                              borderRadius: 4,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <button
          className="close-btn product-modal-close-btn"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          aria-label="Close"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div
          className="cart-bar product-modal-cart-bar"
          style={{
            background: "#1a6b3c",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            height: 56,
            marginTop:
              variants.length > 0 ||
              addonsList.length > 0 ||
              tagList.length > 0 ||
              item.description
                ? "auto"
                : 8,
            borderTop:
              variants.length > 0 ||
              addonsList.length > 0 ||
              tagList.length > 0 ||
              item.description
                ? undefined
                : "1px solid #e5e7eb",
            transition: "margin-top 0.2s, border-top 0.2s",
            position: "static",
            left: "auto",
            bottom: "auto",
            width: "100%",
            zIndex: 100,
          }}
        >
          <span
            className="cart-price"
            style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}
          >
            ₹ {displayPrice}
          </span>
          <button
            className="cart-btn"
            onClick={handleAdd}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontFamily: "Nunito, sans-serif",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ADD TO CART
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              viewBox="0 0 24 24"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
