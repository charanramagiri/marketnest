import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateProduct from "./pages/CreateProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import { getRole, isAuthenticated } from "./utils/auth";

function RequireCustomer({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getRole();
  if (role !== "customer") {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
}

function RequireBrand({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getRole();
  if (role !== "brand") {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/marketplace" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/marketplace" element={<Marketplace />} />
        <Route
          path="/product/:id"
          element={
            <RequireCustomer>
              <ProductDetails />
            </RequireCustomer>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireBrand>
              <Dashboard />
            </RequireBrand>
          }
        />
        <Route
          path="/create-product"
          element={
            <RequireBrand>
              <CreateProduct />
            </RequireBrand>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <RequireBrand>
              <EditProduct />
            </RequireBrand>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
