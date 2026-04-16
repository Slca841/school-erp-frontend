import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Student.css";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [feeFilter, setFeeFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const [action, setAction] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);
const [activeTab, setActiveTab] = useState("ACTIVE");
const [loading, setLoading] = useState(false);
  const role = localStorage.getItem("role");
  const classes = [
    "Nursery",
    "LK-G",
    "UK-G",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ];
useEffect(() => {
  setStudents([]);   // 👈 CLEAR OLD DATA
  setFiltered([]);   // 👈 CLEAR FILTERED DATA
  fetchStudents(activeTab);
}, [activeTab]);



  useEffect(() => {
    applyFilters();
  }, [search, classFilter, feeFilter, students]);

useEffect(() => {
 const handler = () => {
  setStudents([]);
  setFiltered([]);
  setActiveTab("TC_APPROVED");
  fetchStudents(activeTab);
};


  window.addEventListener("TC_APPROVED", handler);

  return () => {
    window.removeEventListener("TC_APPROVED", handler);
  };
}, []);

  // ✅ Fetch all students (alphabetically sorted)
  const fetchStudents = async (tab) => {
    try {
      setLoading(true);
      const url =
        tab === "ACTIVE"
          ? `${API_URLS.GET_STUDENTS}/students/active`
          : `${API_URLS.GET_STUDENTS}/students/tc`;

      const res = await axios.get(url);
      if (res.data.success) {
        const sortedData = res.data.students.sort((a, b) =>
          (a.fullName || "").localeCompare(b.fullName || "")
        );
        setStudents(sortedData);
        setFiltered(sortedData);
      }
    } catch (err) {
      console.error("Error fetching students:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Apply filters + sorting
  const applyFilters = () => {
    let data = [...students];

    if (search) {
      data = data.filter((s) =>
        s.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (classFilter !== "All") {
      data = data.filter((s) => s.studentclass === classFilter);
    }

 if (feeFilter && activeTab === "ACTIVE") {
  data = data.filter((s) => s.remainingFee > parseInt(feeFilter));
}


    // ✅ Always sort alphabetically after filtering
    data.sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));

    setFiltered(data);
  };

  // ✅ Toggle single student
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Select/Deselect All
  const toggleAll = () => {
    if (isAllSelected) {
      setSelected([]);
      setIsAllSelected(false);
    } else {
      setSelected(filtered.map((s) => s._id));
      setIsAllSelected(true);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("TC approved student will be permanently deleted. Continue?")) return;
    try {
      const res = await axios.delete(
        `${API_URLS.GET_STUDENTS}/delete-student/${id}`
      );
      if (res.data.success) {
        alert("Student deleted successfully");
        fetchStudents("TC_APPROVED");
      }
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };
  // ✅ Handle bulk actions
  const handleBulkAction = async () => {
    if (selected.length === 0) return alert("No students selected!");
    if (!action) return alert("Please select an action first!");

    const selectedStudents = filtered.filter((s) => selected.includes(s._id));

    // 🟦 Upgrade
    if (action === "upgrade") {
      if (selectedStudents.some((s) => s.studentclass === "12th")) {
        return alert("❌ 12th class students cannot be upgraded further!");
      }

      const confirm = window.confirm(
        "Upgrade selected students to the next class (remaining fee will carry forward)?"
      );
      if (!confirm) return;

      try {
        const res = await axios.post(`${API_URLS.GET_STUDENTS}/upgrade`, {
          selectedStudents: selectedStudents.map((s) => ({
            id: s._id,
            remainingFee: s.remainingFee || 0,
          })),
          type: "upgrade",
        });
        alert(res.data.message || "Upgrade successful");
      fetchStudents(activeTab);
setSelected([]);
setIsAllSelected(false);
setAction("");
      } catch (err) {
        console.error(err);
        alert("Error upgrading students");
      }
    }

    // 🟥 Downgrade
    if (action === "degrade") {
      const confirm = window.confirm(
        "Downgrade selected students to the previous class (remaining fee will carry forward)?"
      );
      if (!confirm) return;

      try {
        const res = await axios.post(`${API_URLS.GET_STUDENTS}/upgrade`, {
          selectedStudents: selectedStudents.map((s) => ({
            id: s._id,
            remainingFee: s.remainingFee || 0,
          })),
          type: "degrade",
        });
        alert(res.data.message || "Downgrade successful");
      fetchStudents(activeTab);
setSelected([]);
setIsAllSelected(false);
setAction("");
      } catch (err) {
        console.error(err);
        alert("Error downgrading students");
      }
    }

    // 🟩 PDF Download
    if (action === "pdf") {
      generatePDF(selectedStudents);
    }
  };

  // ✅ Generate PDF
  const generatePDF = (selectedData) => {
    if (!selectedData || selectedData.length === 0) {
      alert("Please select at least one student!");
      return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "A4" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(" Student Report", 40, 40);

    const formatRupees = (num) => {
      if (!num || isNaN(num)) return "0";
      return Number(num).toLocaleString("en-IN");
    };

    const tableData = selectedData.map((s, i) => [
      i + 1,
      s.fullName || "N/A",
      s.studentFatherName || "N/A",
      s.studentclass || "N/A",
      s.contact1 || "N/A",
      formatRupees(s.totalPaid || 0),
      formatRupees(s.remainingFee || 0),
      formatRupees(s.totalFee || 0),
    ]);

    autoTable(doc, {
      startY: 60,
      head: [["#", "Name", "Father", "Class", "Contact", "Paid", "Unpaid", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        halign: "center",
        fontSize: 11,
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
        textColor: [30, 30, 30],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      styles: {
        font: "helvetica",
        cellPadding: 5,
        overflow: "linebreak",
      },
    });
    const date = new Date().toLocaleDateString("en-IN");
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 40, doc.internal.pageSize.height - 20);
 
    doc.save("students_report.pdf");
  };

  return (
    <div className="students-container">
      <h2 className="students-title">📋 Student List</h2>
   {/* 🔁 TABS */}
      <div className="student-tabs">
        <button
          className={activeTab === "ACTIVE" ? "active" : ""}
          onClick={() => setActiveTab("ACTIVE")}
        >
          Active Students
        </button>
        <button
          className={activeTab === "TC_APPROVED" ? "active" : ""}
          onClick={() => setActiveTab("TC_APPROVED")}
        >
          TC Students
        </button>
      </div>
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
     {activeTab === "ACTIVE" && (
          <input
            type="number"
              className="search-input"
            placeholder="Fee Due More Than (₹)"
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
          />
        )}
      </div>

      {/* Class Filter */}
      <div className="class-filter">
        {["All", ...classes].map((cls) => (
          <button
            key={cls}
            className={`class-btn ${classFilter === cls ? "active" : ""}`}
            onClick={() => setClassFilter(cls)}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Bulk Action Bar */}
      <div className="bulk-actions">
        <button onClick={toggleAll}>
          {isAllSelected ? "❌ Deselect All" : "✅ Select All"}
        </button>

        <select
          className="action-select"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">-- Choose Action --</option>
          <option value="upgrade">⬆️ Upgrade Class</option>
          <option value="degrade">⬇️ Downgrade Class</option>
          <option value="pdf">📄 Download PDF</option>
        </select>

        <button className="apply-btn" onClick={handleBulkAction}>
          Apply
        </button>
      </div>

      <p className="count-text">Total Students: {filtered.length}</p>

      {/* Table */}
      {!loading && (
      <div className="table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleAll}
                />
              </th>
              <th>Name</th>
              <th>Class</th>
              <th>Contact</th>
         {activeTab === "ACTIVE" && <th>Remaining Fee</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <tr key={s._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(s._id)}
                      onChange={() => toggleSelect(s._id)}
                    />
                  </td>
                  <td>{s.fullName}</td>
                  <td>{s.studentclass}</td>
                  <td>{s.contact1}</td>
                   {activeTab === "ACTIVE" && <td>₹{s.remainingFee}</td>}
                  <td>
                    <Link to={`student/${s._id}`} className="view-btn">
                      👤 View
                    </Link>
                  {activeTab === "TC_APPROVED" && role === "admin" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(s._id)}
                  >
                    🗑️ Delete
                  </button>
                )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No Students Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default Student;
