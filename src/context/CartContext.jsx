import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
  // ...existing code...
};

const getKey = (itemId, variantName) => `${itemId}-${variantName || "default"}`;

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on mount
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item, variant) => {
    setItems((prev) => {
      const key = getKey(item.id, variant?.name);
      const existing = prev.find(
        (i) => getKey(i.menuItem.id, i.variant?.name) === key,
      );
      if (existing) {
        return prev.map((i) =>
          getKey(i.menuItem.id, i.variant?.name) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { menuItem: item, variant, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId, variantName) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          getKey(i.menuItem.id, i.variant?.name) !==
          getKey(itemId, variantName),
      ),
    );
  }, []);

  const updateQuantity = useCallback((itemId, variantName, delta) => {
    setItems((prev) => {
      const key = getKey(itemId, variantName);
      return prev
        .map((i) => {
          if (getKey(i.menuItem.id, i.variant?.name) === key) {
            const newQty = i.quantity + delta;
            return newQty <= 0 ? null : { ...i, quantity: newQty };
          }
          return i;
        })
        .filter(Boolean);
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + (i.variant?.price || i.menuItem.price) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
