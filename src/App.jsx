import CartBar from "@/components/CartBar";
import GlobalLoader from "@/components/GlobalLoader";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import {
  GlobalLoaderProvider,
  useGlobalLoader,
} from "@/context/GlobalLoaderContext";
import { OrderTypeProvider } from "@/context/OrderTypeContext";
import { StoreStatusProvider } from "@/context/StoreStatusContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import AppRoutes from "./routes/AppRoutes";
import UserRoutes from "./routes/UserRoutes";

const queryClient = new QueryClient();

const GlobalLoaderWrapper = ({ children }) => {
  const { isLoading, message } = useGlobalLoader();
  return (
    <>
      {isLoading && <GlobalLoader message={message} />}
      {children}
    </>
  );
};

const App = () => (
  <OrderTypeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <UserAuthProvider>
            <GlobalLoaderProvider>
              <GlobalLoaderWrapper>
                <StoreStatusProvider>
                  {/* <OffersStrip /> removed */}
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/admin/*" element={<AdminRoutes />} />
                      <Route path="/user/*" element={<UserRoutes />} />
                      <Route path="/*" element={<AppRoutes />} />
                    </Routes>
                    <CartBar />
                  </BrowserRouter>
                </StoreStatusProvider>
              </GlobalLoaderWrapper>
            </GlobalLoaderProvider>
          </UserAuthProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </OrderTypeProvider>
);

export default App;
