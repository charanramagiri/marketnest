import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "15px",
      padding: "15px",
      borderBottom: "1px solid #ccc",
      backgroundColor: "#f5f5f5"
    }}>
      <Link to="/marketplace">Marketplace</Link>
      <Link to="/create-product">Create Product</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </nav>
  );
}

export default Navbar;