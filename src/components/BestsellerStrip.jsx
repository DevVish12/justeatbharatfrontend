import { useCart } from "@/context/CartContext";
import { getImage } from "@/lib/imageMap";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useRef } from "react";

const getDisplayPrice = (item) => {
  if (item?.variants && item.variants.length > 0) {
    const prices = item.variants
      .map((v) => Number(v?.price))
      .filter((n) => Number.isFinite(n));

    if (prices.length > 0) return Math.min(...prices);
  }
  return item?.price;
};

const BestsellerStrip = ({ items, onItemClick, onQuickAdd }) => {
  const scrollRef = useRef(null);
  const { items: cartItems, updateQuantity } = useCart();

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -270 : 270,
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <>
      <style>{`
        .bs-scroll::-webkit-scrollbar { display: none; }
        .bs-card:hover { box-shadow: 0 14px 30px rgba(148,163,184,0.24), 0 4px 10px rgba(148,163,184,0.16) !important; }
        .bs-addbtn:hover { background-color: #F9FAFB !important; }
        .bs-card {
          width: 260px;
          min-height: 375px;
        }
        .bs-image {
          height: 250px;
        }

        @media (max-width: 1024px) {
          .bs-card {
            width: clamp(190px, 30vw, 230px);
            min-height: 340px;
          }
          .bs-image {
            height: 210px;
          }
        }

        @media (max-width: 768px) {
          .bs-outer {
            width: 100vw !important;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
            border-radius: 0 !important;
          }
          .bs-track {
            padding-left: 12px !important;
            padding-right: 12px !important;
            gap: 10px !important;
          }
          .bs-card {
            width: clamp(150px, 42vw, 185px);
            min-height: 300px;
          }
          .bs-image {
            height: 170px;
          }
          .bs-content {
            padding: 8px 12px 10px !important;
          }
          .bs-name {
            margin-top: 10px !important;
          }
          .bs-title {
            font-size: 15px !important;
            line-height: 18px !important;
            letter-spacing: 0.16em !important;
            margin-bottom: 10px !important;
          }
          .bs-tag {
            font-size: 10px !important;
            padding: 3px 10px !important;
          }
          .bs-price {
            font-size: 14px !important;
          }
          .bs-price-row {
            padding-top: 12px !important;
          }
          .bs-addbtn {
            font-size: 12px !important;
            padding: 7px 14px !important;
            border-radius: 7px !important;
          }
          .bs-qtybtn {
            padding: 4px 9px !important;
          }
          .bs-qtytext {
            font-size: 13px !important;
            padding: 0 9px !important;
          }
        }

        @media (max-width: 480px) {
          /* Card — wider, clean white, subtle shadow like Image 2 */
          .bs-card {
            width: clamp(140px, 44vw, 160px) !important;
            min-height: 200px !important;
            border-radius: 14px !important;
            overflow: hidden;
            border: 1px solid #f0f0f0 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
            background: #fff !important;
          }
          

          /* Remove image wrapper padding — image flush to top */
          .bs-card > div:first-child {
            padding: 0 !important;
          }

          /* Image fills full width, rounded top corners only */
          .bs-image {
            height: 150px !important;
            width: 100% !important;
            object-fit: cover;
            border-radius: 14px 14px 0 0 !important;
          }

          /* Content area */
          .bs-content {
            padding: 7px 10px 10px !important;
          }

          /* Bestseller tag — small green dot + text like Image 2 */
          .bs-tag {
            font-size: 9px !important;
            padding: 2px 5px !important;
            border-radius: 4px !important;
            background: #F3F0ED !important;
          }

          /* Item name */
          .bs-name {
            margin-top: 4px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            line-height: 14px !important;
            color: #1A1A1A;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          /* Price row — price left, ADD right */
          .bs-price-row {
            padding-top: 6px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }

          .bs-price {
            font-size: 13px !important;
            font-weight: 700 !important;
            color: #1A1A1A !important;
          }

          /* ADD button */
          .bs-addbtn {
            font-size: 10px !important;
            font-weight: 600 !important;
            padding: 4px 10px !important;
            border-radius: 6px !important;
            border: 1px solid #d4d4d4 !important;
            background: #fff !important;
            color: #1A1A1A !important;
          }

          /* Qty stepper */
          .bs-price-row div {
            display: flex !important;
            align-items: center !important;
            height: 24px !important;
            border-radius: 20px !important;
            border: 1px solid #e5e5e5 !important;
            background: #fff !important;
          }

          .bs-qtybtn {
            padding: 2px 7px !important;
          }

          .bs-qtytext {
            font-size: 12px !important;
            padding: 0 6px !important;
            font-weight: 600 !important;
          }
        }
      `}</style>

      {/* OUTER WRAPPER */}
      <div
        className="bs-outer"
        style={{
          background: "#F9F6F4",
          width: "100%",
          paddingTop: "8px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* TITLE */}
        <h2
          className="bs-title"
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: "12px",
            marginTop: "0px",
            fontFamily: "Inter, sans-serif",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "3px",
            color: "#1A1A1A",
            background: "#F9F6F4",
          }}
        >
          BESTSELLERS
        </h2>

        {/* SCROLL AREA WRAPPER */}
        <div
          style={{
            position: "relative",
            background: "#F9F6F4",
            paddingLeft: "10px",
          }}
        >
          {/* LEFT ARROW */}
          <button
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={20} color="#4B5563" />
          </button>

          {/* SCROLL TRACK */}
          <div
            ref={scrollRef}
            className="bs-scroll bs-track"
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              background: "#F9F6F4",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingBottom: "12px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {items.map((item) => {
              const cartItem = cartItems.find(
                (ci) => ci.menuItem.id === item.id && !ci.variant,
              );
              const qty = cartItem?.quantity || 0;
              const displayPrice = getDisplayPrice(item);
              const hasVariants = item.variants && item.variants.length > 0;

              return (
                <div
                  key={item.id}
                  className="bs-card"
                  onClick={() => onItemClick(item)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      padding: "8px",
                      background: "#ffffff",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    <img
                      className="bs-image"
                      src={getImage(item.image)}
                      alt={item.name}
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div
                    className="bs-content"
                    style={{
                      padding: "8px 16px 12px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      background: "#ffffff",
                      borderRadius: "0 0 12px 12px",
                    }}
                  >
                    {/* VEG TAG + BESTSELLER BADGE (match MenuItemCard mobile) */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          border: "2px solid #16a34a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          background: "#fff",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "#16a34a",
                          }}
                        />
                      </span>
                      <span
                        className="bs-tag"
                        style={{
                          background: "#F3F0ED",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "#1A1A1A",
                        }}
                      >
                        Bestseller
                      </span>
                    </div>

                    {/* NAME */}
                    <h3
                      className="bs-name"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#1A1A1A",
                        marginTop: "16px",
                        lineHeight: "16.8px",
                      }}
                    >
                      {item.name}
                    </h3>

                    {/* PRICE + BUTTON */}
                    <div
                      className="bs-price-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: "16px",
                      }}
                    >
                      <span
                        className="bs-price"
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#1A1A1A",
                        }}
                      >
                        ₹{displayPrice}
                        {hasVariants && " onwards"}
                      </span>

                      {qty > 0 ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E5E5E5",
                            borderRadius: "9999px",
                            overflow: "hidden",
                            background: "#ffffff",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, undefined, -1);
                            }}
                            className="bs-qtybtn"
                            style={{
                              padding: "4px 12px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className="bs-qtytext"
                            style={{
                              padding: "0 12px",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {qty}
                          </span>
                          <button
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   onQuickAdd(item);
                            // }}
                            onClick={(e) => {
                              e.stopPropagation();

                              const hasVariants =
                                item.variants && item.variants.length > 0;
                              const hasAddons =
                                item.addons && item.addons.length > 0;

                              if (hasVariants || hasAddons) {
                                onItemClick(item); // open modal
                              } else {
                                onQuickAdd(item); // direct add
                              }
                            }}
                            className="bs-qtybtn"
                            style={{
                              padding: "4px 12px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="bs-addbtn"
                          //   onClick={(e) => {
                          //     e.stopPropagation();
                          //     onQuickAdd(item);
                          //   }}
                          onClick={(e) => {
                            e.stopPropagation();

                            const hasVariants =
                              item.variants && item.variants.length > 0;
                            const hasAddons =
                              item.addons && item.addons.length > 0;

                            if (hasVariants || hasAddons) {
                              onItemClick(item);
                            } else {
                              onQuickAdd(item);
                            }
                          }}
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            border: "1px solid #333333",
                            borderRadius: "8px",
                            padding: "8px 20px",
                            background: "#ffffff",
                            color: "#1A1A1A",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                        >
                          ADD +
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT ARROW */}
          <button
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={20} color="#4B5563" />
          </button>
        </div>
      </div>
    </>
  );
};

export default BestsellerStrip;
