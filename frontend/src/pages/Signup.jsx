import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer"
  });

  const [error, setError] = useState("");

  const validateForm = () => {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!form.name.trim()) {
      return "Name is required";
    }
  
    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email";
    }
  
    if (!passwordRegex.test(form.password)) {
      return "Password must contain at least 8 characters, uppercase, lowercase, number and special character";
    }
  
    if (
      form.password !== form.confirmPassword
    ) {
      return "Passwords do not match";
    }
  
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const signupData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };
      
      await API.post("/auth/signup", signupData);

      localStorage.setItem(
        "pendingVerificationEmail",
        form.email
      );
      
      navigate("/verify-otp", {
        state: {
          email: form.email
        }
      });
    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      setError(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <section className="auth-shell">
      <div className="card auth-card">
        <aside className="auth-aside">
          <h1 className="title-xl">Join MarketNest</h1>
          <p>
            Create your account to explore listings or publish products as a
            brand.
          </p>
        </aside>

        <div className="auth-main">
          <h2>Signup</h2>

          <form onSubmit={handleSubmit} className="form-stack">
            <div>
              <label className="field-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="input"
                placeholder="Create password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <div>
              <label className="field-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                className="input"
                placeholder="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>


            <div>
              <label className="field-label" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                className="select"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="customer">Customer</option>
                <option value="brand">Brand</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Signup
            </button>

            {error && <p className="error-text">{error}</p>}

            <p className="text-muted">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}