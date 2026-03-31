import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const BUTTON_SIZE = 44;
const GAP = 16;

const FloatingButtonStack = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const [showScroll, setShowScroll] = useState(false);
  const isMobile = window.innerWidth < 1024;
  const bottomOffset = isMobile ? 70 : 16;

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: bottomOffset,
        zIndex: 100,
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "flex-end",
        gap: GAP,
      }}
    >
      {/* Cart Button (always visible) */}
      {typeof onCartClick === "function" && (
        <button
          onClick={onCartClick}
          aria-label="Open cart"
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: "50%",
            background: "#232323",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            border: "2px solid #fff",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.2s",
          }}
        >
          <ShoppingCart size={22} color="#fff" />
          {totalItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                minWidth: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                color: "#159947",
                fontWeight: 600,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #e5e5e5",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      )}
      {/* Scroll to Top Button (only visible when scrolled) */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            borderRadius: "50%",
            background: "#232323",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            border: "2px solid #fff",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 15 12 9 18 15" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FloatingButtonStack;
