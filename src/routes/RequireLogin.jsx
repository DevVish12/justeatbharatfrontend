import { useUserAuth } from "@/context/UserAuthContext";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireLogin = ({ children, redirectTo }) => {
  const { user, isAuthLoading } = useUserAuth();
  const location = useLocation();
  const didNotifyRef = useRef(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (user) return;
    if (didNotifyRef.current) return;
    didNotifyRef.current = true;
    toast({
      title: "Login required",
      description: "Please login/register to view your cart.",
    });
  }, [isAuthLoading, user]);

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Checking login...
      </div>
    );
  }

  if (user) {
    return children;
  }

  const fallbackRedirect =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : location.pathname + location.search;

  const params = new URLSearchParams();
  params.set("login", "1");
  params.set("redirect", fallbackRedirect);

  return <Navigate to={`/?${params.toString()}`} replace />;
};

export default RequireLogin;
