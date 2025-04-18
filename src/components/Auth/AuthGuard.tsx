import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { state } = useUser();
  const loc = useLocation();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
