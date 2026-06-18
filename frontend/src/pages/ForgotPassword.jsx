import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import { validateEmail } from "../utils/validation";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    const validationError = validateEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      await forgotPassword({ email });

      localStorage.setItem(
        "resetEmail",
        email
      );

      navigate("/verify-reset-otp");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to send OTP"
      );
    }
  };

  return (
    <section className="auth-shell">
      <div className="card auth-card">

        <div className="auth-main">

          <h2>Forgot Password</h2>

          <input
            className="input"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            className="btn btn-primary"
            onClick={sendOtp}
          >
            Send OTP
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
