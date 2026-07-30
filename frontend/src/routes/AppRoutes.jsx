import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import ShopFloorDisplay from "../pages/ShopFloorDisplay/ShopFloorDisplay";
import Entry from "../pages/Entry/Entry";
import Approvals from "../pages/Approvals/Approvals";
import CAPA from "../pages/CAPA/CAPA";
import Trends from "../pages/Trends/Trends";
import Stores from "../pages/Stores/Stores";
import Settings from "../pages/Settings/Settings";
import Signup from "../pages/Signup/Signup";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout/MainLayout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Route */}
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    
                    <Route path="/entry" element={<Entry />} />
                    <Route path="/approvals" element={<Approvals />} />
                    <Route path="/capa" element={<CAPA />} />
                    <Route path="/trends" element={<Trends />} />
                    <Route path="/stores" element={<Stores />} />
                    <Route
                        path="/shop-floor-display"
                        element={<ShopFloorDisplay />}
                    />
                    <Route path="/settings" element={<Settings />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;