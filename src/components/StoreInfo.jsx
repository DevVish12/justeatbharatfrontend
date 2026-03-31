import { MapPin } from "lucide-react";
import { useState } from "react";
import RestaurantInfoModal from "./RestaurantInfoModal";

const StoreInfo = () => {
  const [orderType, setOrderType] = useState("dine-in");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground">JustEat Bharat</h2>
            
            {/* Interactive Info Icon */}
            <button
              onClick={() => setModalOpen(true)}
              className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold text-muted-foreground hover:bg-accent hover:border-primary transition-all cursor-pointer"
              aria-label="Restaurant Information"
            >
              i
            </button>
            
            <span className="bg-secondary text-secondary-foreground text-[9px] px-1.5 py-0.5 rounded font-bold">
              OPEN
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" /> Zirakpur
          </div>
        </div>
        <div className="flex bg-card rounded-lg p-0.5 border border-border shadow-sm">
          <button
            onClick={() => setOrderType("dine-in")}
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-md transition-all ${
              orderType === "dine-in" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Dine In
          </button>
          <button
            onClick={() => setOrderType("takeaway")}
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-md transition-all ${
              orderType === "takeaway" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Take Away
          </button>
        </div>
      </div>

      {/* Restaurant Info Modal */}
      <RestaurantInfoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default StoreInfo;
