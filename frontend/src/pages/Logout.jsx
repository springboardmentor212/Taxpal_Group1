import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function run() {
      try {
        await logout();
      } catch {}
      localStorage.removeItem("taxpal_token");
      localStorage.removeItem("taxpal_user");
      navigate("/login", { replace: true });
    }

    run();
  }, [navigate]);

  return null;
}
