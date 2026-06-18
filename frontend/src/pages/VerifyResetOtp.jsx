import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyResetOtp } from "../api/auth.api";

export default function VerifyResetOtp() {

  const navigate = useNavigate();

  const email =
    localStorage.getItem("resetEmail") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {

    if (!email) {
      navigate("/forgot-password");
    }

  }, [email, navigate]);

  const verifyOtp = async () => {

    try {

      const res = await verifyResetOtp({ email, otp });

      localStorage.setItem(
        "resetToken",
        res.data?.resetToken || ""
      );
      
      navigate("/reset-password");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "OTP verification failed"
      );
    }
  };

  return (
    <section className="auth-shell">
      <div className="card auth-card">

        <div className="auth-main">

          <h2>Verify OTP</h2>

          <p>
            Enter OTP sent to <strong>{email}</strong>
          </p>

          <input
            className="input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

          <button
            className="btn btn-primary"
            onClick={verifyOtp}
          >
            Verify OTP
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
