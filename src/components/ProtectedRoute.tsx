import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useContext(UserContext);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />
    return <>{children}</>
}

export default ProtectedRoute;