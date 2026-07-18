import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth.api";
import { clearAuth, getRole, isAuthenticated } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const role = getRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Local logout still protects the UI if the server session is already gone.
    }

    clearAuth();
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/marketplace" className="brand">
          MarketNest
        </NavLink>

        <button
          type="button"
          className="nav-menu-button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="primary-navigation" className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          {loggedIn ? (
            <>
              <NavLink to="/marketplace" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Marketplace
              </NavLink>

              {role === "brand" && (
                <>
                  <NavLink to="/create-product" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Create Product
                  </NavLink>
                  <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
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
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Login
              </NavLink>
              <NavLink to="/signup" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
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
