// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestOtp, signupVerify } from "../lib/api";

export default function Signup() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    country: "",
    incomeBracket: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [stage, setStage] = useState(0); // 0 = form, 1 = OTP
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  // Enable resend after 20s
  useEffect(() => {
    if (resendDisabled) {
      const t = setTimeout(() => setResendDisabled(false), 20000);
      return () => clearTimeout(t);
    }
  }, [resendDisabled]);

  function change(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  // Step 1: Request OTP
  async function handleRequestOtp(e) {
    e.preventDefault();
    setErr("");
    setOtpMessage("");

    const email = form.email.trim().toLowerCase();
    if (!form.username.trim()) return setErr("Username is required.");
    if (!form.password.trim()) return setErr("Password is required.");
    if (!email.includes("@")) return setErr("Please enter a valid email address.");

    setLoading(true);
    try {
      await requestOtp({ email });
      setStage(1);
      setOtpMessage("We’ve sent a verification code to your email.");
      setResendDisabled(true);
      setResendCount((c) => c + 1);
    } catch (e) {
      setErr(e.body?.error || e.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP + Create account
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setErr("");

    const cleanOtp = otp.replace(/\D/g, "");
    if (cleanOtp.length !== 6)
      return setErr("Please enter the 6-digit verification code.");

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
      setErr(e.body?.error || e.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendDisabled) return;
    const email = form.email.trim().toLowerCase();
    if (!email) return;

    setLoading(true);
    setErr("");
    try {
      await requestOtp({ email });
      setOtpMessage("A new verification code has been sent.");
      setResendDisabled(true);
      setResendCount((c) => c + 1);
    } catch (e) {
      setErr(e.body?.error || e.message || "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  function backToForm() {
    setStage(0);
    setOtp("");
    setErr("");
    setOtpMessage("");
  }

  return (
    <div className="page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div className="card" style={{ maxWidth: 620 }}>
        {stage === 0 ? (
          <>
            <h2 className="card-title" style={{ textAlign: "center" }}>
              Create your account
            </h2>

            <p className="muted" style={{ textAlign: "center", marginBottom: 18 }}>
              Enter your details to get started with TaxPal
            </p>

            <form onSubmit={handleRequestOtp}>
              <label className="input-label">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={change}
                className="input"
              />

              <label className="input-label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={change}
                className="input"
              />

              <label className="input-label">Full name (optional)</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={change}
                className="input"
              />

              <label className="input-label">Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                className="input"
              />

              <label className="input-label">Country of residence</label>
              <select
                name="country"
                value={form.country}
                onChange={change}
                className="input select-custom"
              >
                <option value="">Select your country</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Other</option>
              </select>

              <label className="input-label">Income range (optional)</label>
              <select
                name="incomeBracket"
                value={form.incomeBracket}
                onChange={change}
                className="input select-custom"
              >
                <option value="">Select income range</option>
                <option>Low</option>
                <option>Middle</option>
                <option>High</option>
              </select>

              {err && <div className="error">{err}</div>}

              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? "Sending verification code…" : "Verify email & continue"}
              </button>
            </form>

            <p className="muted" style={{ textAlign: "center", marginTop: 18 }}>
              Already registered?{" "}
              <Link to="/login" className="link-inline">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="card-title" style={{ textAlign: "center" }}>
              Verify your email
            </h2>

            <p className="muted" style={{ textAlign: "center" }}>
              {otpMessage || "Enter the 6-digit code sent to your email"}
            </p>

            <label className="input-label">Email</label>
            <input value={form.email} readOnly className="input" />

            <label className="input-label">Verification code</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input otp-input"
              maxLength={6}
            />

            {err && <div className="error">{err}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn primary"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying…" : "Confirm & create account"}
              </button>

              <button
                className="btn"
                onClick={handleResend}
                disabled={resendDisabled || loading}
              >
                {resendDisabled ? "Please wait…" : "Resend code"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <button className="btn" onClick={backToForm}>
                Edit details
              </button>
              <div className="muted">Resent: {resendCount}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
