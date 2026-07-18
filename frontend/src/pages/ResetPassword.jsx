import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword as resetPasswordRequest } from "../api/auth.api";
import { validateResetPassword } from "../utils/validation";

export default function ResetPassword() {

  const navigate = useNavigate();

  const email =
    localStorage.getItem("resetEmail") || "";
  const resetToken =
    localStorage.getItem("resetToken") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {

    if (!email || !resetToken) {
      navigate("/forgot-password");
    }

  }, [email, resetToken, navigate]);

  const resetPassword = async () => {

    const validationError =
      validateResetPassword(password, confirmPassword);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await resetPasswordRequest({ email, password, resetToken });

      localStorage.removeItem(
        "resetEmail"
      );
      localStorage.removeItem(
        "resetToken"
      );

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Password reset failed"
      );
    } finally {
      setIsSubmitting(false);
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
            autoComplete="new-password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <input
            className="input"
            type="password"
            autoComplete="new-password"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>

          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}

        </div>

      </div>
    </section>
  );
}
