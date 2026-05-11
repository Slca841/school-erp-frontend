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

  // 🔥 FAST LOAD
  useEffect(() => {
    const loadDashboard = async () => {
      try {
     if (!summary) {
  setLoading(true);
}

const dashboardCache = localStorage.getItem("dashboard_cache");
const birthdayCache = localStorage.getItem("birthday_cache");

const now = Date.now();
      // ================= DASHBOARD CACHE =================
if (dashboardCache) {
  const parsed = JSON.parse(dashboardCache);

  const isFresh =
    now - parsed.timestamp < 2 * 60 * 1000;

  if (isFresh) {
    setSummary(parsed.summary);
    setClasses(parsed.classes);
    setAttendance(parsed.attendance);
    setLoading(false);
  }
}

// ================= BIRTHDAY CACHE =================
if (birthdayCache) {
  const parsed = JSON.parse(birthdayCache);

  const today = new Date().toDateString();
  const cacheDate = new Date(parsed.timestamp).toDateString();

  if (today === cacheDate) {
    setBirthdays(parsed.birthdays);
  }
}

        // ✅ parallel API
        const [summaryRes, birthdayRes, attendanceRes, classRes] = await Promise.all([
          axios.get(`${API_URLS.GET_STUDENTS}/fees/summary`),
          axios.get(`${API_URLS.GET_STUDENTS}/birthdays/today`),
          axios.get(`${API_URLS.ATTENDANCE}/admin/summary`),
          axios.get(`${API_URLS.ASSIGN}/class`)
        ]);

const finalData = {
  summary: summaryRes.data,
  attendance: attendanceRes.data,
  classes: classRes.data.success
    ? classRes.data.classes
    : [],
  timestamp: now
};
        setSummary(finalData.summary);
        setBirthdays(finalData.birthdays);
        const birthdayData = {
  students: birthdayRes.data?.students || [],
  teachers: birthdayRes.data?.teachers || []
};

setBirthdays(birthdayData);

localStorage.setItem(
  "birthday_cache",
  JSON.stringify({
    birthdays: birthdayData,
    timestamp: now
  })
);
        setAttendance(finalData.attendance);
        setClasses(finalData.classes);
localStorage.setItem(
  "dashboard_cache",
  JSON.stringify(finalData)
);

      } catch (err) {
        console.error("Dashboard error:", err.message);
      } finally {
        if (!summary) {
    setLoading(false);
  }
      }
    };

    loadDashboard();
  }, []);

  const fetchClassAttendance = async (classId) => {
    if (!classId) return;
    try {
      const res = await axios.get(`${API_URLS.ATTENDANCE}/admin/class/${classId}/summary`);
      if (res.data.success) setClassAttendance(res.data);
    } catch (err) {
      console.error("Error fetching class attendance:", err.message);
    }
  };

  if (loading || !summary)
    return (
      <div className="center-screen">
        <div className="spinner"></div>
        <p className="loading-text">Loading Dashboard...</p>
      </div>
    );

  return (
    <div className="dashboard-container">

      <div className="topHead">
        <WaveHeader height={220} />
      </div>

      <div className="dashboard-main">

        {/* LEFT */}
        <div className="left-container">

          <div className="cards-grid">
            <div style={{ cursor: "pointer" }} onClick={() => navigate("/admin/students")}>
              <Card title="Total Students" value={summary.totalStudents} color="linear-gradient(to right,  #bf7fcfe8, #6368b0fb)" icon={<FaUsers />} />
            </div>

            <Card title="Total Fees" value={summary.totalFee} color="linear-gradient(to right, #b1a268e2, #546ec5cf)" icon={<FaRupeeSign />} />
            <Card title="Paid" value={summary.totalPaid} color="linear-gradient(to right, #a272c696, #ac7073aa)" icon={<FaCheckCircle />} />
            <Card title="Remaining" value={summary.totalRemaining} color="linear-gradient(to right, #5ba998ba, #aab074c5)" icon={<FaTimesCircle />} />
          </div>

          <div className="widgets-grid">

            {/* Attendance */}
            <div className="widget attendance-widget">
              <h2><FaClipboardCheck /> Attendance Summary</h2>

              {attendance ? (
                <>
                  <p>✅ Present: {attendance.present}</p>
                  <p>❌ Absent: {attendance.absent}</p>
                  <p>🟦 Leave: {attendance.leave}</p>

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

            {classAttendance ? (
  classAttendance.present === 0 &&
  classAttendance.absent === 0 &&
  classAttendance.leave === 0 ? (
    <p className="no-data">⚠️ No attendance marked for this class today</p>
  ) : (
    <div className="class-summary">
      <h3>Class: {classAttendance.class}</h3>
      <p>✅ Present: {classAttendance.present}</p>
      <p>❌ Absent: {classAttendance.absent}</p>
      <p>🟦 Leave: {classAttendance.leave}</p>
    </div>
  )
) : (
  <p className="no-data">Select a class to view details</p>
)}
                </>
              ) : (
                <p>⚠️ Attendance data not available</p>
              )}
            </div>

            {/* EVENT SECTION (RESTORED) */}
            <div className="event-calender">
              <div className="event-calender-view">
                <h2>📅 SLCA Event Calendar</h2>
                <div className="event-content">
                  <button onClick={() => navigate("/admin/eventCalendar")}>
                    View
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="right-container">

          {/* Gender */}
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
          dataKey="value"
          label
        >
          <Cell fill="#4A90E2" />
          <Cell fill="#FF69B4" />
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* 🔥 Percentage Display */}
      {(() => {
        const total = summary.maleCount + summary.femaleCount;

        const malePercent = total
          ? ((summary.maleCount / total) * 100).toFixed(1)
          : 0;

        const femalePercent = total
          ? ((summary.femaleCount / total) * 100).toFixed(1)
          : 0;

        return (
          <p style={{ color: "black", fontWeight: "600", marginTop: "10px" }}>
            👦 Male: {malePercent}% | 👧 Female: {femalePercent}%
          </p>
        );
      })()}
    </div>
  ) : (
    <p style={{ color: "black" }}>No gender data found</p>
  )}
</div>

          {/* Birthdays FULL */}
      <div className="widget birthday-widget">
  <div className="birthday-header">
    <h2><FaBirthdayCake /> Today's Birthdays</h2>

    <FaExpand
      className="zoom-icon"
      onClick={() => setShowBirthdayZoom(true)}
      title="Expand"
    />
  </div>

  {/* Tabs */}
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

  {/* SMALL VIEW */}
  <div className="birthday-list">
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

  {/* 🔥 MODAL (FULL VIEW SAME STYLE) */}
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

        {/* BIG LIST */}
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

// Card
const Card = React.memo(({ title, value, color, icon }) => (
  <div className="card" style={{ background: color }}>
    <h3>{title}</h3>
    <div className="card-icon">
      <div>{icon}</div>
      <p>{value}</p>
    </div>
  </div>
));

export default React.memo(Home);