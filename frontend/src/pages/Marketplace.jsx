import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { isAuthenticated } from "../utils/auth";

function Marketplace() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await axios.get("http://localhost:5000/api/marketplace/products");
        setProducts(res.data?.products || []);
      } catch (fetchError) {
        console.error("Failed to fetch products", fetchError);
        setError("Unable to load products right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (event) => {
    if (!isAuthenticated()) {
      event.preventDefault();
      alert("Please login to view product details.");
      navigate("/login");
    }
  };

  return (
    <section className="page-shell">
      <header className="hero">
        <div>
          <h1 className="title-xl">Marketplace</h1>
          <p className="text-muted">Explore products from verified creators and brands.</p>
        </div>
      </header>

      {isLoading && (
        <div className="card state-card">
          <p className="text-muted">Loading products...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="card state-card">
          <p className="error-text">{error}</p>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="card state-card">
          <p className="text-muted">No products found.</p>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              to={product._id ? `/product/${product._id}` : undefined}
              onClick={handleProductClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Marketplace;
