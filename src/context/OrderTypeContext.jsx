import { createContext, useContext, useState } from "react";

const OrderTypeContext = createContext();

export function OrderTypeProvider({ children }) {
  const [orderType, setOrderType] = useState("dine_in");
  return (
    <OrderTypeContext.Provider value={{ orderType, setOrderType }}>
      {children}
    </OrderTypeContext.Provider>
  );
}

export function useOrderType() {
  const ctx = useContext(OrderTypeContext);
  if (!ctx)
    throw new Error("useOrderType must be used within OrderTypeProvider");
  return ctx;
}
