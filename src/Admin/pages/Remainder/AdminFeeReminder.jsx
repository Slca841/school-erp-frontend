import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";

const AdminFeeReminder = () => {
  const [classes, setClasses] = useState([]);
  const [targetFee, setTargetFee] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URLS.BASE_URL}/api/fee/classes`);
      if (res.data.success) {
        setClasses(res.data.classes.map((c) => c.name));
      }
    } catch (err) {
      console.error("❌ Error fetching classes:", err);
    }
  };

  const sendReminder = async () => {
    if (!selectedClass || !targetFee) {
      alert("⚠️ Please select class and enter target fee");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URLS.BASE_URL}/api/fee/send-reminder`, {
        className: selectedClass,
        targetFee: Number(targetFee),
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error("❌ Error sending reminder:", err);
      setMessage("Error sending reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📢 Fee Reminder Dashboard</h2>

        <div style={styles.formRow}>
          <div style={styles.field}>
            <label style={styles.label}>Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Choose Class --</option>
              {classes.map((cls, i) => (
                <option key={i} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Target Fee (₹)</label>
            <input
              type="number"
              value={targetFee}
              onChange={(e) => setTargetFee(e.target.value)}
              placeholder="e.g. 2000"
              style={styles.input}
            />
          </div>

          <button
            onClick={sendReminder}
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? "#6c757d" : "#4B67FF",
            }}
          >
            {loading ? "Sending..." : "🚀 Send Reminder"}
          </button>
        </div>

        {message && (
          <div style={styles.messageBox}>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎨 CSS (JS styles)
const styles = {
  page: {
    width:"70%",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #4B67FF 0%, #6BCB77 100%)",
    margin:"0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: 20,
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px 40px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    width: "90%",
    maxWidth: "700px",
    color: "#fff",
  
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: "26px",
    fontWeight: "600",
    letterSpacing: "1px",
  },
  formRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "flex-end",
  },
  field: {
    flex: 1,
    minWidth: "180px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: 6,
    fontWeight: "500",
    color: "#e9e9e9",
  },
  select: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#fff",
    color: "#333",
    transition: "0.3s",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  messageBox: {
    marginTop: 25,
    padding: "12px 15px",
    backgroundColor: "#ffffff1a",
    borderRadius: 10,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: "0.3px",
    color: "#fff",
  },
};

export default AdminFeeReminder;