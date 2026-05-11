import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../Context/config.js";
import {
  FaUsers,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaBirthdayCake,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./AccountHome.css";

const AccountHome = () => {
    const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
const [birthdays, setBirthdays] = useState({
  students: [],
  teachers: []
});
  const [loading, setLoading] = useState(true);
const loadDashboard = async () => {
  try {

    // 🔥 cache first
    const cached = localStorage.getItem("account_dashboard");

    if (cached) {
      const parsed = JSON.parse(cached);

      const isFresh =
        Date.now() - parsed.timestamp < 2 * 60 * 1000;

      if (isFresh) {
        setSummary(parsed.summary);
        setBirthdays(parsed.birthdays);
        setLoading(false);
      }
    }

    // 🔥 parallel fetch
    const [summaryRes, birthdayRes] = await Promise.all([
      axios.get(`${API_URLS.GET_STUDENTS}/fees/summary`),
      axios.get(`${API_URLS.GET_STUDENTS}/birthdays/today`)
    ]);

const birthdayData = {
  students: birthdayRes.data?.students || [],
  teachers: birthdayRes.data?.teachers || []
};

    setSummary(summaryRes.data);
setBirthdays(birthdayData);

    // 🔥 save cache
    localStorage.setItem(
      "account_dashboard",
      JSON.stringify({
        summary: summaryRes.data,
        birthdays: birthdayData,
        timestamp: Date.now()
      })
    );

  } catch (err) {
    console.error("Dashboard Error:", err.message);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  loadDashboard();
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
      <div className="center-screen error-text">
        ❌ Failed to load summary
      </div>
    );

  return (
    <div className="account-page">
      <div className="stats-section">

           <div style={{cursor:"pointer"}} onClick={() => navigate("/account/students")}>
        <Card
          title="Total Students"
          value={summary.totalStudents}
          color="linear-gradient(135deg, #8e8a99ff, #8b8de6e7)"
          icon={<FaUsers />}
        />
        </div>
        <Card
          title="Total Fees"
          value={`₹${summary.totalFee.toLocaleString()}`}
          color="linear-gradient(135deg, #929fa1ff, #32a6b6ff)"
          icon={<FaRupeeSign />}
        />
        <Card
          title="Total Paid"
          value={`₹${summary.totalPaid.toLocaleString()}`}
          color="linear-gradient(135deg, #8b9c96ff, #64c889ff)"
          icon={<FaCheckCircle />}
        />
        <Card
          title="Remaining"
          value={`₹${summary.totalRemaining.toLocaleString()}`}
          color="linear-gradient(135deg, #c1b5b5ff, #d58181ff)"
          icon={<FaTimesCircle />}
        />
      </div>

      <div className="widgets-section">
        {/* Gender Ratio Widget */}
        <div className="widget gender-box">
          <h2>👩‍🎓 Gender Ratio</h2>
          {summary.maleCount + summary.femaleCount > 0 ? (
            <div className="gender-chart">
              <PieChart width={280} height={250}>
                <Pie
                  data={[
                    { name: "Male", value: summary.maleCount },
                    { name: "Female", value: summary.femaleCount },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
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
              <p className="gender-stats">
                👦 Male:{" "}
                {(
                  (summary.maleCount /
                    (summary.maleCount + summary.femaleCount)) *
                  100
                ).toFixed(1)}
                % | 👧 Female:{" "}
                {(
                  (summary.femaleCount /
                    (summary.maleCount + summary.femaleCount)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          ) : (
            <p className="no-data">No gender data available</p>
          )}
        </div>

        {/* Birthday Widget */}
        <div className="widget birthday-box">
          <h2>🎂 Today's Birthdays</h2>
    {birthdays.students.length > 0 ? (
            <ul className="birthday-list">
              {birthdays.students.map((b, idx) => (
                <li key={idx}>
                  <FaBirthdayCake className="cake-icon" /> {b.fullName} —{" "}
                  <span>Class {b.studentclass}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-birthday">No birthdays today 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

// 🔹 Card Component
const Card = React.memo(({ title, value, color, icon }) => (
  <div className="stat-card" style={{ background: color }}>
    <h3>{title}</h3>
   <div className="ndisplay">
     <div className="card-icon">{icon}</div>
    <p>{value}</p>
   </div>
  </div>
)
);
export default React.memo(AccountHome);