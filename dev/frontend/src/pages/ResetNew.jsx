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
      setErr("Missing reset token. Please request a password reset again.");
    }
  }, [token]);

  async function handleSave(e) {
    e?.preventDefault();
    setErr("");
    setMsg("");

    if (!token) return setErr("Missing reset token.");
    if (newPassword.length < 8) return setErr("Password must be at least 8 characters.");
    if (newPassword !== confirm) return setErr("Passwords do not match.");

    setLoading(true);
    try {
      await resetPassword({ resetToken: token, newPassword });
      setMsg("Password updated — redirecting to login...");
      setTimeout(() => nav("/login"), 1200);
    } catch (err) {
      setErr(err?.message || (err?.body && err.body.error) || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ alignItems: "center", paddingTop: 48 }}>
      <div className="card" style={{ width: 420 }}>
        <h2 className="card-title" style={{ textAlign: "center" }}>Set new password</h2>
        <p className="muted" style={{ textAlign: "center", marginBottom: 12 }}>
          Enter a new password for your account.
        </p>

        {err && <div className="error" style={{ marginBottom: 8 }}>{err}</div>}
        {msg && <div className="muted" style={{ marginBottom: 8, color: "#2ecc71" }}>{msg}</div>}

        <form onSubmit={handleSave}>
          <input
            type="password"
            className="input"
            placeholder="New password (min 8 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button className="btn primary" type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Saving..." : "Save new password"}
          </button>
        </form>
      </div>
    </div>
  );
}
