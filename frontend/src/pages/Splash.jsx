import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2600); // ⏳ matches animation duration

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <div className="card splash-card">
        <div className="logo-wrap">
          <img src="/logo.png" alt="TaxPal Logo" className="logo" />
        </div>

        <h1 className="brand">
          <span className="brand-accent">Tax</span>Pal
        </h1>

        <p className="tagline">Freelance Finance, Simplified.</p>
      </div>
    </div>
  );
}
