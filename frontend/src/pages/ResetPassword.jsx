import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ResetPassword() {

  const navigate = useNavigate();

  const email =
    localStorage.getItem("resetEmail") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {

    if (!email) {
      navigate("/forgot-password");
    }

  }, [email, navigate]);

  const validatePassword = () => {

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must contain at least 8 characters, uppercase, lowercase, number and special character";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const resetPassword = async () => {

    const validationError =
      validatePassword();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      await API.post(
        "/auth/reset-password",
        {
          email,
          password
        }
      );

      localStorage.removeItem(
        "resetEmail"
      );

      alert(
        "Password updated successfully"
      );

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Password reset failed"
      );
    }
  };

  return (
    <section className="auth-shell">
      <div className="card auth-card">

        <div className="auth-main">

          <h2>Reset Password</h2>

          <input
            className="input"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <input
            className="input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          <button
            className="btn btn-primary"
            onClick={resetPassword}
          >
            Update Password
          </button>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

        </div>

      </div>
    </section>
  );
}