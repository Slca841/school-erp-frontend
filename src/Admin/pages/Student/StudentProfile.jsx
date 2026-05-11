import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  fetchStudent,
  saveStudentProfile,
  deletePayment,
} from "../../../services/studentService.js";
import ProfileTab from "./Tabs/ProfileTab";
import PaymentsTab from "./Tabs/PaymentsTab";
import TcTab from "./Tabs/TcTab";
import "./StudentProfile.css";

const StudentProfile = () => {
  const { id } = useParams();
  const location = useLocation();
const navigate = useNavigate();
const role = localStorage.getItem("role");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);


  // 🔹 Load student data
  const loadData = async () => {
    setLoading(true);
    const s = await fetchStudent(id);
    setStudent(s);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSaveProfile = async (id, studentData) => {
    if (!id) return alert("⚠️ Student ID missing");

    const updated = await saveStudentProfile(id, studentData);
    if (updated) {
      alert("✅ Student updated successfully");
      loadData();
    } else {
      alert("❌ Failed to update student");
    }
  };


  if (loading) return <p>Loading...</p>;
  if (!student) return <p>No student found ❌</p>;

  const tabs = ["profile", "payments", "tc"];

  return (
    <div className="profile-container">

 <button
  className="back-btn"
  onClick={() => {
   navigate(
  role === "admin"
    ? "/admin/students"
    : "/account/students",
  {
    state: location.state
  }
);
  }}
>
  ⬅ Back
</button>
 

      <div className="tabs top-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "profile"
              ? "Profile"
              : t === "payments"
              ? "Payments"
              : "TC Generate"}
          </button>
        ))}
      </div>

      {/* 🔹 Tabs Rendering */}
      {tab === "profile" && (
        <ProfileTab
          student={student}
          setStudent={setStudent}
          studentId={id}
          editMode={editMode}
          setEditMode={setEditMode}
          onSave={() => handleSaveProfile(id, student)}
        />
      )}

      {tab === "payments" && (
        <PaymentsTab
          student={student}
          deletePayment={deletePayment}
          reload={loadData}
        />
      )}

      {tab === "tc" && (
        <TcTab student={student} studentId={id} reload={loadData} />
      )}
   
    </div>
  );
};

export default StudentProfile;
