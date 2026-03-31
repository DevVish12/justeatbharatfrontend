import { useStoreStatus } from "@/context/StoreStatusContext";
import { Info, MapPin } from "lucide-react";

const AddBar = () => {
  const { storeOpen } = useStoreStatus();

  const badgeText = storeOpen ? "OPEN" : "CLOSED";
  const badgeColor = storeOpen ? "#1BA672" : "#DC2626";

  return (
    <div
      className="block sm:hidden w-full bg-[#F7F7F7] px-4 pb-4"
      style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}
    >
      <div className="flex flex-col gap-[4px] mt-0" style={{ borderBottom: 0 }}>
        {/* Row 1: Name + Info icon + OPEN/CLOSED badge */}
        <div className="flex items-center gap-[6px]">
          <span className="text-[15px] font-bold text-[#1A1A1A] leading-none tracking-tight">
            JustEat Bharat
          </span>
          <span className="w-[15px] h-[15px] rounded-sm border border-[#DADADA] flex items-center justify-center flex-shrink-0">
            <Info className="w-[9px] h-[9px] text-[#9A9A9A]" />
          </span>
          <span
            className="text-[10px] px-[5px] py-[2px] rounded-[3px] font-semibold leading-none flex-shrink-0"
            style={{ border: `1px solid ${badgeColor}`, color: badgeColor }}
          >
            {badgeText}
          </span>
        </div>
        {/* Row 2: Location */}
        <div className="flex items-center gap-[3px]">
          <MapPin className="w-[10px] h-[10px] text-[#686B78] flex-shrink-0" />
          <span className="text-[11px] text-[#686B78] font-normal leading-none">
            Zirakpur
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddBar;
