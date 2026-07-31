import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  allowedInstitutionTypes?: string[];
  institutionTypeBypassRoles?: string[];
}

const ProtectedRoute = ({
  allowedRoles,
  allowedInstitutionTypes,
  institutionTypeBypassRoles = [],
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, role, institutionType } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.some((r) => role.includes(r))
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location }}
      />
    );
  }

  const canBypassInstitutionType = institutionTypeBypassRoles.some((allowedRole) =>
    role.includes(allowedRole),
  );

  if (
    allowedInstitutionTypes &&
    !canBypassInstitutionType &&
    (!institutionType || !allowedInstitutionTypes.includes(institutionType))
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
