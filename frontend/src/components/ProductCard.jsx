import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const BACKEND_ORIGIN = "http://localhost:5000";

function resolveImageUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BACKEND_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}

function ProductCard({ product, to, onClick }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = useMemo(() => {
    const firstImage = Array.isArray(product?.images) ? product.images[0] : "";
    return resolveImageUrl(firstImage);
  }, [product]);

  const Wrapper = to ? Link : "div";
  const wrapperProps = to ? { to } : {};

  return (
    <article className="card product-card">
      <Wrapper
        {...wrapperProps}
        className="clickable-card"
        onClick={onClick}
      >
        <div className="product-media">
          {imageUrl && !imageError ? (
            <img src={imageUrl} alt={product?.name || "Product"} onError={() => setImageError(true)} />
          ) : (
            <div className="media-fallback">No image available</div>
          )}
        </div>

        <div className="product-content">
          <h3 className="product-title">{product?.name || "Untitled Product"}</h3>

          <div className="meta-row">
            {product?.category && <span className="meta-chip">{product.category}</span>}
            {product?.status && <span className="meta-chip">{product.status}</span>}
          </div>

          <span className="price-pill">INR {Number(product?.price || 0).toLocaleString("en-IN")}</span>
        </div>
      </Wrapper>
    </article>
  );
}

export default ProductCard;
