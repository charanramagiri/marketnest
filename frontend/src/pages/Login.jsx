import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { googleLogin, login as loginRequest } from "../api/auth.api";
import { getRoleFromToken, setAuth } from "../utils/auth";
import { validateEmail } from "../utils/validation";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
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
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsGoogleSubmitting(true);
      setError("");
      const res = await googleLogin({
        credential: credentialResponse.credential
      });

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
          credential: credentialResponse.credential
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setIsGoogleSubmitting(false);
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

          <form className="form-stack" onSubmit={login}>
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>

              <input
                id="email"
                className="input"
                type="email"
                autoComplete="email"
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
                autoComplete="current-password"
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
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isGoogleSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Login"}
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
                setError("Google login failed. Please try again.");
              }}
            />

            {error && (
              <p className="error-text" role="alert">{error}</p>
            )}

            <p className="text-muted">
              New to MarketNest?{" "}
              <Link to="/signup">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
