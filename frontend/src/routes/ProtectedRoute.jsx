import { Navigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {

    const {
        isAuthenticated,
        isLoading,
    } = useAuthStore();

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;