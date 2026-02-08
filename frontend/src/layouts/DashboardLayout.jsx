import { NavLink, Outlet } from "react-router-dom";
import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  //const user = JSON.parse(localStorage.getItem("taxpal_user") || "{}");

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
