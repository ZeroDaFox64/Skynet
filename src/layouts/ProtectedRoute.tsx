import { Navigate, Outlet } from "react-router";
import { authorizationStore } from "../store/authenticationStore";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute = ({ redirectPath = "/authentication/login" }: ProtectedRouteProps) => {
  const { user } = authorizationStore();
  const isAuthenticated = user !== null;

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;