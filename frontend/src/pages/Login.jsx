import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import API from "../api/api";
import { googleLogin, login as loginRequest } from "../api/auth.api";
import { getRoleFromToken, setAuth } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await loginRequest({
        email,
        password
      });

      const token = res.data?.accessToken;
      const role = getRoleFromToken(token);

      if (!token || !role) {
        setError("Login failed: Invalid authentication response.");
        return;
      }

      setAuth({ token, role });
      navigate("/marketplace");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin({
        credential: credentialResponse.credential
      });
  
      console.log("Backend Response:", res.data);
  
      // Existing Google user
      if (!res.data.isNewUser) {
        setAuth({
          token: res.data.accessToken,
          role: getRoleFromToken(res.data.accessToken)
        });
  
        navigate("/marketplace");
        return;
      }
  
      // New Google user
      navigate("/select-role", {
        state: {
          email: res.data.email,
          name: res.data.name,
          picture: res.data.picture,
          googleId: res.data.googleId
        }
      });
    } catch (err) {
      console.error(err);
      setError("Google Login Failed");
    }
  };

  return (
    <section className="auth-shell">
      <div className="card auth-card">
        <aside className="auth-aside">
          <h1 className="title-xl">Welcome Back</h1>
          <p>
            Sign in to manage products, monitor dashboard metrics,
            and publish updates.
          </p>
        </aside>

        <div className="auth-main">
          <h2>Login</h2>

          <div className="form-stack">
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>

              <input
                id="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                className="field-label"
                htmlFor="password"
              >
                Password
              </label>

              <input
                id="password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <p className="text-muted">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </p>

            <button
              type="button"
              onClick={login}
              className="btn btn-primary"
            >
              Login
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "20px 0"
              }}
            >
              <hr style={{ flex: 1 }} />
              <span style={{ margin: "0 12px" }}>OR</span>
              <hr style={{ flex: 1 }} />
            </div>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log("Google Login Failed");
                alert("Google Login Failed");
              }}
            />

            {error && (
              <p className="error-text">{error}</p>
            )}

            <p className="text-muted">
              New to MarketNest?{" "}
              <Link to="/signup">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}