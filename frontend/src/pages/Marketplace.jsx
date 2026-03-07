import { useEffect, useState } from "react";
import axios from "axios";

function Marketplace() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/marketplace/products");
        setProducts(res.data.products); // Make sure backend sends { products: [...] }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Marketplace</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {products.length === 0 && <p>No products found.</p>}

        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              width: "200px",
            }}
          >
            {/* Display first image */}
            {product.images && product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
              />
            )}

            <h3 style={{ margin: "10px 0 5px" }}>{product.name}</h3>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;