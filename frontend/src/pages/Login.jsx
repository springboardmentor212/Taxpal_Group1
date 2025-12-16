import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function change(e) { setForm(s => ({ ...s, [e.target.name]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const json = await login(form);
      // Save token & user for client-side use. In production prefer HttpOnly cookie.
      localStorage.setItem("taxpal_token", json.token);
      localStorage.setItem("taxpal_user", JSON.stringify(json.user));
      nav("/dashboard");
    } catch (er) {
      setErr(er.message || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="page full-center">
      <div className="card" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{
            width: 120, height: 120, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(circle at 40% 30%, rgba(255,80,80,0.06), transparent 30%)"
          }}>
            <img src="/logo.png" alt="TaxPal" style={{ width: 84, height: 84 }} />
          </div>
        </div>

        <h2 className="card-title" style={{ fontSize: 20, marginBottom: 18, textAlign: "center" }}>
          Sign in to your account to continue
        </h2>

        <form onSubmit={submit}>
          <label className="label">
            Username
            <input name="username" value={form.username} onChange={change} className="input" placeholder="Enter your username" />
          </label>

          <label className="label" style={{ marginTop: 10 }}>
            Password
            <input name="password" type="password" value={form.password} onChange={change} className="input" placeholder="Enter your password" />
          </label>

          <div className="forgot-row" style={{ marginTop: 8 }}>
            <Link to="/forgot" className="forgot-link">Forgot password?</Link>
          </div>

          {err && <div className="error">{err}</div>}

          <button className="btn primary" type="submit" style={{ marginTop: 18 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="muted" style={{ textAlign: "center", marginTop: 20 }}>
          Don't have an account? <Link to="/signup" className="link-inline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
