import React, { useEffect, useState } from "react";
import "./AdminTools.css";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import { assets } from "../../../assets/assets.js";
export default function AdminTools() {
  const [currentQR, setCurrentQR] = useState(null);
  const [newQR, setNewQR] = useState(null);
const [showConfirm, setShowConfirm] = useState(false);
const [confirmText, setConfirmText] = useState("");

  // -----------------------------------
  // Load QR on page load
  // -----------------------------------
  useEffect(() => {
    fetchCurrentQR();
  }, []);

  // -----------------------------------
  // Start New Session
  // -----------------------------------
const startNewSession = async () => {
  if (confirmText !== "DELETE") {
    return alert("Type DELETE to confirm");
  }

  try {
    const res = await axios.delete(`${API_URLS.LOGIN}/startNewSession`);
    alert("🚀 " + res.data.message);

    setShowConfirm(false);
    setConfirmText("");
  } catch (err) {
    alert("❌ Failed to start new session");
  }
};

  // -----------------------------------
  // Fetch Current QR (DB)
  // -----------------------------------
  const fetchCurrentQR = async () => {
    try {
      const res = await axios.get(`${API_URLS.SCHOOL}/qr`);
      setCurrentQR(res.data.qrImage || null);
    } catch (err) {
      alert("❌ Failed to load QR");
    }
  };

  // -----------------------------------
  // Save / Update QR
  // -----------------------------------
  const updateQR = async () => {
    if (!newQR) return alert("Please select QR image");

    try {
      const fd = new FormData();
      fd.append("qr", newQR);

      await axios.put(`${API_URLS.SCHOOL}/qr`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(currentQR ? "✅ QR updated successfully" : "✅ QR added successfully");

      setNewQR(null);
      fetchCurrentQR();
    } catch (err) {
  console.error("qr ERROR 👉", err.response?.data || err.message);
  alert(
    err.response?.data?.message ||
    "❌ Error while sending qr (check console)"
  );
}
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Control Panel</h1>
      <p className="admin-subtitle">Choose an action below</p>

      <div className="admin-grid">
       {/* School Card */}
        <div className="admin-card">
      <div className="admin-card-detail">
            <h3>Sant Laxman Chataniya Academy</h3>
      </div>
      <img src={assets.logo} alt="Profile" className="profileimg" />
        </div>
    
        {/* QR Code Card */}
        <div className="admin-card">
              <div className="admin-card-detail">  
          <h3>School QR Code</h3>
</div>
          {/* ✅ QR DIRECTLY SHOWN IF EXISTS */}
{currentQR ? (
<img src={currentQR} alt="QR" style={{ width: "180px" }} />

) : (
  <p>No QR uploaded yet.</p>
)}



          {/* Upload input (always available) */}
     {/* ✅ Styled Choose File */}
<div className="qr-upload-box">
  <label className="qr-upload-label">
    📁 Choose QR Image
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => setNewQR(e.target.files[0])}
    />
  </label>

  {newQR && (
    <span className="qr-file-name">
      {newQR.name}
    </span>
  )}
</div>

{/* ✅ Button sirf tab dikhe jab image select ho */}
{newQR && (
  <button
    className="admin-btn btn-blue"
    style={{ marginTop: "12px" }}
    onClick={updateQR}
  >
    {currentQR ? "🔄 Update QR" : "➕ Add QR"}
  </button>
)}

        </div>

    {/* Start New Session */}
        <div className="admin-card">
             <div className="admin-card-detail">
                 <h3>Start New Session</h3>
             </div>
      <div className="admin-card-detail">
  <p className="admin-card-desc">
    ⚠️ This action will permanently remove the following data from the system:
  </p>

  <ul className="admin-delete-list">
    <li>All Homeworks</li>
    <li>All Notices</li>
    <li>All Applications</li>
    <li>All Attendance Records</li>
    <li>All Complaints</li>
    <li>All Events</li>
  </ul>
</div>

   <button
  className="admin-btn btn-red"
  onClick={() => setShowConfirm(true)}
>
  🚀 Start Session
</button>

        </div>
 

      </div>
      {showConfirm && (
  <div className="confirm-overlay">
    <div className="confirm-modal">
      <h2>⚠️ Confirm New Session</h2>

      <p className="confirm-warning">
        This action is <b>irreversible</b>.  
        All previous session data will be permanently deleted.
      </p>

      <p className="confirm-instruction">
        Type <b>DELETE</b> to confirm:
      </p>

      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Type DELETE"
        className="confirm-input"
      />

      <div className="confirm-actions">
        <button
          className="admin-btn btn-red"
          onClick={startNewSession}
        >
          ❌ Confirm Delete
        </button>

        <button
          className="admin-btn"
          onClick={() => {
            setShowConfirm(false);
            setConfirmText("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
}
