import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getRole, isAuthenticated } from "../utils/auth";

function Marketplace() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const params = {
          page,
          limit,
        };

        if (appliedSearch) {
          params.search = appliedSearch;
        }
        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const res = await axios.get("http://localhost:5000/api/marketplace/products", { params });
        const fetchedProducts = res.data?.products || [];
        const fetchedTotal = Number(res.data?.total || 0);
        const computedTotalPages = Math.max(1, Math.ceil(fetchedTotal / limit));

        if (page > computedTotalPages && fetchedTotal > 0) {
          setPage(computedTotalPages);
          return;
        }

        setProducts(fetchedProducts);
        setTotal(fetchedTotal);
        setTotalPages(computedTotalPages);

        const discoveredCategories = fetchedProducts
          .map((product) => (product?.category || "").trim())
          .filter(Boolean);

        setCategoryOptions((prev) => {
          const merged = new Set([...prev, ...discoveredCategories]);
          if (selectedCategory) {
            merged.add(selectedCategory);
          }
          return Array.from(merged).sort((a, b) => a.localeCompare(b));
        });
      } catch (fetchError) {
        console.error("Failed to fetch products", fetchError);
        setError("Unable to load products right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [appliedSearch, selectedCategory, page, limit]);

  const handleProductClick = (event) => {
    if (!isAuthenticated()) {
      event.preventDefault();
      alert("Please login to view product details.");
      navigate("/login");
      return;
    }

    if (getRole() !== "customer") {
      event.preventDefault();
      alert("Only customers can view product details.");
      navigate("/marketplace");
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setAppliedSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setAppliedSearch("");
    setSelectedCategory("");
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const paginationRange = useMemo(() => {
    if (totalPages <= 1) return [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    const pages = [];
    for (let value = start; value <= end; value += 1) {
      pages.push(value);
    }
    return pages;
  }, [page, totalPages]);

  const startIndex = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = total === 0 ? 0 : Math.min(page * limit, total);

  return (
    <section className="page-shell">
      <header className="hero">
        <div>
          <h1 className="title-xl">Marketplace</h1>
          <p className="text-muted">Explore products from verified creators and brands.</p>
        </div>
      </header>

      <form className="marketplace-controls card" onSubmit={handleSearchSubmit}>
        <div className="marketplace-search">
          <label className="field-label" htmlFor="searchProducts">Search by name</label>
          <input
            id="searchProducts"
            className="input"
            type="text"
            placeholder="Search by product name"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>

        <div className="marketplace-filter">
          <label className="field-label" htmlFor="categoryFilter">Category</label>
          <select
            id="categoryFilter"
            className="select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="marketplace-actions">
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-soft" onClick={handleClearFilters}>Clear</button>
        </div>
      </form>

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

      {!isLoading && !error && (
        <div className="pagination-wrap">
          <p className="text-muted pagination-summary">
            Showing {startIndex}-{endIndex} of {total}
          </p>

          <div className="pagination-controls">
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </button>

            {paginationRange.map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                className={`btn pagination-number ${pageNumber === page ? "active" : ""}`}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-soft"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Marketplace;
