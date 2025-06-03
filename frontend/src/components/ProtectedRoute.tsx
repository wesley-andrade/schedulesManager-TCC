import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { ROUTES } from "@/config/routes";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
