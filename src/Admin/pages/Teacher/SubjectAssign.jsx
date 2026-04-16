// src/pages/Admin/ClassAssign/SubjectAssign.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config";
import "./ClassAssign.css";
const SubjectAssign = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  // ✅ Load Teachers
  const loadTeachers = async () => {
    try {
      const res = await axios.get(`${API_URLS.TEACHER}/`);
      setTeachers(res.data?.teachers || []);
    } catch (err) {
      console.error("Error loading teachers:", err);
    }
  };

  // ✅ Load assigned subjects for selected class
  const loadAssignedSubjects = async (className) => {
    try {
      const res = await axios.get(`${API_URLS.SUBJECT}/class/${className}/teachers`);
      if (res.data?.teachers?.length > 0) {
        const data = [];
        res.data.teachers.forEach((t) => {
          t.subjects.forEach((subj) => {
            data.push({
              id: subj._id,
              subject: subj.name,
              teacher: t.teacherId,
              teacherName: t.teacherName,
              isNew: false,
            });
          });
        });
        setSubjectsList(data);
      } else setSubjectsList([]);
    } catch (err) {
      console.error("Error loading subjects:", err);
      setSubjectsList([]);
    }
  };

  // ✅ Delete subject
  const handleDeleteSubject = async (id) => {
    if (!selectedClass) return alert("⚠️ Select a class first");
    if (!window.confirm("🗑️ Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`${API_URLS.SUBJECT}/delete-subject/${selectedClass}/${id}`);
      setSubjectsList((prev) => prev.filter((s) => s.id !== id));
      alert("✅ Subject deleted successfully!");
    } catch (err) {
      console.error("Error deleting subject:", err);
      alert("❌ Failed to delete subject from database");
    }
  };

  // ✅ Subject or teacher field update
  const handleSubjectChange = (id, value) =>
    setSubjectsList((prev) => prev.map((s) => (s.id === id ? { ...s, subject: value } : s)));

  const handleTeacherSelect = (id, value) =>
    setSubjectsList((prev) => prev.map((s) => (s.id === id ? { ...s, teacher: value } : s)));

  // ✅ Add new subject
  const handleAddSubject = () => {
    setAddingNew(true);
    setSubjectsList((prev) => [
      ...prev,
      { id: Date.now(), subject: "", teacher: "", isNew: true },
    ]);
  };

  // ✅ Save subjects to DB
  const handleSaveSubjects = async () => {
    if (!selectedClass) return alert("⚠️ Select a class first");
    if (subjectsList.length === 0) return alert("⚠️ Add at least one subject");

    try {
      const payload = {
        className: selectedClass,
        section: "A",
        subjects: subjectsList.map((s) => ({
          name: s.subject,
          teacherId: s.teacher || "",
        })),
      };

      await axios.post(`${API_URLS.SUBJECT}/assign-subjects`, payload);
      alert("✅ Subjects saved successfully!");
      setEditMode(false);
      setAddingNew(false);
      loadAssignedSubjects(selectedClass);
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save subjects");
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const classList = [
    "Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th",
    "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th",
  ];

  return (
    <div className="subject-assign-container">
      {/* 🔹 LEFT CLASS LIST */}
      <div className="class-list">
        {classList.map((cls) => (
          <div
            key={cls}
            className={`class-item ${selectedClass === cls ? "active-class" : ""}`}
            onClick={() => {
              setSelectedClass(cls);
              setEditMode(false);
              setAddingNew(false);
              loadAssignedSubjects(cls);
            }}
          >
            {cls}
          </div>
        ))}
      </div>

      {/* 🔹 RIGHT SUBJECT TABLE */}
      <div className="subject-manage-section">
        {selectedClass ? (
          <>
            <h4>📘 Selected Class: {selectedClass}</h4>

            <table className="subject-table">
              <thead>
                <tr>
                  <th>
                    S.No{" "}
                    {!editMode && !addingNew && (
                      <button className="small-add-btn" onClick={handleAddSubject}>
                        ➕
                      </button>
                    )}
                  </th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  {!addingNew && !editMode && (
                    <th>
                      Action{" "}
                      {subjectsList.length > 0 && (
                        <button
                          className="editassign-btn"
                          onClick={() => {
                            setEditMode(true);
                            setAddingNew(false);
                          }}
                        >
                          ✏️
                        </button>
                      )}
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {subjectsList.length > 0 ? (
                  subjectsList.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>{idx + 1}</td>

                      {/* Subject Field */}
                      <td>
                        {item.isNew || editMode ? (
                          <input
                            type="text"
                            value={item.subject}
                            placeholder="Enter subject name"
                            onChange={(e) => handleSubjectChange(item.id, e.target.value)}
                          />
                        ) : (
                          <span>{item.subject || "—"}</span>
                        )}
                      </td>

                      {/* Teacher Field */}
                      <td>
                        {item.isNew || editMode ? (
                          <select
                            value={item.teacher}
                            onChange={(e) => handleTeacherSelect(item.id, e.target.value)}
                          >
                            <option value="">-- Select Teacher --</option>
                            {teachers.map((t) => (
                              <option key={t._id} value={t._id}>
                                {t.fullName || t.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{item.teacherName || "—"}</span>
                        )}
                      </td>

                      {/* Delete Button */}
                      {!addingNew && !editMode && (
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteSubject(item.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <em>No subjects assigned yet</em>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="btn-row">
              {(editMode || addingNew) && (
                <button className="assign-btn" onClick={handleSaveSubjects}>
                  💾 Save
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="note">👈 Select a class to manage subjects</p>
        )}
      </div>
    </div>
  );
};

export default SubjectAssign;