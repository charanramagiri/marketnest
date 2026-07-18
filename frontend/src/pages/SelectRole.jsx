import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { completeGoogleSignup } from "../api/auth.api";
import { getRoleFromToken, setAuth } from "../utils/auth";

export default function SelectRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleUser = location.state;

  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!googleUser?.email || !googleUser?.googleId) {
      navigate("/login", { replace: true });
    }
  }, [googleUser, navigate]);

  const handleContinue = async () => {
    if (!role) {
      setError("Please select a role to continue.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await completeGoogleSignup({
        email: googleUser.email,
        googleId: googleUser.googleId,
        name: googleUser.name,
        avatar: googleUser.picture,
        role
      });

      const token = res.data?.accessToken;
      const userRole = getRoleFromToken(token);

      if (!token || !userRole) {
        setError("Signup failed: Invalid authentication response.");
        return;
      }

      setAuth({ token, role: userRole });
      navigate("/marketplace", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (!googleUser?.email) {
    return null;
  }

  return (
    <section className="auth-shell">
      <div className="card auth-card">
        <div className="auth-main">
          <h2>Welcome to MarketNest</h2>
          <p className="text-muted">Choose how you&apos;d like to join.</p>

          <div className="form-stack">
            <button
              type="button"
              className={`btn ${role === "customer" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>

            <button
              type="button"
              className={`btn ${role === "brand" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setRole("brand")}
            >
              Brand
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleContinue}
              disabled={loading || !role}
            >
              {loading ? "Continuing..." : "Continue"}
            </button>

            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
