import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await login({
        username: form.username.trim(),
        password: form.password,
      });

      // ✅ Save JWT + user
      localStorage.setItem("taxpal_token", res.token);
      localStorage.setItem("taxpal_user", JSON.stringify(res.user));

      navigate("/dashboard");
    } catch (e) {
      setErr(
        e?.body?.error ||
        e?.message ||
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
    <div className="page">
      <div className="card" style={{ maxWidth: 520 }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "radial-gradient(circle at 40% 30%, rgba(255,80,80,0.08), transparent 40%)",
            }}
          >
            <img
              src="/logo.png"
              alt="TaxPal"
              style={{ width: 84, height: 84 }}
            />
          </div>
        </div>
        

        <h2
          className="card-title"
          style={{ textAlign: "center", marginBottom: 20 }}
        >
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label className="label">
            Username
            <input
              name="username"
              className="input"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          {/* Password */}
          <label className="label" style={{ marginTop: 12 }}>
            Password
            <input
              name="password"
              type="password"
              className="input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {/* Forgot password */}
          <div className="forgot-row" style={{ marginTop: 8 }}>
            <Link to="/forgot" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {err && <div className="error">{err}</div>}

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: 18 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="muted" style={{ textAlign: "center", marginTop: 20 }}>
          Don’t have an account?{" "}
          <Link to="/signup" className="link-inline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}
