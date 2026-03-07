import { useEffect, useState } from "react";
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
    <div style={{ padding: "30px" }}>
      <h1>Brand Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <h3>Total Products: {data.totalProducts}</h3>
        <h3>Published Products: {data.published}</h3>
        <h3>Archived Products: {data.archived}</h3>
      </div>
    </div>
  );
}

export default Dashboard;