import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_ORIGIN = "http://localhost:5000";

function resolveImageUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BACKEND_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        let productData = null;

        try {
          const detailRes = await axios.get(`http://localhost:5000/api/marketplace/products/${id}`);
          productData = detailRes.data?.product || detailRes.data;
        } catch (detailError) {
          const listRes = await axios.get("http://localhost:5000/api/marketplace/products");
          productData = (listRes.data?.products || []).find((item) => item._id === id) || null;
          if (!productData) {
            throw detailError;
          }
        }

        setProduct(productData);
        setActiveIndex(0);
      } catch (fetchError) {
        console.error("Failed to fetch product details", fetchError);
        setError("Product unavailable right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const images = useMemo(() => {
    if (!Array.isArray(product?.images)) return [];
    return product.images.map((img) => resolveImageUrl(img)).filter(Boolean);
  }, [product]);

  const mainImage = images[activeIndex] || "";

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="card state-card">
          <p className="text-muted">Loading product details...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="page-shell">
        <div className="card state-card">
          <h2>Product Not Available</h2>
          <p className="text-muted">{error || "This product was removed or does not exist."}</p>
          <Link className="btn btn-primary" to="/marketplace">
            Back to Marketplace
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <header className="hero">
        <div>
          <h1 className="title-xl">Product Details</h1>
          <p className="text-muted">Review product information before continuing.</p>
        </div>
      </header>

      <div className="details-layout">
        <div>
          <div className="details-media-main">
            {mainImage ? (
              <img src={mainImage} alt={product.name || "Product"} />
            ) : (
              <div className="media-fallback">No image available</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="thumb-row">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`thumb ${index === activeIndex ? "active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img src={image} alt={`Product thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="card details-panel">
          <h2>{product.name || "Untitled Product"}</h2>
          <p className="details-price">INR {Number(product.price || 0).toLocaleString("en-IN")}</p>

          <div className="meta-row">
            {product.category && <span className="meta-chip">Category: {product.category}</span>}
            {product.status && <span className="meta-chip">Status: {product.status}</span>}
          </div>

          <h3>Description</h3>
          <p className="text-muted">{product.description || "No description provided."}</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="button" className="btn btn-primary">Contact Seller</button>
            <Link className="btn btn-soft" to="/marketplace">
              Back
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ProductDetails;
