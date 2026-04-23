import React, { useState } from "react";
import "./Navbar.css";
import "../../index.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { Sun, Moon, LogOut } from "lucide-react";
import { assets } from "../../assets/assets.js";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("storage"));
    alert("👋 Logged out successfully!");
    navigate("/");
  };

  const menuItems = [
    { name: "Home", path: "/account/" },
    { name: "Students", path: "/account/students" },
    { name: "Class Fee", path: "/account/classFee" },
    { name: "Fee Reminder", path: "/account/feeReminder" },
      { name: "New", path: "/account/newRecord" },
  ];

  return (
    <nav className={`navbar ${theme === "dark" ? "navbar-dark" : ""}`}>
      <div className="navbar-container">
        {/* 🔹 Left Side (Logo + Title) */}
        <div className="navbar-left">
          <img src={assets.logo} alt="Logo" className="nav-logo" />
          <h2 className="nav-title">Sant Laxman Chataniya Academy</h2>
        </div>

        {/* 🔹 Desktop Menu */}
        <ul className="nav-links">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => handleNavigation(item.path)}
            >
              {item.name}
            </li>
          ))}

          {/* 🌗 Theme Toggle */}
          <li onClick={toggleTheme} className="theme-toggle">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </li>

          {/* 🚪 Logout */}
          <li className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} style={{ marginRight: 6 }} />
            Logout
          </li>
        </ul>

        {/* 🔹 Mobile Menu Toggle */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "×" : "☰"}
        </div>
      </div>

      {/* 🔹 Mobile Dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`mobile-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </button>
          ))}
          <button onClick={toggleTheme} className="mobile-item">
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={handleLogout} className="mobile-item logout-mobile">
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;