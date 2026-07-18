import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import VerifyOtp from "../pages/VerifyOtp";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import VerifyResetOtp from "../pages/VerifyResetOtp.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import Marketplace from "../pages/Marketplace.jsx";
import ProductDetails from "../pages/ProductDetails.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import CreateProduct from "../pages/CreateProduct.jsx";
import EditProduct from "../pages/EditProduct.jsx";
import NotFound from "../pages/NotFound.jsx";

// NEW PAGES
import SelectRole from "../pages/SelectRole.jsx";
import CompleteGoogleSignup from "../pages/CompleteGoogleSignup.jsx";

import { getRole, isAuthenticated } from "../utils/auth";

function RequireRole({ role, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (getRole() !== role) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Google Authentication */}
        <Route path="/select-role" element={<SelectRole />} />
        <Route
          path="/complete-google-signup"
          element={<CompleteGoogleSignup />}
        />

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />

        <Route
          path="/product/:id"
          element={
            <RequireRole role="customer">
              <ProductDetails />
            </RequireRole>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireRole role="brand">
              <Dashboard />
            </RequireRole>
          }
        />

        <Route
          path="/create-product"
          element={
            <RequireRole role="brand">
              <CreateProduct />
            </RequireRole>
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <RequireRole role="brand">
              <EditProduct />
            </RequireRole>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
