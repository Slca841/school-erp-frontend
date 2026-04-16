import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import { FaClipboardCheck, FaUsers, FaRupeeSign, FaCheckCircle, FaTimesCircle, FaBirthdayCake } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { FaExpand, FaTimes } from "react-icons/fa";
import WaveHeader from "./WaveHeader";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
const [showBirthdayZoom, setShowBirthdayZoom] = useState(false);
  const [summary, setSummary] = useState(null);
 const [birthdays, setBirthdays] = useState({ students: [], teachers: [] });
const [activeTab, setActiveTab] = useState("students");
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classAttendance, setClassAttendance] = useState(null);

  // 🔹 Fetch Overall Attendance (Admin)
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URLS.ATTENDANCE}/admin/summary`);
      if (res.data.success) setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err.message);
    }
  };

  // 🔹 Fetch All Classes
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URLS.ASSIGN}/class`);
      if (res.data.success && Array.isArray(res.data.classes)) {
        setClasses(res.data.classes); // full object store karo
      } else {
        console.warn("⚠️ No classes found or invalid format:", res.data);
      }
    } catch (err) {
      console.error("Error fetching classes:", err.message);
    }
  };

  // 🔹 Fetch Class-wise Attendance
  const fetchClassAttendance = async (classId) => {
    if (!classId) return;
    try {
      const res = await axios.get(`${API_URLS.ATTENDANCE}/admin/class/${classId}/summary`);
      if (res.data.success) setClassAttendance(res.data);
      else setClassAttendance(null);
    } catch (err) {
      console.error("Error fetching class attendance:", err.message);
    }
  };

  // 🔹 Fetch Fee Summary
  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_URLS.GET_STUDENTS}/fees/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err.message);
    } finally {
      setLoading(false);
    }
  };

const fetchBirthdays = async () => {
  try {
    const res = await axios.get(`${API_URLS.GET_STUDENTS}/birthdays/today`);
    const data = res.data || {};
    setBirthdays({
      students: data.students || [],
      teachers: data.teachers || [],
    });
  } catch (err) {
    console.error("❌ Error fetching birthdays:", err.message);
  }
};

  useEffect(() => {
    fetchSummary();
    fetchBirthdays();
    fetchAttendance();
    fetchClasses();
  }, []);

  if (loading)
    return (
      <div className="center-screen">
        <div className="spinner"></div>
        <p className="loading-text">Loading Dashboard...</p>
      </div>
    );

  if (!summary)
    return (
      <div className="center-screen error-text">❌ Failed to load summary</div>
    );

  return (
    <div className="dashboard-container">
      {/* <h1 className="dashboard-title">📊 Dashboard</h1> */}
<div className="topHead">
    <WaveHeader height={220} />
</div>
      <div className="dashboard-main">
        {/* LEFT SIDE */}
        <div className="left-container">
          <div className="cards-grid">
            <div style={{cursor:"pointer"}} onClick={() => navigate("/admin/students")}>
            <Card title="Total Students" value={summary.totalStudents} color="linear-gradient(to right,  #bf7fcfe8, #6368b0fb)" icon={<FaUsers />} />
          </div>
            <Card title="Total Fees" value={`${summary.totalFee}`} color="linear-gradient(to right, #b1a268e2, #546ec5cf)" icon={<FaRupeeSign />} />
            <Card title="Paid" value={`${summary.totalPaid}`} color="linear-gradient(to right, #a272c696, #ac7073aa)" icon={<FaCheckCircle />} />
            <Card title="Remaining" value={`${summary.totalRemaining}`} color="linear-gradient(to right, #5ba998ba, #aab074c5)" icon={<FaTimesCircle />} />
          </div>

          {/* Attendance Summary */}
          <div className="widgets-grid">
           
            <div className="widget attendance-widget">
              <h2><FaClipboardCheck /> Attendance Summary</h2>
              {attendance ? (
                <>
                  <p>✅ Present: {attendance.present} / {attendance.totalStudents}</p>
                  <p>❌ Absent: {attendance.absent} / {attendance.totalStudents}</p>
<p>🟦 Leave: {attendance.leave} / {attendance.totalStudents}</p>

                  {/* Dropdown for Class Selection */}
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      fetchClassAttendance(e.target.value);
                    }}
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>

                  {/* Show Selected Class Attendance */}
                  {classAttendance ? (
                    classAttendance.totalStudents > 0 ? (
                      <div className="class-summary">
                        <h3>Class: {classAttendance.class}</h3>
                        <p>✅ Present: {classAttendance.present} / {classAttendance.totalStudents}</p>
                        <p>❌ Absent: {classAttendance.absent} / {classAttendance.totalStudents}</p>
                    <p>🟦 Leave: {classAttendance.leave} / {classAttendance.totalStudents}</p>

                      </div>
                    ) : (
                      <p className="no-data">⚠️ No attendance marked for this class today</p>
                    )
                  ) : (
                    <p className="no-data">Select a class to view details</p>
                  )}
                </>
              ) : (
                <p>⚠️ Attendance data not available</p>
              )}
            </div>
        <div className="event-calender">
          <div className="event-calender-view">
            <h2>📅 SLCA Event Calendar</h2>
            <div  className="event-content">
        <button style={{cursor:"pointer"}} onClick={() => navigate("/admin/eventCalendar")}>
  View
