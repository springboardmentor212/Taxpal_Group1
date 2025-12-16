import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash(){
  const navigate = useNavigate();
  useEffect(()=>{
    const t = setTimeout(()=> navigate("/login"), 2300);
    return ()=> clearTimeout(t);
  },[navigate]);

  return (
    <div className="page full-center">
      <div className="card splash-card">
        <div className="logo-wrap">
          <img src="/logo.png" alt="TaxPal Logo" className="logo" />
        </div>
        <h1 className="brand"><span className="brand-accent">Tax</span>Pal</h1>
        <p className="tagline">Freelance Finance, Simplified.</p>
      </div>
    </div>
  );
}
