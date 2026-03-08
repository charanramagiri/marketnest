import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import ProductCard from "../components/ProductCard";
import { getToken, getRole } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalProducts: 0,
    published: 0,
    archived: 0,
  });
  const [activeProducts, setActiveProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [pendingById, setPendingById] = useState({});

  const isBrand = useMemo(() => getRole() === "brand", []);

  const getAuthHeaders = useCallback(() => {
    const token = getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const fetchDashboard = useCallback(async () => {
    const res = await API.get("/products/dashboard", getAuthHeaders());
    setData(res.data || { totalProducts: 0, published: 0, archived: 0 });
  }, [getAuthHeaders]);

  const fetchMyProducts = useCallback(async () => {
    setIsProductsLoading(true);
    setProductsError("");

    try {
      const [activeRes, archivedRes] = await Promise.all([
        API.get("/products/my", getAuthHeaders()),
        API.get("/products/my?scope=archived", getAuthHeaders()),
      ]);

      setActiveProducts(Array.isArray(activeRes.data) ? activeRes.data : []);
      setArchivedProducts(Array.isArray(archivedRes.data) ? archivedRes.data : []);
    } catch (error) {
      console.error("Error fetching brand products", error);
      setProductsError("Unable to load your products right now.");
      setActiveProducts([]);
      setArchivedProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([fetchDashboard(), fetchMyProducts()]);
      } catch (error) {
        console.error("Error loading dashboard", error);
      }
    };

    fetchAll();
  }, [fetchDashboard, fetchMyProducts]);

  const handleArchive = async (productId) => {
    if (!window.confirm("Archive this product?")) {
      return;
    }

    try {
      setPendingById((prev) => ({ ...prev, [productId]: true }));
      await API.delete(`/products/${productId}`, getAuthHeaders());
      await Promise.all([fetchDashboard(), fetchMyProducts()]);
    } catch (error) {
      console.error("Error archiving product", error);
      setProductsError(error.response?.data?.message || "Failed to archive product.");
    } finally {
      setPendingById((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRestore = async (productId) => {
    if (!window.confirm("Restore this product?")) {
      return;
    }

    try {
      setPendingById((prev) => ({ ...prev, [productId]: true }));
      await API.put(
        `/products/${productId}`,
        { isArchived: false },
        getAuthHeaders()
      );
      await Promise.all([fetchDashboard(), fetchMyProducts()]);
    } catch (error) {
      console.error("Error restoring product", error);
      setProductsError(error.response?.data?.message || "Failed to restore product.");
    } finally {
      setPendingById((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <section className="page-shell">
      <header className="hero">
        <div>
          <h1 className="title-xl">Brand Dashboard</h1>
          <p className="text-muted">Track catalog status and manage your product listings.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link className="btn btn-soft" to="/marketplace">View Marketplace</Link>
          <Link className="btn btn-primary" to="/create-product">Create Product</Link>
        </div>
      </header>

      <div className="dashboard-grid">
        <article className="card stat-card">
          <p className="stat-label">Total Products</p>
          <p className="stat-value">{data.totalProducts}</p>
        </article>

        <article className="card stat-card">
          <p className="stat-label">Published Products</p>
          <p className="stat-value" style={{ color: "#0f766e" }}>{data.published}</p>
        </article>

        <article className="card stat-card">
          <p className="stat-label">Archived Products</p>
          <p className="stat-value" style={{ color: "#b54708" }}>{data.archived}</p>
        </article>
      </div>

      <section className="brand-products-section">
        <div className="brand-products-head">
          <h2>Active Products</h2>
          <p className="text-muted">Edit active listings or archive products you no longer want visible.</p>
        </div>

        {isProductsLoading && (
          <div className="card state-card">
            <p className="text-muted">Loading your products...</p>
          </div>
        )}

        {!isProductsLoading && productsError && (
          <div className="card state-card">
            <p className="error-text">{productsError}</p>
          </div>
        )}

        {!isProductsLoading && !productsError && activeProducts.length === 0 && (
          <div className="card state-card">
            <p className="text-muted">You have no active products yet.</p>
          </div>
        )}

        {!isProductsLoading && !productsError && activeProducts.length > 0 && (
          <div className="brand-products-grid">
            {activeProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                showStatus
                actions={
                  isBrand ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-soft"
                        onClick={() => navigate(`/edit-product/${product._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleArchive(product._id)}
                        disabled={Boolean(pendingById[product._id])}
                      >
                        {pendingById[product._id] ? "Archiving..." : "Archive"}
                      </button>
                    </>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="brand-products-section">
        <div className="brand-products-head">
          <h2>Archived Products</h2>
          <p className="text-muted">Restore products anytime to bring them back to active listings.</p>
        </div>

        {!isProductsLoading && !productsError && archivedProducts.length === 0 && (
          <div className="card state-card">
            <p className="text-muted">No archived products found.</p>
          </div>
        )}

        {!isProductsLoading && !productsError && archivedProducts.length > 0 && (
          <div className="brand-products-grid">
            {archivedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                showStatus
                actions={
                  isBrand ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleRestore(product._id)}
                      disabled={Boolean(pendingById[product._id])}
                    >
                      {pendingById[product._id] ? "Restoring..." : "Restore"}
                    </button>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Dashboard;
