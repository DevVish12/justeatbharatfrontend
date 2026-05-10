import { useStoreStatus } from "@/context/StoreStatusContext";
import { useOrderType } from "@/context/OrderTypeContext";
import { MapPin, Clock, ShoppingBag } from "lucide-react";

const AddBar = () => {
  const { storeOpen } = useStoreStatus();
  const { orderType, setOrderType } = useOrderType();

  const badgeText = storeOpen ? "OPEN" : "CLOSED";
  const badgeColor = storeOpen ? "#1BA672" : "#DC2626";
  const orderLabel = orderType === "pickup" ? "Pick Up" : "Take Away";

  return (
    <div className="w-full bg-[#F7F7F7] py-2.5 sm:py-3">
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
        <div className="relative inline-flex flex-shrink-0 ml-2">

          {/* Visible styled pill — pointer-events-none so select handles clicks */}
          <div className="flex items-center gap-[4px] sm:gap-[5px] px-2.5 sm:px-3 py-[6px] sm:py-[7px] rounded-[9px] sm:rounded-[10px] border border-[#E8590C] bg-white whitespace-nowrap pointer-events-none">
            <ShoppingBag className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] text-[#E8590C] flex-shrink-0" />
            <span className="text-[11px] sm:text-[13px] font-semibold text-[#E8590C] leading-none">
              {orderLabel}
            </span>
          </div>

          {/* Invisible native select — backend context untouched */}
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Select order type"
          >
            <option value="dine_in">Take Away</option>
            <option value="pickup">Pick Up</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default AddBar;