import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("taxpal_user") || "null");

  function logout() {
    localStorage.removeItem("taxpal_token");
    localStorage.removeItem("taxpal_user");
    navigate("/login");
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-[#0b0b0b] border-b border-white/5">
      <span className="text-sm text-gray-300">
        Welcome{" "}
        <strong className="text-white">
          {session?.username ?? "User"}
        </strong>
      </span>

      <button
        onClick={logout}
        className="text-sm text-gray-400 hover:text-white px-3 py-1 rounded-md hover:bg-white/5"
      >
        Logout
      </button>
    </header>
  );
}




/*import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const nav = useNavigate();
  const session = JSON.parse(localStorage.getItem("taxpal_user") || "null");

  function logout() {
    localStorage.removeItem("taxpal_token");
    localStorage.removeItem("taxpal_user");
    nav("/login");
  }

  return (
    <header className="h-14 bg-[#111] border-b border-gray-800 flex items-center justify-between px-6">
      <div className="text-sm text-gray-300">
        Welcome <span className="text-white">{session?.username ?? "User"}</span>
      </div>

      <button
        onClick={logout}
        className="px-3 py-1.5 rounded-md bg-[#222] text-sm text-white border border-gray-800 hover:bg-[#2a2a2a]"
      >
        Logout
      </button>
    </header>
  );
}*/
