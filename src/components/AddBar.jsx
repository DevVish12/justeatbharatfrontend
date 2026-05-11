import { useStoreStatus } from "@/context/StoreStatusContext";
import { useOrderType } from "@/context/OrderTypeContext";
import { MapPin, Clock, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AddBar = () => {
  const { storeOpen } = useStoreStatus();
  const { orderType, setOrderType } = useOrderType();
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const badgeText = storeOpen ? "OPEN" : "CLOSED";
  const badgeColor = storeOpen ? "#1BA672" : "#DC2626";
  const orderLabel = orderType === "pickup" ? "Pick Up" : "Dine In";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        setIsOrderMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") setIsOrderMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const orderOptions = [
    { value: "dine_in", label: "Dine In" },
    { value: "pickup", label: "Pick Up" },
  ];

  return (
    <div className="w-full bg-[#F7F7F7] pt-1 pb-2.5 sm:py-3">
      <div className="bg-white rounded-xl border border-[#EFEFEF] shadow-sm px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        {/* ── Left: Name + Meta ── */}
        <div className="flex flex-col gap-[4px] sm:gap-[6px] min-w-0 flex-1">
          {/* Row 1: Name + dot + OPEN/CLOSED */}
          <div className="flex items-center gap-[6px] flex-wrap">
            <span className="text-[13px] sm:text-[15px] font-bold text-[#1A1A1A] leading-none tracking-tight whitespace-nowrap">
              JustEat Bharat
            </span>
            <span className="flex items-center gap-[3px] flex-shrink-0">
              <span
                className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-full flex-shrink-0"
                style={{ backgroundColor: badgeColor }}
              />
              <span
                className="text-[10px] sm:text-[11px] font-semibold leading-none"
                style={{ color: badgeColor }}
              >
                {badgeText}
              </span>
            </span>
          </div>

          {/* Row 2: Location + Clock — wraps naturally on mobile */}
          <div className="flex items-start sm:items-center gap-[8px] sm:gap-[12px] flex-wrap">
            <div className="flex items-center gap-[3px]">
              <MapPin className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] text-[#686B78] flex-shrink-0 mt-[0.5px] sm:mt-0" />
              <span className="text-[10px] sm:text-[12px] text-[#686B78] font-normal leading-tight">
                Zirakpur, Punjab
              </span>
            </div>

            <div className="flex items-center gap-[3px]">
              <Clock className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] text-[#686B78] flex-shrink-0" />
              <span className="text-[10px] sm:text-[12px] text-[#686B78] font-normal leading-tight whitespace-nowrap">
                11 AM – 11 PM
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Take Away / Pick Up dropdown ── */}
        <div
          ref={dropdownRef}
          className="relative inline-flex flex-shrink-0 ml-2 z-30"
        >
          <button
            type="button"
            onClick={() => setIsOrderMenuOpen((prev) => !prev)}
            className="flex items-center gap-[4px] sm:gap-[5px] px-2.5 sm:px-3 py-[6px] sm:py-[7px] rounded-[9px] sm:rounded-[10px] border border-[#E8590C] bg-[#FFF8F2] whitespace-nowrap"
            aria-haspopup="listbox"
            aria-expanded={isOrderMenuOpen}
            aria-label="Select order type"
          >
            <ShoppingBag className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] text-[#E8590C] flex-shrink-0" />
            <span className="text-[11px] sm:text-[13px] font-semibold text-[#E8590C] leading-none">
              {orderLabel}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-[#E8590C] transition-transform ${
                isOrderMenuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {isOrderMenuOpen && (
            <div
              className="absolute top-full right-0 mt-1 w-[140px] bg-white border border-[#F2C4A8] rounded-xl shadow-[0_10px_24px_rgba(232,89,12,0.14)] overflow-hidden"
              role="listbox"
              aria-label="Order type options"
            >
              {orderOptions.map((option) => {
                const active = orderType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setOrderType(option.value);
                      setIsOrderMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[13px] font-semibold transition-colors"
                    style={{
                      background: active ? "#FFF3EA" : "#FFFFFF",
                      color: active ? "#E8590C" : "#3A3A3A",
                      borderBottom:
                        option.value === "dine_in"
                          ? "1px solid #F7E0D2"
                          : "none",
                    }}
                    role="option"
                    aria-selected={active}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBar;
