import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config";
import { fetchClasses } from "../../../services/classService";
import "./ClassAssign.css";
const TeacherAssign = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const loadData = async () => {
    try {
      const t = await axios.get(`${API_URLS.TEACHER}/`);
      const cls = await fetchClasses();
      setTeachers(t.data?.teachers || []);
      setClasses(cls || []);
    } catch (err) {
      console.error("Error loading:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignTeacher = async () => {
    if (!selectedTeacher || !selectedClass)
      return alert("⚠️ Select both teacher and class");
    try {
      await axios.post(`${API_URLS.ASSIGN}/assign`, {
        classId: selectedClass,
        teacherId: selectedTeacher,
      });
      alert("✅ Teacher Assigned!");
      loadData();
    } catch {
      alert("❌ Error assigning");
    }
  };

  return (
    <div>
      <div className="assign-controls">
        <select value={selectedTeacher} className="custom-select" onChange={(e) => setSelectedTeacher(e.target.value)}>
          <option value="">-- Select Teacher --</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.fullName}
            </option>
          ))}
        </select>

        <select value={selectedClass} className="custom-select" onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">-- Select Class --</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button className="assign-btn" onClick={handleAssignTeacher}>
          Assign
        </button>
      </div>

      <div className="assigned-table">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Assigned Teacher</th>
            </tr>
          </thead>
          <tbody>
            {classes.length > 0 ? (
              classes.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>
                    {c.teacherId
                      ? c.teacherId.fullName ||
                        c.teacherId.userId?.name ||
                        "Unnamed"
                      : "❌ Not Assigned"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No classes available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherAssign;