import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { API_URLS } from "../../../Context/config.js";
import "./TeacherComplaints.css";

const TeacherComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  // ✅ Normalize backend statuses
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    const s = status.toString().trim().toLowerCase();
    if (["resolved", "viewed", "done", "closed", "complete"].includes(s))
      return "resolved";
    return "pending";
  };

  // ✅ Fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URLS.COMPLAINT}/complaints`);
      const list = (res.data?.complaints || []).map((c) => ({
        ...c,
        status: normalizeStatus(c.status),
      })).reverse();
      setComplaints(list);
    } catch (err) {
      console.error("❌ Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

const deleteAllComplaints = async () => {
  if (!window.confirm("Are you sure? This will delete ALL complaints.")) return;

  try {
    await axios.delete(`${API_URLS.COMPLAINT}/complaints`);

    // Clear UI instantly → no refresh needed
    setComplaints([]);  
    setActiveTab("pending"); // auto switch to empty tab

  } catch (err) {
    console.error("❌ Error deleting all complaints:", err);
  }
};



  // ✅ Fetch once & setup socket
  useEffect(() => {
    fetchComplaints();
    const socket = io(API_URLS.BASE_URL, { transports: ["websocket"] });
    socket.emit("join", { role: "admin" });

    socket.on("new_complaint_admin", (data) => {
      const normalized = { ...data, status: normalizeStatus(data.status) };
      setComplaints((prev) => [normalized, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  // ✅ Change complaint status
  const changeStatus = async (id, currentStatus) => {
    const newStatus =
      normalizeStatus(currentStatus) === "resolved" ? "pending" : "resolved";

    try {
      await axios.put(`${API_URLS.COMPLAINT}/complaints/${id}`, {
        status: newStatus,
      });

      // instant UI update
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );

      if (newStatus === "resolved") setActiveTab("resolved");
    } catch (err) {
      console.error("❌ Error updating complaint:", err);
    }
  };

  // ✅ Filter by active tab
  const filteredComplaints = complaints.filter(
    (c) => normalizeStatus(c.status) === activeTab
  );

  return (
    <div className="complaints-container">
  <h2 style={{textAlign:"center"}}>Teacher Complaints</h2>
   <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>

  <button
    onClick={deleteAllComplaints}
    style={{
      background: "#9a7878ff",
      color: "white",
      padding: "8px 15px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    🗑 Delete All Complaints
  </button>
</div>


      {/* ✅ Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          🆕 New Complaints (
          {
            complaints.filter(
              (c) => normalizeStatus(c.status) === "pending"
            ).length
          }
          )
        </button>

        <button
          className={`tab-btn ${activeTab === "resolved" ? "active" : ""}`}
          onClick={() => setActiveTab("resolved")}
        >
          👁 Viewed Complaints (
          {
            complaints.filter(
              (c) => normalizeStatus(c.status) === "resolved"
            ).length
          }
          )
        </button>
      </div>

      {/* ✅ Complaints Table */}
      {loading ? (
        <p className="loading-text">Loading complaints...</p>
      ) : filteredComplaints.length > 0 ? (
        <div className="table-wrapper">
          <table className="complaints-table" key={activeTab}>
            <thead>
              <tr>
                <th>#</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Complaint</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody key={activeTab}>
              {filteredComplaints.map((c, i) => (
                <tr key={c._id || i}>
                  <td>{i + 1}</td>
                  <td>{c.studentId?.studentclass || "—"}</td>
                  <td>{c.teacherId?.fullName || "—"}</td>
                  <td className="complaint-text">{c.complaint || "—"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        normalizeStatus(c.status) === "resolved"
                          ? "resolved"
                          : "pending"
                      }`}
                    >
                      {normalizeStatus(c.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${
                        normalizeStatus(c.status) === "resolved"
                          ? "pending-btn"
                          : "resolve-btn"
                      }`}
                      onClick={() => changeStatus(c._id, c.status)}
                    >
                      {normalizeStatus(c.status) === "resolved"
                        ? "Mark Pending"
                        : "Mark Resolved"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">
          ✅ No {activeTab === "pending" ? "new" : "viewed"} complaints found
        </p>
      )}
    </div>
  );
};

export default TeacherComplaints;
