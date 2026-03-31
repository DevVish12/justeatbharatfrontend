import burger1 from "@/assets/burger-1.jpg";
import combo1 from "@/assets/combo-1.jpg";
import dessert1 from "@/assets/dessert-1.jpg";
import drink1 from "@/assets/drink-1.jpg";
import garlicbread1 from "@/assets/garlicbread-1.jpg";
import nachos1 from "@/assets/nachos-1.jpg";
import pasta1 from "@/assets/pasta-1.jpg";
import pizza1 from "@/assets/pizza-1.jpg";
import pizza2 from "@/assets/pizza-2.jpg";
import pizza3 from "@/assets/pizza-3.jpg";
import pizza4 from "@/assets/pizza-4.jpg";
import sandwich1 from "@/assets/sandwich-1.jpg";
import shake1 from "@/assets/shake-1.jpg";
import wrap1 from "@/assets/wrap-1.jpg";

const imageMap = {
    "pizza-1": pizza1,
    "pizza-2": pizza2,
    "pizza-3": pizza3,
    "pizza-4": pizza4,
    "burger-1": burger1,
    "sandwich-1": sandwich1,
    "pasta-1": pasta1,
    "nachos-1": nachos1,
    "garlicbread-1": garlicbread1,
    "wrap-1": wrap1,
    "shake-1": shake1,
    "drink-1": drink1,
    "dessert-1": dessert1,
    "combo-1": combo1,
};

export const getImage = (key) => {
    if (!key) return pizza1;

    // If backend provides a real URL/path, use it directly.
    if (typeof key === "string") {
        const trimmed = key.trim();
        if (trimmed.startsWith("/uploads/")) {
            const apiBase = import.meta.env.VITE_API_BASE_URL || "https://justeatbharat.com/api";
            const backendOrigin = String(apiBase).replace(/\/api\/?$/, "");
            return `${backendOrigin}${trimmed}`;
        }
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
            return trimmed;
        }
    }

    return imageMap[key] || pizza1;
};

