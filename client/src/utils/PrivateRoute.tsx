import Loading from "@pages/Loading";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@hooks/useUser";

export const PrivateRoute = ({ acceptedRole }: { acceptedRole: string[] }) => {
  const { user, isAuthenticated, userIsLoaded } = useUser();

  if (!userIsLoaded) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && acceptedRole.includes(user.role)) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};
