import { X, Phone, Navigation, Clock, Truck } from "lucide-react";
import { useEffect } from "react";

const RestaurantInfoModal = ({ isOpen, onClose }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const orderTypes = ["Delivery", "Pickup", "Dine-in", "In Car"];

  return (
    <>
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-card rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section */}
          <div className="relative p-6 border-b border-border">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-1">
              JustEat Bharat
            </h2>
            <p className="text-sm text-muted-foreground">Zirakpur</p>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Full Address */}
            <div>
              <p className="text-sm text-foreground leading-relaxed">
                Shop No. 123, VIP Road, Near Chandigarh University,
                Zirakpur, Punjab - 140603
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                <Navigation className="w-4 h-4" />
                Direction
              </button>
            </div>

            {/* Order Types */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">
                Available Order Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {orderTypes.map((type) => (
                  <span
                    key={type}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-xs font-semibold"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Outlet Timings */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Outlet Timings
              </h3>
              <p className="text-sm text-foreground">
                11:00 AM to 04:00 AM
              </p>
            </div>

            {/* Delivery Information */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Delivery Information
              </h3>
              <p className="text-sm text-foreground">
                Approx Delivery Time: <span className="font-semibold">45 Mins</span>
              </p>
            </div>

            {/* FSSAI License */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                FSSAI License No: 12345678901234
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantInfoModal;
