import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Show loading while checking auth

  return user ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
