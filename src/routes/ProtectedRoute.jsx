import { Navigate } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useUserAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Checking login...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
