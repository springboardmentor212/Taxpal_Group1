// src/pages/ResetNew.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../lib/api";

export default function ResetNew() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const nav = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErr("Your reset link is invalid or expired. Please request a new one.");
    }
  }, [token]);

  async function handleSave(e) {
    e?.preventDefault();
    setErr("");
    setMsg("");

    if (!token) return setErr("Missing reset token.");
    if (newPassword.length < 8)
      return setErr("Password must be at least 8 characters long.");
    if (newPassword !== confirm)
      return setErr("Passwords do not match.");

    setLoading(true);
    try {
      await resetPassword({ resetToken: token, newPassword });
      setMsg("Your password has been updated. Redirecting to login...");
      setTimeout(() => nav("/login"), 1200);
    } catch (err) {
      setErr(
        err?.message ||
          (err?.body && err.body.error) ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ alignItems: "center", paddingTop: 48 }}>
      <div className="card" style={{ width: 420 }}>
        <h2 className="card-title" style={{ textAlign: "center" }}>
          Create a new password
        </h2>

        <p className="muted" style={{ textAlign: "center", marginBottom: 14 }}>
          Choose a strong password to secure your TaxPal account.
        </p>

        {err && <div className="error">{err}</div>}
        {msg && (
          <div className="muted" style={{ color: "#2ecc71", marginBottom: 8 }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* New password */}
          <label className="input-label">New password</label>
          <input
            type="password"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {/* Confirm password */}
          <label className="input-label">Confirm new password</label>
          <input
            type="password"
            className="input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: 16 }}
          >
            {loading ? "Updating password…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
