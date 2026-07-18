import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { archiveProduct, getDashboard, getMyProducts, updateProduct } from "../api/products.api";
import { getRole } from "../utils/auth";

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
  const [confirmAction, setConfirmAction] = useState(null);

  const isBrand = useMemo(() => getRole() === "brand", []);

  const fetchDashboard = useCallback(async () => {
    const res = await getDashboard();
    setData(res.data || { totalProducts: 0, published: 0, archived: 0 });
  }, []);

  const fetchMyProducts = useCallback(async () => {
    setIsProductsLoading(true);
    setProductsError("");

    try {
      const [activeRes, archivedRes] = await Promise.all([
        getMyProducts(),
        getMyProducts({ scope: "archived" }),
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
  }, []);

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
    try {
      setPendingById((prev) => ({ ...prev, [productId]: true }));
      await archiveProduct(productId);
      await Promise.all([fetchDashboard(), fetchMyProducts()]);
    } catch (error) {
      console.error("Error archiving product", error);
      setProductsError(error.response?.data?.message || "Failed to archive product.");
    } finally {
      setPendingById((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRestore = async (productId) => {
    try {
      setPendingById((prev) => ({ ...prev, [productId]: true }));
      await updateProduct(productId, { isArchived: false });
      await Promise.all([fetchDashboard(), fetchMyProducts()]);
    } catch (error) {
      console.error("Error restoring product", error);
      setProductsError(error.response?.data?.message || "Failed to restore product.");
    } finally {
      setPendingById((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const requestProductAction = (type, productId) => {
    setConfirmAction({
      type,
      productId,
      title: type === "archive" ? "Archive Product" : "Restore Product",
      message:
        type === "archive"
          ? "This product will be hidden from the marketplace."
          : "This product will return to your active listings.",
    });
  };

  const confirmProductAction = async () => {
    if (!confirmAction) return;

    const action = confirmAction;
    setConfirmAction(null);

    if (action.type === "archive") {
      await handleArchive(action.productId);
      return;
    }

    await handleRestore(action.productId);
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
          <div className="brand-products-grid" aria-label="Loading your products" aria-busy="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="card product-skeleton" aria-hidden="true">
                <div className="skeleton skeleton-media" />
                <div className="skeleton-content">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isProductsLoading && productsError && (
          <div className="card state-card">
            <p className="error-text" role="alert">{productsError}</p>
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
                        onClick={() => requestProductAction("archive", product._id)}
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
                      onClick={() => requestProductAction("restore", product._id)}
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

      {confirmAction && (
        <div className="modal-backdrop">
          <div className="card confirm-modal">
            <h2>{confirmAction.title}</h2>
            <p className="text-muted">{confirmAction.message}</p>
            <div className="confirm-actions">
              <button type="button" className="btn btn-soft" onClick={() => setConfirmAction(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmProductAction}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
