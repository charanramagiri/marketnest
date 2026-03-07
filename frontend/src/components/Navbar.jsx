import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getRole, isAuthenticated } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const role = getRole();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/marketplace" className="brand">
          MarketNest
        </NavLink>

        <div className="nav-links">
          {loggedIn ? (
            <>
              <NavLink to="/marketplace" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Marketplace
              </NavLink>

              {role === "brand" && (
                <>
                  <NavLink to="/create-product" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Create Product
                  </NavLink>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Dashboard
                  </NavLink>
                </>
              )}

              <button type="button" className="nav-link nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Login
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
