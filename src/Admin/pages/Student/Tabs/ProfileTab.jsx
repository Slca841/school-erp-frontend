import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveStudentProfile } from "../../../../services/studentService.js";
import { API_URLS } from "../../../../Context/config.js";
import { useNavigate } from "react-router-dom";
import "../StudentProfile.css";

/* ================= HELPERS ================= */
const getValue = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

/* DATE */
const dateFields = ["dateOfBirth", "dateOfAdmission"];
const formatDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};
const formatDateForInput = (v) =>
  v ? new Date(v).toISOString().split("T")[0] : "";

/* LOCKED FIELDS */
const lockedFields = ["studentclass", "yearlyFee", "discount", "remainingFee"];

/* ================= COMPONENT ================= */
const ProfileTab = ({ student, setStudent, studentId }) => {
  const [editMode, setEditMode] = useState(false);
  const [authorizedPersons, setAuthorizedPersons] = useState(
    student?.guardian?.authorizedPersons || []
  );
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: student?.userId?.name || "",
    email: student?.userId?.email || "",
    password: ""
  });

  /* ================= FIELDS ================= */
  const fields = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Password", key: "password" },
    { label: "Full Name", key: "fullName" },
    { label: "Father's Name", key: "studentFatherName" },
    { label: "Mother's Name", key: "studentMotherName" },
    { label: "Gender", key: "gender" },
    { label: "Religion", key: "religion" },
    { label: "Category", key: "category" },
    { label: "Date of Birth", key: "dateOfBirth" },
    { label: "Date of Admission", key: "dateOfAdmission" },
    { label: "Class", key: "studentclass" },
    { label: "Roll Number", key: "rollNo" },
    { label: "Contact No. 1", key: "contact1" },
    { label: "Contact No. 2", key: "contact2" },
    { label: "Aadhar No", key: "aadharNo" },
    { label: "Scholar No", key: "scholarNo" },
    { label: "Samagra ID", key: "samagraId" },
    { label: "Pen No", key: "penNo" },
    { label: "ApaarId", key: "apaarId" },
    { label: "Guardian Name", key: "guardian.name" },
    { label: "Guardian Relation", key: "guardian.relation" },
    { label: "Guardian Contact", key: "guardian.contactNumber" },
    { label: "Guardian Email", key: "guardian.email" },
    { label: "Guardian Address", key: "guardian.address" },
    { label: "Address", key: "address" },
    { label: "Yearly Fee", key: "yearlyFee" },
    { label: "Discount", key: "discount" },
    { label: "Remaining Fee", key: "remainingFee" }
  ];

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (!studentId) return;
    axios
      .get(`${API_URLS.ATTENDANCE}/student/${studentId}/overall`)
      .then((res) => setAttendanceSummary(res.data))
      .catch(() => {});
  }, [studentId]);

  useEffect(() => {
    setUserData({
      username: student?.userId?.name || "",
      email: student?.userId?.email || "",
      password: student?.userId?.originalPassword || ""
    });
    setAuthorizedPersons(student?.guardian?.authorizedPersons || []);
  }, [student]);

  /* ================= AUTHORIZED ================= */
  const handleAuthChange = (i, f, v) => {
    const copy = [...authorizedPersons];
    copy[i][f] = v;
    setAuthorizedPersons(copy);
  };
  const addAuth = () =>
    setAuthorizedPersons([
      ...authorizedPersons,
      { name: "", relation: "", contactNumber: "", note: "" }
    ]);
  const removeAuth = (i) => {
    const copy = [...authorizedPersons];
    copy.splice(i, 1);
    setAuthorizedPersons(copy);
  };
