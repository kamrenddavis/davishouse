import { useContext } from 'react';
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoutes() {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.username && location.pathname !== "/update-profile") {
        return <Navigate to="/update-profile" replace />;
    }

    return <Outlet />;
}