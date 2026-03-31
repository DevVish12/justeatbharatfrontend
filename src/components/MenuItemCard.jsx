import { useCart } from "@/context/CartContext";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { getImage } from "@/lib/imageMap";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const getDisplayPrice = (item) => {
  if (item?.variants && item.variants.length > 0) {
    const prices = item.variants
      .map((v) => Number(v?.price))
      .filter((n) => Number.isFinite(n));

    if (prices.length > 0) return Math.min(...prices);
  }
  return item?.price;
};

const ClosedMessage = () => (
  <div className="w-full text-center text-[11px] font-semibold text-red-600 bg-white/90 rounded-md py-1 border border-gray-200">
    Restaurant is currently closed
  </div>
);

const MenuItemCard = ({ item, onItemClick, onQuickAdd }) => {
  const { storeOpen } = useStoreStatus();
  const { items, updateQuantity } = useCart();
  const [expanded, setExpanded] = useState(false);

  const hasVariants = item.variants && item.variants.length > 0;
  const displayPrice = getDisplayPrice(item);
  const savings = item.originalPrice ? item.originalPrice - displayPrice : 0;

  const cartItem = items.find((ci) => ci.menuItem.id === item.id);
  const totalQty = items
    .filter((ci) => ci.menuItem.id === item.id)
    .reduce((sum, ci) => sum + ci.quantity, 0);
  const qty = totalQty;

  const handleAdd = () => {
    const hasAddons = item.addons && item.addons.length > 0;
    if (hasVariants || hasAddons) {
      onItemClick(item);
    } else {
      onQuickAdd(item);
    }
  };

  return (
    <>
      {/* ───────────────────────────────────────────
          MOBILE VIEW
      _______________________________________________ */}
      <div className="block sm:hidden mb-[-12px]">
        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex flex-row items-stretch cursor-pointer overflow-hidden min-h-[115px]"
          onClick={() => onItemClick(item)}
        >
          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-[5px] pl-3 pt-3 pr-2 pb-3">
            {/* Bestseller badge */}
            {item.isBestseller && (
              <div className="flex items-center gap-1">
                <span className="w-[13px] h-[13px] rounded-full border-[2px] border-green-600 flex items-center justify-center flex-shrink-0">
                  <span className="w-[5px] h-[5px] rounded-full bg-green-600" />
                </span>
                <span
                  className="text-[11px] font-semibold leading-none px-2 py-0.5 rounded-md"
                  style={{
                    background: "#F3F0ED",
                    color: "#111",
                    border: "1.5px solid #ECE7E2",
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  Bestseller
                </span>
              </div>
            )}

            {/* Item name */}
            <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
              {item.name}
            </h3>

            {/* Price row */}
            <div className="flex items-center gap-2 flex-wrap">
              {item.originalPrice && (
                <span className="text-[13px] text-gray-400 line-through">
                  ₹{item.originalPrice}
                </span>
              )}
              <span className="text-[15px] font-bold text-gray-900">
                ₹{displayPrice}
                {hasVariants && " onwards"}
              </span>
              {savings > 0 && (
                <span className="text-[11px] font-bold text-white bg-orange-500 px-[6px] py-[2px] rounded-md">
                  Save ₹{savings}
                </span>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-[12px] text-gray-500 leading-snug line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-[145px] flex-shrink-0 self-stretch rounded-r-2xl overflow-hidden">
            <img
              src={getImage(item.image)}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* ADD + Customisable pinned */}
            <div
              className="absolute bottom-0 left-6 right-0 px-2 pb-2 w-[70%] flex flex-col items-center gap-[3px]"
              onClick={(e) => e.stopPropagation()}
            >
              {!storeOpen ? <ClosedMessage /> : null}

              {qty > 0 ? (
                <div className="flex items-center justify-between border border-gray-200 rounded-lg bg-white shadow-sm w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cartItem) {
                        updateQuantity(
                          cartItem.menuItem.id,
                          cartItem.variant?.name,
                          -1,
                        );
                      }
                    }}
                    className="px-2 py-[5px]"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-[13px] font-semibold text-gray-800 min-w-[18px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!storeOpen) return;
                      if (cartItem) {
                        updateQuantity(
                          cartItem.menuItem.id,
                          cartItem.variant?.name,
                          1,
                        );
                      }
                    }}
                    disabled={!storeOpen}
                    className={`px-2 py-[5px] ${
                      storeOpen ? "" : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!storeOpen) return;
                    handleAdd();
                  }}
                  disabled={!storeOpen}
                  className={`w-full flex items-center justify-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-[5px] text-[13px] font-semibold text-gray-800 shadow-sm ${
                    storeOpen ? "" : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  ADD <Plus size={12} />
                </button>
              )}
            </div>

            {/* NEW badge */}
            {item.isNew && (
              <span className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────
          DESKTOP / TABLET VIEW
      _______________________________________________ */}
      <div className="hidden sm:block">
        <div
          className="bg-[#FFFFFF] rounded-[18px] border border-[#f0f0f0] p-[12px] sm:p-[14px] md:p-[16px] flex justify-between gap-[12px] sm:gap-[14px] md:gap-[18px] cursor-pointer transition-all duration-200 shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
          style={{ fontFamily: "Inter, sans-serif" }}
          onClick={() => onItemClick(item)}
        >
          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0 flex flex-col">
            {item.isBestseller && (
              <div className="flex items-center gap-1 mb-[4px] sm:mb-[5px] md:mb-[6px]">
                <span className="w-[13px] h-[13px] rounded-full border-[2px] border-green-600 flex items-center justify-center flex-shrink-0 bg-white">
                  <span className="w-[5px] h-[5px] rounded-full bg-green-600" />
                </span>
                <span
                  className="text-[11px] font-semibold leading-none px-2 py-0.5 rounded-md "
                  style={{
                    background: "#F3F0ED",
                    color: "#111",
                    border: "1.5px solid #ECE7E2",
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  Bestseller
                </span>
              </div>
            )}

            <h3 className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-[#1f1f1f] leading-tight line-clamp-2 mb-[3px] sm:mb-[4px] md:mb-[4px]">
              {item.name}
            </h3>

            <div className="flex items-center gap-[6px] sm:gap-[7px] md:gap-[8px] mb-[4px] sm:mb-[5px] md:mb-[6px]">
              {item.originalPrice && (
                <span className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-400 line-through">
                  ₹{item.originalPrice}
                </span>
              )}
              <span className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#1f1f1f]">
                ₹{displayPrice}
                {hasVariants && " onwards"}
              </span>
              {savings > 0 && (
                <span className="text-[11px] sm:text-[11.5px] md:text-[12px] font-semibold text-white bg-[#22c55e] px-[5px] sm:px-[5.5px] md:px-[6px] py-[1px] sm:py-[1.5px] md:py-[2px] rounded">
                  Save ₹{savings}
                </span>
              )}
            </div>

            {item.description && (
              <div>
                <p
                  className={`text-[11px] sm:text-[12px] md:text-[13px] text-gray-500 leading-snug ${
                    expanded ? "" : "line-clamp-2"
                  }`}
                >
                  {item.description}
                </p>
                {item.description.length > 80 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(!expanded);
                    }}
                    className="text-[11px] sm:text-[12px] md:text-[13px] font-medium text-[#ff6b00] mt-[2px]"
                  >
                    {expanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative w-[130px] h-[130px] sm:w-[132px] sm:h-[132px] md:w-[140px] md:h-[140px]">
              <img
                src={getImage(item.image)}
                alt={item.name}
                className="w-full h-full object-cover rounded-[18px]"
                loading="lazy"
              />

              {item.isNew && (
                <span className="absolute top-[6px] right-[6px] sm:top-[7px] sm:right-[7px] md:top-[8px] md:right-[8px] bg-[#ff6b00] text-white text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold px-[5px] sm:px-[5.5px] md:px-[6px] py-[1px] sm:py-[1.5px] md:py-[2px] rounded">
                  NEW
                </span>
              )}

              <div
                className="absolute bottom-[-12px] sm:bottom-[-14px] md:bottom-[-16px] left-1/2 -translate-x-1/2"
                onClick={(e) => e.stopPropagation()}
              >
                {!storeOpen ? <ClosedMessage /> : null}

                {qty > 0 ? (
                  <div className="flex items-center bg-white border border-[#d1d5db] rounded-[8px] sm:rounded-[9px] md:rounded-[10px] overflow-hidden shadow-md">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (cartItem) {
                          updateQuantity(
                            cartItem.menuItem.id,
                            cartItem.variant?.name,
                            -1,
                          );
                        }
                      }}
                      className="px-[8px] sm:px-[9px] md:px-[10px] py-[4px] sm:py-[5px] md:py-[6px]"
                    >
                      <Minus size={12} className="sm:w-[13px] md:w-[14px]" />
                    </button>
                    <span className="px-[8px] sm:px-[9px] md:px-[10px] text-[12px] sm:text-[13px] md:text-[14px] font-medium">
                      {qty}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!storeOpen) return;
                        if (cartItem) {
                          updateQuantity(
                            cartItem.menuItem.id,
                            cartItem.variant?.name,
                            1,
                          );
                        }
                      }}
                      disabled={!storeOpen}
                      className={`px-[8px] sm:px-[9px] md:px-[10px] py-[4px] sm:py-[5px] md:py-[6px] ${
                        storeOpen ? "" : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <Plus size={12} className="sm:w-[13px] md:w-[14px]" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!storeOpen) return;
                      handleAdd();
                    }}
                    disabled={!storeOpen}
                    className={`bg-white border border-[#333333] rounded-[8px] sm:rounded-[9px] md:rounded-[10px] px-[16px] sm:px-[18px] md:px-[20px] py-[6px] sm:py-[7px] md:py-[8px] text-[12px] sm:text-[13px] md:text-[14px] font-medium text-[#1f1f1f] shadow-md hover:bg-gray-50 flex items-center gap-[3px] sm:gap-[3.5px] md:gap-[4px] ${
                      storeOpen ? "" : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    ADD <Plus size={12} className="sm:w-[13px] md:w-[14px]" />
                  </button>
                )}
              </div>
            </div>

            {hasVariants && (
              <p className="text-[11px] sm:text-[11.5px] md:text-[12px] text-gray-500 mt-[12px] sm:mt-[14px] md:mt-[18px]">
                Customisable
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuItemCard;
