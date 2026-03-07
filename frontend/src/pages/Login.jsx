import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { getRoleFromToken, setAuth } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      const token = res.data?.accessToken;
      const role = getRoleFromToken(token);

      if (!token || !role) {
        setError("Login failed: invalid authentication response.");
        return;
      }

      setAuth({ token, role });
      alert("Login success");
      navigate("/marketplace");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-shell">
      <div className="card auth-card">
        <aside className="auth-aside">
          <h1 className="title-xl">Welcome Back</h1>
          <p>Sign in to manage products, monitor dashboard metrics, and publish updates.</p>
        </aside>

        <div className="auth-main">
          <h2>Login</h2>
          <div className="form-stack">
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="button" onClick={login} className="btn btn-primary">
              Login
            </button>

            {error && <p className="error-text">{error}</p>}

            <p className="text-muted">
              New to MarketNest? <Link to="/signup">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
