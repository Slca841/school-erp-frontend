import { API_URLS } from "../../../Context/config.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./ThreeDayReport.css";

const ThreeDayReport = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);

  // ==============================
  // 1️⃣ Load all classes
  // ==============================
  const loadClasses = async () => {
    try {
      const res = await axios.get(`${API_URLS.ASSIGN}/class`);
      if (res.data.success) {
        setClasses(res.data.classes);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  // ==============================
  // 2️⃣ Load attendance report
  // ==============================
  const loadReport = async (id) => {
    if (!id) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${API_URLS.ATTENDANCE}/report/3day-report/class/${id}`
      );

      const { absentToday } = res.data;

      const formatted = absentToday.map((s) => ({
        ...s,
        absent: 1,
      }));

      setRows(formatted);
    } catch (err) {
      console.log("Report error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // ==============================
  // 3️⃣ DOWNLOAD PDF
  // ==============================
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Today's Attendance Report", 14, 10);

    const tableData = rows.map((s, i) => [
      i + 1,
      `${s.fullName} (${s.rollNo})`,
      s.absent,
      s.absent,
    ]);

    doc.autoTable({
      head: [["S.No", "Student", "Absent", "Total Issues"]],
      body: tableData,
    });

    doc.save("AttendanceReport.pdf");
  };

  // ==============================
  // 4️⃣ DOWNLOAD EXCEL
  // ==============================
  const downloadExcel = () => {
    const sheetData = rows.map((s, i) => ({
      S_No: i + 1,
      Student: `${s.fullName} (${s.rollNo})`,
      Absent: s.absent,
      Total_Issues: s.absent,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, "AttendanceReport.xlsx");
  };

  return (
    <div className="reportContainer">
      <h1 className="title">📅 Today Attendance Report</h1>

      {/* Class Selector */}
      <div className="dropdownWrapper">
        <label>Select Class:</label>
        <select
          value={classId}
          onChange={(e) => {
            setClassId(e.target.value);
            loadReport(e.target.value);
          }}
        >
          <option value="">-- Select Class --</option>

          {classes.map((c) => (
            <option value={c._id} key={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loadingBox">
          <div className="spinner"></div>
          <p>Loading report...</p>
        </div>
      )}

      {/* Downloads */}
      {rows.length > 0 && (
        <div className="downloadButtons">
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={downloadExcel}>Download Excel</button>
          <button onClick={() => window.print()}>Print</button>
        </div>
      )}

      {/* Table */}
      {classId && (
        <div className="tableBox">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student</th>
                <th>Absent</th>
                <th>Total Issues</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty">No absent students today</td>
                </tr>
              ) : (
                rows.map((s, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{s.fullName} ({s.rollNo})</td>
                    <td>{s.absent}</td>
                    <td>{s.absent}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ThreeDayReport;
