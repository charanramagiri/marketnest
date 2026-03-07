import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState({
    totalProducts: 0,
    published: 0,
    archived: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/products/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <section className="page-shell">
      <header className="hero">
        <div>
          <h1 className="title-xl">Brand Dashboard</h1>
          <p className="text-muted">Track catalog status and monitor publishing progress.</p>
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
    </section>
  );
}

export default Dashboard;
