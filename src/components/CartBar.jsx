import { useCart } from "@/context/CartContext";
import { useStoreStatus } from "@/context/StoreStatusContext";
import { useUserAuth } from "@/context/UserAuthContext";
import { toast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const CartBar = () => {
  const { totalItems, totalPrice } = useCart();
  const { storeOpen } = useStoreStatus();
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (totalItems === 0) return null;
  if (location.pathname === "/cart") return null;
  if (location.pathname.startsWith("/admin")) return null;

  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
  if (normalizedPath !== "/") return null;

  return (
    <div className="fixed bottom-[56px] lg:bottom-4 left-0 right-0 z-40">
      <div className="w-full lg:mx-auto lg:max-w-[1280px] lg:px-4">
        <div className="lg:pl-[296px]">
          <button
            onClick={() => {
              if (!storeOpen) return;

              if (!user) {
                toast({
                  title: "Login required",
                  description: "Please login/register to view your cart.",
                });
                const params = new URLSearchParams();
                params.set("login", "1");
                params.set("redirect", "/cart");
                navigate(`/?${params.toString()}`);
                return;
              }

              navigate("/cart");
            }}
            disabled={!storeOpen}
            className="w-full flex items-center justify-between bg-primary text-primary-foreground px-6 py-4 rounded-2xl disabled:opacity-60"
          >
            <span className="font-bold text-sm">
              ₹{totalPrice.toFixed(2)}{" "}
              <span className="font-normal opacity-80">
                | {totalItems} item{totalItems > 1 ? "s" : ""}
              </span>
            </span>
            <span className="flex items-center gap-2 font-bold text-sm">
              {storeOpen ? (
                <>
                  View Cart <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                "Restaurant is currently closed"
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartBar;
