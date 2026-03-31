import React from "react";

const promos = [
  {
    code: "B2G1 FREE",
    title: "Buy 2 Items and Get 1 Free!!!",
    desc: "Buy 2 Items and Get 1 Free on MOV 349: Applicable on : veg pizza/non veg pizza",
  },
  {
    code: "KOREANRICE50",
    title: "Get Flat 50 % off on Paneer Korean Rice and Chicken Korean Rice",
    desc: "Get Flat 50 % off on Paneer Korean Rice and Chicken Korean Rice",
  },
  {
    code: "LP50FR2",
    title: "Get your 2nd pizza at 50% Off",
    desc: "Get your 2nd pizza at 50% Off Valid Only on Regular,Medium and Large Pizza",
  },
  {
    code: "LPN200",
    title: "Get Flat Discount of Rs.200 on Minimum Billing of Rs.999.",
    desc: "Get Flat Discount of Rs.200 on Minimum Billing of Rs.999.",
  },
];

export default function PromoModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-[28px] max-w-[20px] w-full mx-2 shadow-2xl relative">
        <button
          className="absolute top-5 right-6 text-[#888] text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-[22px] font-semibold px-8 pt-7 pb-2">Promos</h2>
        <div className="px-4 pb-6 max-h-[60vh] overflow-y-auto flex flex-col gap-5">
          {promos.map((promo, i) => (
            <div key={i} className="bg-[#fafafa] rounded-[16px] p-5 flex items-center gap-4 shadow-sm border border-[#eee]">
              <div className="flex-1 min-w-0">
                <div className="text-[#159947] font-bold text-[16px] mb-1">{promo.code}</div>
                <div className="font-semibold text-[15px] mb-1">{promo.title}</div>
                <div className="text-[13px] text-[#666]">{promo.desc} <span className="text-[#159947] cursor-pointer">...Read more</span></div>
              </div>
              <button className="text-[#159947] font-semibold border border-[#159947] rounded-[8px] px-4 py-1 text-[14px]">Copy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
