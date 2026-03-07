import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { getToken, getRole } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalProducts: 0,
    published: 0,
    archived: 0,
  });
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [isArchivingById, setIsArchivingById] = useState({});

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
    const res = await axios.get("http://localhost:5000/api/products/dashboard", getAuthHeaders());
    setData(res.data || { totalProducts: 0, published: 0, archived: 0 });
  }, [getAuthHeaders]);

  const fetchMyProducts = useCallback(async () => {
    setIsProductsLoading(true);
    setProductsError("");

    try {
      const res = await axios.get("http://localhost:5000/api/products/my", getAuthHeaders());
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching brand products", error);
      setProductsError("Unable to load your products right now.");
      setProducts([]);
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
      setIsArchivingById((prev) => ({ ...prev, [productId]: true }));
      await axios.delete(`http://localhost:5000/api/products/${productId}`, getAuthHeaders());
      await Promise.all([fetchDashboard(), fetchMyProducts()]);
    } catch (error) {
      console.error("Error archiving product", error);
      setProductsError(error.response?.data?.message || "Failed to archive product.");
    } finally {
      setIsArchivingById((prev) => ({ ...prev, [productId]: false }));
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
          <h2>My Products</h2>
          <p className="text-muted">Edit product details or archive products you no longer want listed.</p>
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

        {!isProductsLoading && !productsError && products.length === 0 && (
          <div className="card state-card">
            <p className="text-muted">You have no active products yet.</p>
          </div>
        )}

        {!isProductsLoading && !productsError && products.length > 0 && (
          <div className="brand-products-grid">
            {products.map((product) => (
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
                        disabled={Boolean(isArchivingById[product._id])}
                      >
                        {isArchivingById[product._id] ? "Archiving..." : "Archive"}
                      </button>
                    </>
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
