import { useOrderType } from "@/context/OrderTypeContext";
import { ChevronDown } from "lucide-react";

export default function OrderTypeDropdown({ className = "" }) {
  const { orderType, setOrderType } = useOrderType();
  const label = orderType === "pickup" ? "Pick Up" : "Dine In";

  return (
    <div
      className={`relative inline-block align-middle ${className}`}
      style={{ minWidth: 0 }}
    >
      <button
        type="button"
        className="flex items-center gap-1 px-3 py-1.5 rounded-[12px] border border-[#E9E9EB] bg-white text-[13px] font-medium text-[#222] focus:outline-none focus:ring-2 focus:ring-primary h-[36px] leading-none whitespace-nowrap"
        style={{ minWidth: 0 }}
        onClick={(e) => {
          const select = e.currentTarget.nextSibling;
          if (select) select.focus();
        }}
        tabIndex={-1}
      >
        {label}
        <ChevronDown className="w-3.5 h-3.5 text-[#444] ml-1" />
      </button>
      <select
        value={orderType}
        onChange={(e) => setOrderType(e.target.value)}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Select order type"
      >
        <option value="dine_in">Dine In</option>
        <option value="pickup">Pick Up</option>
      </select>
    </div>
  );
}
