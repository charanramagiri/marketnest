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
    }
  };

  // RESEND OTP
  const resendOtp = async () => {
    try {
      const res = await resendOtpRequest({
        email
      });

      setMessage(res.data.message);
      setError("");

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP"
      );
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
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input"
          />

          <button type="submit" className="btn btn-primary">
            Verify OTP
          </button>

          <button
            type="button"
            className="btn"
            onClick={resendOtp}
          >
            Resend OTP
          </button>

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "green" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
