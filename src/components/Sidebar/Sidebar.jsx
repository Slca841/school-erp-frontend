// Sidebar.jsx
import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import "../../index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";
import io from "socket.io-client";
import axios from "axios";
import { API_URLS } from "../../Context/config.js";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { Sun, Moon, LogOut } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [complaintCount, setComplaintCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // keep role reactive
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    const onStorage = () => {
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ Fetch unread complaints (only useful for admin)
  const fetchUnreadCount = async () => {
    if (role !== "admin") return; // skip for non-admin
    try {
      const res = await axios.get(`${API_URLS.NOTIFICATION}/unread/count`);
      setComplaintCount(res.data.count || 0);
    } catch (err) {
      console.error("❌ Error fetching unread complaint count:", err.message);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // connect socket only if base url available and role present
    if (!API_URLS.BASE_URL) return;

    const socket = io(API_URLS.BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    // join with role so server can filter events per role
    socket.emit("join", { role: role || "guest" });

    // admin-only listener
    if (role === "admin") {
      socket.on("new_complaint_admin", () => {
        setComplaintCount((prev) => prev + 1);
      });
    }

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]); // re-run when role changes

  // ✅ Reset count when complaint page opened (admin path)
  useEffect(() => {
    if (location.pathname === "/admin/teacher/complaints") {
      setComplaintCount(0);
    }
  }, [location.pathname]);

  // Role-specific menu items
  const adminMenu = [
    { name: "Home", path: "/admin/" },
    { name: "Teachers", path: "/admin/teachers" },
    { name: "Students", path: "/admin/students" },
    { name: "New Record", path: "/admin/newRecord" },
    { name: "Assign", path: "/admin/assign" },
    { name: "Complaints", path: "/admin/teacher/complaints" },
    { name: "Notice", path: "/admin/notice" },
    { name: "FeeReminder", path: "/admin/feeReminder" },
     { name: "Admin Tools", path: "/admin/adminTools" },
  ];

  // Account role: only fee / students related (view-only)
  const accountMenu = [
    { name: "Home", path: "/account/" },
    { name: "Students (Fees)", path: "/account/students" },
    { name: "Fee Collection", path: "/account/fee-collection" },
    { name: "Fee Reports", path: "/account/fee-reports" },
    { name: "FeeReminder", path: "/account/feeReminder" },

  ];

  // fallback / guest
  const guestMenu = [{ name: "Home", path: "/" }];

  const menuItems = role === "admin" ? adminMenu : role === "account" ? accountMenu : guestMenu;

  const handleNavigation = (path) => {
    // clear complaint count if going to complaints
    if (path === "/admin/teacher/complaints") setComplaintCount(0);
    navigate(path);
    setIsOpen(false);
  };

  // ✅ Logout Function
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    // Clear session
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    // Notify other tabs and update role state
    window.dispatchEvent(new Event("storage"));
    setRole("");

    // Optional: call backend logout if you have token invalidation endpoint
    // axios.post(`${API_URLS.LOGIN}/logout`, { }).catch(()=>{})

    alert("👋 Logged out successfully!");
    navigate("/");
  };

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <div className="sidebar">
          {/* Profile Section */}
          <div className="profile-section">
            <img src={assets.logo} alt="Profile" className="profile-img" />
            <div className="profile-name">Sant Laxman Chataniya Academy</div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Switch theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span style={{ marginLeft: 8 }}>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>

          {/* Menu List */}
          <ul className="menu-list">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`menu-link ${location.pathname === item.path ? "active" : ""}`}
                >
                  <span>{item.name}</span>

                  {/* show complaint badge only for admin menu & complaints item */}
                  {role === "admin" && item.name === "Complaints" && complaintCount > 0 && (
                    <span className="badge">{complaintCount > 99 ? "99+" : complaintCount}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="logout-section" style={{ marginTop: 16 }}>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={18} style={{ marginRight: 8 }} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;