import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem("taxpal_token");
    localStorage.removeItem("taxpal_user");
    nav("/login");
  }
  const session = JSON.parse(localStorage.getItem("taxpal_user") || "null");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#070708 0%,#151313 100%)", padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="logo" style={{ width: 48, height: 48 }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 20, color: "#fff" }}><span style={{ color: "#ff3b3b" }}>Tax</span>Pal</h1>
              <div style={{ color: "#9aa3b2", fontSize: 13 }}>Welcome {session?.username ?? "User"}</div>
            </div>
          </div>
          <div>
            <button onClick={logout} style={{ padding: "8px 12px", borderRadius: 8, background: "#222", color: "#fff", border: "1px solid rgba(255,255,255,0.04)" }}>Logout</button>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>Dashboard (placeholder)</h2>
          <p style={{ color: "#9aa3b2" }}>This is a placeholder for your TaxPal dashboard. Replace with graphs and tables.</p>
        </div>
      </div>
    </div>
  );
}
