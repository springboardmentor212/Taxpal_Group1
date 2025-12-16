// src/pages/Forgot.jsx
import React, { useState, useEffect } from "react";
import { requestOtp, verifyOtp } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState(0); // 0 = ask email, 1 = verify OTP
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const [resendDisabled, setResendDisabled] = useState(false);

  const nav = useNavigate();

  // Enable resend after 20 seconds
  useEffect(() => {
    if (resendDisabled) {
      const t = setTimeout(() => setResendDisabled(false), 20_000);
      return () => clearTimeout(t);
    }
  }, [resendDisabled]);

  // -----------------------------
  // STEP 1 → REQUEST OTP
  // -----------------------------
  async function handleRequestOtp(e) {
    e?.preventDefault();
    setErr("");
    setInfo("");

    const em = email.trim().toLowerCase();
    if (!em) return setErr("Enter your email");

    setLoading(true);
    try {
      await requestOtp({ email: em });  // No debugOtp shown in UI
      setStage(1);
      setInfo("OTP sent — check your email.");
      setResendDisabled(true);
    } catch (e) {
      setErr(e?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // STEP 2 → VERIFY OTP
  // -----------------------------
  async function handleVerifyOtp(e) {
    e?.preventDefault();
    setErr("");

    const cleanedOtp = String(otp || "").replace(/\D/g, "").trim();
    if (!cleanedOtp) return setErr("Enter the OTP sent to your email");

    setLoading(true);
    try {
      const res = await verifyOtp({
        email: email.trim().toLowerCase(),
        otp: cleanedOtp,
        purpose: "reset",
      });

      if (res?.resetToken) {
        // Redirect to reset-new page
        nav(`/reset-new?token=${encodeURIComponent(res.resetToken)}`);
      } else {
        setErr("OTP verified but no reset token returned.");
      }
    } catch (e) {
      setErr(e?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // RESEND OTP
  // -----------------------------
  async function handleResend() {
    if (resendDisabled) return;

    setErr("");
    setInfo("");
    setLoading(true);

    try {
      await requestOtp({ email: email.trim().toLowerCase() });
      setInfo("OTP resent — check your email.");
      setResendDisabled(true);
    } catch (e) {
      setErr(e?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // RENDER UI
  // -----------------------------
  return (
    <div className="page" style={{ alignItems: "center", paddingTop: 50 }}>
      <div className="card" style={{ width: 420 }}>
        {stage === 0 ? (
          <>
            <h2 className="card-title" style={{ textAlign: "center" }}>
              Forgot Password
            </h2>

            <form onSubmit={handleRequestOtp}>
              <input
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {err && <div className="error" style={{ marginTop: 10 }}>{err}</div>}
              {info && <div className="muted" style={{ marginTop: 10 }}>{info}</div>}

              <button className="btn primary" type="submit" disabled={loading} style={{ marginTop: 12 }}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="card-title" style={{ textAlign: "center" }}>
              Verify OTP
            </h2>

            <div className="muted" style={{ textAlign: "center" }}>{info}</div>

            <form onSubmit={handleVerifyOtp} style={{ marginTop: 12 }}>
              <input
                className="input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />

              {err && <div className="error" style={{ marginTop: 10 }}>{err}</div>}

              <button className="btn primary" type="submit" disabled={loading} style={{ marginTop: 12 }}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                className="btn"
                type="button"
                disabled={resendDisabled || loading}
                onClick={handleResend}
                style={{
                  marginTop: 10,
                  width: "100%",
                  background: "#222",
                  color: "#fff",
                }}
              >
                {resendDisabled ? "Wait to resend..." : "Resend OTP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
