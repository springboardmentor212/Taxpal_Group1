// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

/* ---------- Public pages ---------- */
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Forgot from "./pages/Forgot";
import ResetNew from "./pages/ResetNew";

/* ---------- Protected pages ---------- */
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import CategorySettings from "./pages/CategorySettings";
import Logout from "./pages/Logout";
import TaxCalculator from "./pages/TaxCalculator";

/* ---------- Layout ---------- */
import DashboardLayout from "./layouts/DashboardLayout";

/* =========================
   Auth Guard
========================= */
function ProtectedRoute() {
  const token = localStorage.getItem("taxpal_token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* =====================
         PUBLIC ROUTES
      ===================== */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset-new" element={<ResetNew />} />

      {/* =====================
         PROTECTED ROUTES
      ===================== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/tax" element={<TaxCalculator />} />

          {/* SETTINGS (NESTED) */}
          <Route path="/settings" element={<Settings />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="categories" element={<CategorySettings />} />
          </Route>

          <Route path="/logout" element={<Logout />} />
        </Route>
      </Route>

      {/* =====================
         FALLBACK
      ===================== */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