</button>

               
            </div>
          </div>

        </div>
          </div>
        </div>

      {/* RIGHT SIDE */}
<div className="right-container">
  {/* Gender Ratio */}
  <div className="widget gender-widget">
    <h2>👩‍🎓 Gender Ratio</h2>
    {summary.maleCount + summary.femaleCount > 0 ? (
      <div className="chart">
        <PieChart width={250} height={250}>
          <Pie
            data={[
              { name: "Male", value: summary.maleCount },
              { name: "Female", value: summary.femaleCount },
            ]}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            <Cell key="male" fill="#4A90E2" />
            <Cell key="female" fill="#FF69B4" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        {(() => {
          const total = summary.maleCount + summary.femaleCount;
          const malePercent = total ? ((summary.maleCount / total) * 100).toFixed(1) : 0;
          const femalePercent = total ? ((summary.femaleCount / total) * 100).toFixed(1) : 0;
          return (
            <p style={{color:"black",}}>
              👦 Male: {malePercent}% | 👧 Female: {femalePercent}%
            </p>
          );
        })()}
      </div>
    ) : (
      <p style={{color:"black",}}>No gender data found</p>
    )}
  </div>

  {/* Birthdays */}
 {/* 🎂 Birthday Widget */}
<div className="widget birthday-widget">
   <div className="birthday-header">
    <h2><FaBirthdayCake /> Today's Birthdays</h2>

    <FaExpand
      className="zoom-icon"
      onClick={() => setShowBirthdayZoom(true)}
      title="Expand"
    />
  </div>

  <div className="birthday-tabs">
    <button
      className={`birthday-tab ${activeTab === "students" ? "active" : ""}`}
      onClick={() => setActiveTab("students")}
    >
      🎓 Students ({birthdays.students?.length || 0})
    </button>
    <button
      className={`birthday-tab ${activeTab === "teachers" ? "active" : ""}`}
      onClick={() => setActiveTab("teachers")}
    >
      👨‍🏫 Teachers ({birthdays.teachers?.length || 0})
    </button>
  </div>

  {showBirthdayZoom && (
  <div className="birthday-modal-overlay">
    <div className="birthday-modal">
      <div className="birthday-modal-header">
        <h2><FaBirthdayCake /> Today's Birthdays</h2>
        <FaTimes
          className="close-icon"
          onClick={() => setShowBirthdayZoom(false)}
        />
      </div>

      {/* Tabs */}
      <div className="birthday-tabs">
        <button
          className={`birthday-tab ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          🎓 Students ({birthdays.students.length})
        </button>
        <button
          className={`birthday-tab ${activeTab === "teachers" ? "active" : ""}`}
          onClick={() => setActiveTab("teachers")}
        >
          👨‍🏫 Teachers ({birthdays.teachers.length})
        </button>
      </div>

      {/* List */}
      <div className="birthday-list big">
        {activeTab === "students" ? (
          birthdays.students.length ? (
            <ul>
              {birthdays.students.map((b, i) => (
                <li key={i}>
                  🎂 {b.fullName} (Class {b.studentclass})
                </li>
              ))}
            </ul>
          ) : <p>No student birthdays 🎉</p>
        ) : birthdays.teachers.length ? (
          <ul>
            {birthdays.teachers.map((t, i) => (
              <li key={i}>
                🎂 {t.fullName} ({t.qualification})
              </li>
            ))}
          </ul>
        ) : <p>No teacher birthdays 🎉</p>}
      </div>
    </div>
  </div>
)}

</div>

</div>
      </div>
    </div>
  );
};

// 🔹 Card Component
const Card = ({ title, value, color, icon }) => (
  <div className="card" style={{ background: color }}>
          <h3>{title}</h3>
    <div className="card-icon">

      <div>{icon}</div>
    <p>{value}</p>
 
     </div>
    
  </div>
);

export default Home;