const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  const last = keys.pop();
  let temp = obj;

  keys.forEach((k) => {
    if (!temp[k]) temp[k] = {};
    temp = temp[k];
  });

  temp[last] = value;
};

  /* ================= ACTIONS ================= */
  const handleSave = async () => {
    try {
      const payload = {
        ...student,
        name: userData.username,
        email: userData.email,
        password: userData.password || undefined,
        guardian: {
          ...student.guardian,
          authorizedPersons
        }
      };
      const updated = await saveStudentProfile(studentId, payload);
      if (updated) {
        alert("Profile updated");
        setStudent(updated);
        setEditMode(false);
      }
    } catch {
      alert("Save failed");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="profile-tab-container">
      <h2 className="section-title">👨‍🎓 Student Profile</h2>

      {/* ===== PROFILE FIELDS ===== */}
      <div className="profile-fields">
        {fields.map((f) => {
          const isLocked = lockedFields.includes(f.key);

          return (
            <div key={f.key} className="field-box">
              <label>{f.label}</label>

              {["username", "email", "password"].includes(f.key) ? (
                !editMode ? (
                  <div className="read-box">
                    {f.key === "password"
                      ? student?.userId?.originalPassword || "—"
                      : userData[f.key] || "—"}
                  </div>
                ) : (
                  <input
                    className="input-field"
                    value={userData[f.key]}
                    onChange={(e) =>
                      setUserData((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                  />
                )
              ) : !editMode || isLocked ? (
                <div className="read-box">
                  {dateFields.includes(f.key)
                    ? formatDate(getValue(student, f.key))
                    : getValue(student, f.key) || "—"}
                </div>
              ) : (
                <input
                  className="input-field"
                  type={dateFields.includes(f.key) ? "date" : "text"}
                  value={
                    dateFields.includes(f.key)
                      ? formatDateForInput(getValue(student, f.key))
                      : getValue(student, f.key) || ""
                  }
          onChange={(e) =>
  setStudent((prev) => {
    const copy = structuredClone(prev);
    setNestedValue(copy, f.key, e.target.value);
    return copy;
  })
}

                />
              )}
            </div>
          );
        })}
      </div>

      {/* ===== ATTENDANCE ===== */}
      <div className="attendance-summary-box">
        <h3 className="section-subtitle">📘 Attendance Summary</h3>
        {!attendanceSummary ? (
          <p>Loading...</p>
        ) : (
          <div className="attendance-grid">
            <div className="att-card present">
              <span>Present</span>
              <strong>{attendanceSummary.present}</strong>
            </div>
            <div className="att-card absent">
              <span>Absent</span>
              <strong>{attendanceSummary.absent}</strong>
            </div>
            <div className="att-card leave">
              <span>Leave</span>
              <strong>{attendanceSummary.leave}</strong>
            </div>
            <div className="att-card total">
              <span>Total Days</span>
              <strong>{attendanceSummary.totalDays}</strong>
            </div>
          </div>
        )}
      </div>

      {/* ===== AUTHORIZED GUARDIANS ===== */}
      <div className="authorized-section">
        <h3 className="section-subtitle">🧾 Authorized Guardians</h3>

        {!editMode ? (
          <table className="authorized-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Relation</th>
                <th>Contact</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {authorizedPersons.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.name || "—"}</td>
                  <td>{p.relation || "—"}</td>
                  <td>{p.contactNumber || "—"}</td>
                  <td>{p.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            {authorizedPersons.map((p, i) => (
              <div key={i} className="authorized-box">
                <input value={p.name} placeholder="Name" onChange={(e) => handleAuthChange(i, "name", e.target.value)} />
                <input value={p.relation} placeholder="Relation" onChange={(e) => handleAuthChange(i, "relation", e.target.value)} />
                <input value={p.contactNumber} placeholder="Contact Number" onChange={(e) => handleAuthChange(i, "contactNumber", e.target.value)} />
                <input value={p.note} placeholder="Note" onChange={(e) => handleAuthChange(i, "note", e.target.value)} />
                <button onClick={() => removeAuth(i)}>❌</button>
              </div>
            ))}
            <button className="btn-add" onClick={addAuth}>➕ Add Authorized Guardian</button>
          </>
        )}
      </div>

      {/* ===== BUTTONS ===== */}
      {role === "admin" && (
        <div className="button-row">
          {!editMode ? (
            <button className="btn btn-edit" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <button className="btn btn-save" onClick={handleSave}>
              💾 Save Changes
            </button>
          )}
          {/* <button className="delete-btn" onClick={deleteStudent}>
            🗑 Delete Student
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
