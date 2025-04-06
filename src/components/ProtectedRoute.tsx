
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "employee" | null;
}

export default function ProtectedRoute({ children, requiredRole = null }: ProtectedRouteProps) {
  const { isLoggedIn, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate, requiredRole, userRole]);

  if (!isLoggedIn) {
    return null;
  }

  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
