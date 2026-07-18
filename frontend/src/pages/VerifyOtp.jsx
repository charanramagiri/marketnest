import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtp as resendOtpRequest, verifyOtp as verifyOtpRequest } from "../api/auth.api";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email =
  location.state?.email ||
  localStorage.getItem("pendingVerificationEmail");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Redirect if no email
  useEffect(() => {
    const storedEmail = localStorage.getItem(
      "pendingVerificationEmail"
    );
  
    const finalEmail =
      location.state?.email || storedEmail;
  
    if (!finalEmail) {
      navigate("/signup", { replace: true });
    }
  }, [location.state?.email, navigate]);

  // VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      setIsVerifying(true);
      setError("");
      const res = await verifyOtpRequest({
        email,
        otp
      });

      setMessage(res.data.message);
      setError("");

      // REMOVE EMAIL AFTER SUCCESS
      localStorage.removeItem("pendingVerificationEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // RESEND OTP
  const resendOtp = async () => {
    try {
      setIsResending(true);
      setError("");
      const res = await resendOtpRequest({
        email
      });

      setMessage(res.data.message);
      setError("");

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h2>Verify OTP</h2>

        <p>We sent an OTP to: {email}</p>

        <form onSubmit={verifyOtp} className="form-stack">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input"
          />

          <button type="submit" className="btn btn-primary" disabled={isVerifying || isResending}>
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            className="btn"
            onClick={resendOtp}
            disabled={isVerifying || isResending}
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>

          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="success-text" role="status">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
