import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("taxpal_user") || "{}");

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        Tax<span>Pal</span>
      </div>

      {/* Navigation */}
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/budgets">Budgets</NavLink>
        <NavLink to="/tax">Tax Estimator</NavLink>
        <NavLink to="/settings/profile">Settings</NavLink>
        
      </nav>

      {/* User Section */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="avatar">
            {user.username?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="user-text">
            <div className="name">{user.username}</div>
            <div className="email">{user.email}</div>
          </div>
        </div>

        <div className="user-actions">
          <NavLink to="/settings/profile" className="link">
            Settings
          </NavLink>

          <NavLink to="/logout" className="link danger">
            Logout
          </NavLink>

          {/*<NavLink to="/tax">
            Tax Calculator
          </NavLink>*/}
        </div>
      </div>
    </aside>
  );
}
