import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { API_URLS } from "../Context/config.js"; // apna path check karo

const socket = io(API_URLS.SOCKET_BASE); 

export default function NotificationBell({ teacherId }) {
  const [counts, setCounts] = useState({ complaints: 0, leaves: 0 });
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  // ✅ Fetch counts
  async function fetchCounts(id) {
    try {
      const res = await axios.get(`${API_URLS.NOTIFICATION}/unread/${id}`);
      setCounts(res.data.counts || {});
    } catch (err) {
      console.error("Error fetching counts:", err.message);
    }
  }

  // ✅ Fetch notification list
  const fetchNotifications = async (id) => {
    try {
      const res = await axios.get(`${API_URLS.NOTIFICATION}/list/${id}`);
      setItems(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err.message);
    }
  };

  // ✅ Toggle open
  const handleOpen = async () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      fetchNotifications(teacherId);
    }
  };

  // ✅ Setup socket
  useEffect(() => {
    if (!teacherId) return;

    fetchCounts(teacherId);
    socket.emit("join_room", `teacher_${teacherId}`);

    socket.on("new_complaint_for_teacher", () => {
      setCounts((prev) => ({ ...prev, complaints: (prev.complaints || 0) + 1 }));
    });
    socket.on("new_leave_for_teacher", () => {
      setCounts((prev) => ({ ...prev, leaves: (prev.leaves || 0) + 1 }));
    });

    return () => {
      socket.off("new_complaint_for_teacher");
      socket.off("new_leave_for_teacher");
      socket.emit("leave_room", `teacher_${teacherId}`);
    };
  }, [teacherId]);

  const total = (counts.complaints || 0) + (counts.leaves || 0);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* 🔔 Bell Button */}
      <button onClick={handleOpen} style={{ position: "relative", fontSize: 20 }}>
        🔔
        {total > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {total}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "36px",
            right: 0,
            width: "320px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            zIndex: 1000,
          }}
        >
          <div style={{ padding: "10px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
            Notifications
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {items.length === 0 ? (
              <div style={{ padding: "12px" }}>No notifications</div>
            ) : (
              items.map((it, idx) => (
                <div
                  key={idx}
                  style={{ padding: "10px", borderBottom: "1px solid #f5f5f5" }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {it.type === "complaint" ? "Complaint" : "Leave"}
                  </div>
                  <div>{it.message || it.complaint || it.topic}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {new Date(it.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
