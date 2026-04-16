import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Loginpop/Login.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import AccountDashboard from "./Account/AccountDashboard.jsx";
import "./App.css";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // Keep role updated (same logic)
  useEffect(() => {
    const interval = setInterval(() => {
      setRole(localStorage.getItem("role") || "");
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // 🔥 FRONTEND LEVEL FIX FOR INPUT LOCK / FREEZE
  useEffect(() => {
    const makeInteractive = () => {
      document.querySelectorAll("input, textarea, select, button").forEach(el => {
        el.removeAttribute("disabled");
        el.removeAttribute("readonly");
        el.style.pointerEvents = "auto";
        el.style.userSelect = "auto";
        el.style.webkitUserSelect = "auto";
      });
      document.body.style.pointerEvents = "auto";
    };

    // Apply instantly
    makeInteractive();

    // Reapply every time DOM updates
    const observer = new MutationObserver(makeInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div onClick={e => e.stopPropagation()}>  {/* same UI wrapper */}
      <Routes>
        {!role && <Route path="/" element={<Login />} />}
        <Route
          path="/admin/*"
          element={role === "admin" ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/account/*"
          element={role === "account" ? <AccountDashboard /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to={role ? `/${role}/` : "/"} replace />} />
      </Routes>
    </div>
  );
}

export default App;
