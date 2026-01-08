import { NavLink, Outlet } from "react-router-dom";
import "../styles/settings.css";

export default function Settings() {
  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        <NavLink to="profile">Profile</NavLink>
        <NavLink to="categories">Categories</NavLink>
      </aside>

      <main className="settings-main">
        <Outlet />
      </main>
    </div>
  );
}
