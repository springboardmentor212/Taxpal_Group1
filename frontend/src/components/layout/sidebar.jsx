import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("taxpal_user") || "null");

  const linkClass = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
    transition-colors
    ${
      isActive
        ? "bg-gray-200 text-black"
        : "text-gray-600 hover:bg-gray-100"
    }
  `;

  function logout() {
    localStorage.removeItem("taxpal_token");
    localStorage.removeItem("taxpal_user");
    navigate("/login");
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      
      {/* Logo */}
      <div className="px-6 py-5 text-xl font-bold text-black">
        TaxPal
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/dashboard" className={linkClass}>
          <span>🏠</span>
          Dashboard
        </NavLink>

        <NavLink to="/transactions" className={linkClass}>
          <span>💳</span>
          Transactions
        </NavLink>

        <NavLink to="/budgets" className={linkClass}>
          <span>💰</span>
          Budgets
        </NavLink>

        <NavLink to="/tax-estimator" className={linkClass}>
          <span>📊</span>
          Tax Estimator
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          <span>📄</span>
          Reports
        </NavLink>
      </nav>

      {/* User Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
            {session?.username?.substring(0, 2).toUpperCase() || "AM"}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-black truncate">
              {session?.username || "Alex Morgan"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.email || "alex@example.com"}
            </p>
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <button className="text-gray-500 hover:text-black flex items-center gap-1">
            ⚙️ Settings
          </button>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-black flex items-center gap-1"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-xs text-center text-gray-400">
        © 2025 TaxPal
      </div>
    </aside>
  );
}
