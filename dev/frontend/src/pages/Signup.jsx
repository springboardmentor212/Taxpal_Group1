// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestOtp, signupVerify } from "../lib/api";

export default function Signup() {
  const nav = useNavigate();

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    country: "",
    incomeBracket: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [stage, setStage] = useState(0); // 0 = form, 1 = OTP verify
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  // Auto-enable resend after 20 seconds
  useEffect(() => {
    if (resendDisabled) {
      const timer = setTimeout(() => setResendDisabled(false), 20000);
      return () => clearTimeout(timer);
    }
  }, [resendDisabled]);

  function change(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // -------------------------------------------
  //  Step 1 — Request OTP
  // -------------------------------------------
  async function handleRequestOtp(e) {
    e.preventDefault();
    setErr("");
    setOtpMessage("");

    const email = form.email.trim().toLowerCase();
    if (!email.includes("@")) return setErr("Enter a valid email address.");
    if (!form.username.trim()) return setErr("Enter a username.");
    if (!form.password.trim()) return setErr("Enter a password.");

    setLoading(true);
    try {
      await requestOtp({ email });
      setStage(1);
      setOtpMessage("OTP sent — check your email.");
      setResendDisabled(true);
      setResendCount((c) => c + 1);
    } catch (e) {
      setErr(e.body?.error || e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------
  //  Step 2 — Verify OTP + Create Account
  // -------------------------------------------
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setErr("");

    const cleanOtp = otp.replace(/\D/g, "").trim();
    if (!cleanOtp || cleanOtp.length < 6)
      return setErr("Enter a valid 6-digit OTP.");

    setLoading(true);

    try {
      await signupVerify({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        fullName: form.fullName,
        country: form.country,
        incomeBracket: form.incomeBracket,
        otp: cleanOtp,
      });

      nav("/login");
    } catch (e) {
      setErr(e.body?.error || e.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------
  //  Resend OTP
  // -------------------------------------------
  async function handleResend() {
    if (resendDisabled) return;

    const email = form.email.trim().toLowerCase();
    if (!email) return;

    setLoading(true);
    setErr("");
    setOtpMessage("");

    try {
      await requestOtp({ email });
      setOtpMessage("OTP resent — check your email.");
      setResendDisabled(true);
      setResendCount((c) => c + 1);
    } catch (e) {
      setErr(e.body?.error || e.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  function backToForm() {
    setStage(0);
    setOtp("");
    setOtpMessage("");
    setErr("");
  }

  return (
    <div className="page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div className="card" style={{ maxWidth: 620 }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle at 40% 30%, rgba(255,80,80,0.06), transparent 30%)",
            }}
          >
            <img src="/logo.png" alt="logo" style={{ width: 68, height: 68 }} />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* STEP 0 — FORM ENTRY */}
        {/* -------------------------------- */}
        {stage === 0 ? (
          <>
            <h2 className="card-title" style={{ textAlign: "center", marginBottom: 8 }}>
              CREATE ACCOUNT
            </h2>
            <p className="muted" style={{ textAlign: "center", marginBottom: 18 }}>
              Enter your information to create your TaxPal account
            </p>

            <form onSubmit={handleRequestOtp}>
              <input name="username" value={form.username} onChange={change} className="input" placeholder="Choose a username" />
              <input name="password" type="password" value={form.password} onChange={change} className="input" placeholder="Choose a password" />
              <input name="fullName" value={form.fullName} onChange={change} className="input" placeholder="Full name (optional)" />
              <input name="email" type="email" value={form.email} onChange={change} className="input" placeholder="Enter your email" />

              <select name="country" value={form.country} onChange={change} className="input select-custom">
                <option value="">Select your country</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Other</option>
              </select>

              <select name="incomeBracket" value={form.incomeBracket} onChange={change} className="input select-custom">
                <option value="">Income Bracket (optional)</option>
                <option>Low</option>
                <option>Middle</option>
                <option>High</option>
              </select>

              {err && <div className="error">{err}</div>}

              <button className="btn primary" type="submit" disabled={loading} style={{ marginTop: 12 }}>
                {loading ? "Sending OTP..." : "Create Account (verify email)"}
              </button>
            </form>

            <p className="muted" style={{ textAlign: "center", marginTop: 18 }}>
              Already have an account? <Link to="/login" className="link-inline">Sign in</Link>
            </p>
          </>
        ) : (
          /* -------------------------------- */
          /* STEP 1 — OTP VERIFY */
          /* -------------------------------- */
          <>
            <h2 className="card-title" style={{ textAlign: "center" }}>
              Verify your email
            </h2>
            <p className="muted" style={{ textAlign: "center" }}>{otpMessage || "Enter the 6-digit OTP sent to your email."}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              <input value={form.email} readOnly className="input" />

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input otp-input"
                placeholder="Enter OTP"
                maxLength={6}
              />

              {err && <div className="error">{err}</div>}

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn primary" onClick={handleVerifyOtp} disabled={loading} style={{ flex: 1 }}>
                  {loading ? "Verifying..." : "Validate OTP & Create"}
                </button>

                <button
                  className="btn"
                  onClick={handleResend}
                  disabled={resendDisabled || loading}
                  style={{ flex: 1, background: "#222", color: "#fff" }}
                >
                  {resendDisabled ? "Wait…" : "Resend OTP"}
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <button className="btn" onClick={backToForm} style={{ background: "transparent", color: "#bbb" }}>
                  Back to edit
                </button>
                <div className="muted">Resent: {resendCount}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
