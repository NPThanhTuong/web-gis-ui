import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  return isLoggedIn() ? (
    <>
      <Outlet />
      <Toaster />
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
