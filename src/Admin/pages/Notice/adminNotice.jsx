import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import "./AdminNotice.css";

import { io } from "socket.io-client";
const socket = io(API_URLS.BASE_URL, { transports: ["websocket"] });

const AdminNotice = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    targetType: "all",
    targetClass: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [classes, setClasses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchNotices();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(`${API_URLS.ASSIGN}/class`);
    setClasses(res.data.classes || []);
  };

  const fetchNotices = async () => {
    const res = await axios.get(`${API_URLS.NOTICE}/all`);
    setNotices([...res.data.notices]);
  };

  // ------------------------
  // SUBMIT NOTICE
  // ------------------------
  const handleSubmit = async () => {
    if (!form.title || !form.message)
      return alert("All fields required");

    try {
      // 🔴 EDIT MODE (text only – as before)
      if (editMode) {
        await axios.put(`${API_URLS.NOTICE}/update/${editId}`, form);
        alert("✅ Notice updated successfully!");
        fetchNotices();
      }
      // 🟢 CREATE MODE (image optional)
      else {
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) =>
          formData.append(k, v)
        );
        formData.append("createdByRole", "admin");
        const adminId = localStorage.getItem("userId"); // ✅ get saved id
formData.append("createdById", adminId);        // ✅ send id to backend

        if (image) formData.append("image", image);

        const res = await axios.post(
          `${API_URLS.NOTICE}/create`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );


        setNotices((prev) => [res.data.notice, ...prev]);
        alert("✅ Notice sent successfully!");
      }

      // RESET
      setForm({ title: "", message: "", targetType: "all", targetClass: "" });
      setImage(null);
      setEditMode(false);
      setEditId(null);
    }catch (err) {
  console.error("NOTICE ERROR 👉", err.response?.data || err.message);
  alert(
    err.response?.data?.message ||
    "❌ Error while sending notice (check console)"
  );
}

  };
  const handleEdit = (notice) => {
    setForm({
      title: notice.title,
      message: notice.message,
      targetType: notice.targetType,
      targetClass: notice.targetClass || "",
    });
    setEditMode(true);
    setEditId(notice._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await axios.delete(`${API_URLS.NOTICE}/delete/${id}`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert("❌ Failed to delete notice");
    }
  };

  return (
    <div className="main-container">
      <h1> 📢 Notice</h1>

      <div className="notice-wrapper">
        {/* LEFT SIDE */}
        <div className="notice-container">
          <h2 className="notice-title">
            {editMode ? "✏️ Edit Notice" : "📢 Create Notice"}
          </h2>

          <input
            type="text"
            placeholder="Enter Notice Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="notice-input"   // ✅ SAME CLASS
          />

          <textarea
            placeholder="Write your message here..."
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            className="notice-textarea" // ✅ SAME CLASS
          />

          <select
            value={form.targetType}
            onChange={(e) =>
              setForm({
                ...form,
                targetType: e.target.value,
                targetClass: "",
              })
            }
            className="notice-select" // ✅ SAME CLASS
          >
            <option value="all">All Students</option>
            <option value="class">Class Wise</option>
            <option value="teachers">Teachers</option>
          </select>

          {form.targetType === "class" && (
            <select
              value={form.targetClass}
              onChange={(e) =>
                setForm({ ...form, targetClass: e.target.value })
              }
              className="notice-select" // ✅ SAME CLASS
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          )}

          {/* ✅ IMAGE OPTIONAL (NO CSS CHANGE) */}
          <div className="image-upload-box">
            <label className="image-upload-label">
              📷 {image ? "Image Selected" : "Upload Image (Optional)"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                hidden
              />
            </label>

            {image && (
              <span className="image-file-name">
                {image.name}
              </span>
            )}
          </div>


          <button onClick={handleSubmit} className="notice-btn">
            {editMode ? "💾 Update Notice" : "🚀 Send Notice"}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="notice-list">
          <h2>📜 Sent Notices</h2>

          {notices.length > 0 ? (
            notices.map((n) => (
              <div key={n._id} className="notice-card">
                <h4>{n.title}</h4>
                <p>{n.message}</p>

               {n.image && (
  <img
    src={n.image}
    alt="Notice"
    className="notice-image"
    onClick={() => setPreviewImage(n.image)}
  />
)}

<small className="notice-date">
  📅 {new Date(n.createdAt).toLocaleString("en-IN")}
</small>


                <small>
                  🎯 Target :- {n.targetType}{" "}
                  {n.targetType === "class" ? `(${n.targetClass})` : ""}
                </small>
<small>
  🧑‍💼 Created By: {n.senderName || "System"}
</small>
                {/* ✅ SAME ACTION BUTTONS AS OLD COMPONENT */}
                <div className="notice-actions">
                  <button onClick={() => handleEdit(n)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(n._id)}>🗑️ Delete</button>
                </div>
              </div>

            ))
          ) : (
            <p>No notices found</p>
          )}
        </div>
      </div>
  {previewImage && (
  <div
    className="image-preview-overlay"
    onClick={() => setPreviewImage(null)}
  >
    <img
      src={previewImage}
      alt="Preview"
      className="image-preview-large"
      onClick={(e) => e.stopPropagation()}
    />
    <span
      className="image-preview-close"
      onClick={() => setPreviewImage(null)}
    >
      ✖
    </span>
  </div>
)}


    </div>
  );
};

export default AdminNotice;
