import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config";
import "./StudentRiskReport.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function StudentRiskReport() {
  const [loadingReport, setLoadingReport] = useState(false);
  const [riskFilter, setRiskFilter] =
  useState("all");
  const [classes, setClasses] =
    useState([]);
  const [classId, setClassId] =
    useState("");
  const [days, setDays] =
    useState(3);
  const [report, setReport] =
    useState([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses =
    async () => {
      const res =
        await axios.get(
          `${API_URLS.ASSIGN}/class`
        );

      setClasses(
        res.data.classes || []
      );
    };

const generateReport = async () => {
  if (!classId) return;

  try {
    setLoadingReport(true);

    const res = await axios.get(
      `${API_URLS.REPORT}/${classId}?days=${days}`
    );

    setReport(res.data.report || []);
  } catch (err) {
    console.log(err);
  } finally {
    setLoadingReport(false);
  }
};
const downloadExcel = () => {
  const excelData = filteredReport.map((r) => {
    const score =
      r.absentDays + r.homeworkMissed;

    return {
      Student: r.name,
      "Absent Days": r.absentDays,
      "Homework Missed": r.homeworkMissed,
      Contact: r.contact,
      Risk:
        score >= 3
          ? "Critical"
          : score >= 2
          ? "Warning"
          : "Normal",
    };
  });

  const worksheet =
    XLSX.utils.json_to_sheet(
      excelData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Risk Report"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    fileData,
    `Report_${classId}_${riskFilter}.xlsx`
  );
};
const filteredReport =
  report.filter((r) => {
    const score =
      r.absentDays +
      r.homeworkMissed;

    const risk =
      score >= 3
        ? "critical"
        : score >= 2
        ? "warning"
        : "normal";

    if (riskFilter === "all")
      return true;

    return risk === riskFilter;
  });

return (
  <div className="risk-report-container">
    <h2 className="risk-title">
      📊 Student Risk Report
    </h2>

    <div className="filter-box">
      <select
        value={classId}
        onChange={(e) =>
          setClassId(e.target.value)
        }
      >
        <option value="">
          Select Class
        </option>

        {classes.map((c) => (
          <option
            key={c._id}
            value={c.name}
          >
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={days}
        onChange={(e) =>
          setDays(Number(e.target.value))
        }
      >
        <option value={3}>Last 3 Days</option>
        <option value={5}>Last 5 Days</option>
        <option value={7}>Last 7 Days</option>
      </select>

<select
  value={riskFilter}
  onChange={(e) =>
    setRiskFilter(e.target.value)
  }
>
  <option value="all">
    All Students
  </option>

  <option value="critical">
    Critical Only
  </option>

  <option value="warning">
    Warning Only
  </option>

  <option value="normal">
    Normal Only
  </option>
</select>

<button
  className="generate-btn"
  onClick={generateReport}
  disabled={loadingReport}
>
  {loadingReport
    ? "⏳ Generating Report..."
    : "Generate Report"}
</button>

<div
  style={{
    display: "flex",
    gap: "10px",
  }}
>
  <button
    className="generate-btn"
    onClick={downloadExcel}
  >
    📥 Download Excel
  </button>

</div>
    </div>

    {/* Summary Cards */}
    <div className="summary-box">
      <div className="summary-card summary-total">
        <h4>Total Students</h4>
        <h2>{filteredReport.length}</h2>
      </div>

      <div className="summary-card summary-critical">
        <h4>Critical</h4>
        <h2>
          {
            report.filter(
              (x) =>
                x.absentDays +
                  x.homeworkMissed >=
                3
            ).length
          }
        </h2>
      </div>

      <div className="summary-card summary-warning">
        <h4>Warning</h4>
        <h2>
          {
            report.filter(
              (x) =>
                x.absentDays +
                  x.homeworkMissed ===
                2
            ).length
          }
        </h2>
      </div>
    </div>

    <div className="report-card">
      <table className="report-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Absent Days</th>
            <th>Homework Missed</th>
            <th>Contact</th>
            <th>Risk</th>
          </tr>
        </thead>

        <tbody>
          {filteredReport.map((r) => {
            const score =
              r.absentDays +
              r.homeworkMissed;

            const riskLevel =
              score >= 3
                ? "Critical"
                : score >= 2
                ? "Warning"
                : "Normal";

            return (
              <tr key={r.studentId}>
                <td className="student-name">
                  {r.name}
                </td>

                <td className="absent-count">
                  {r.absentDays}
                </td>

                <td className="homework-count">
                  {r.homeworkMissed}
                </td>

                <td className="contact">
                  {r.contact}
                </td>

                <td>
                  <span
                    className={`risk-badge ${
                      riskLevel ===
                      "Critical"
                        ? "risk-critical"
                        : riskLevel ===
                          "Warning"
                        ? "risk-warning"
                        : "risk-normal"
                    }`}
                  >
                    {riskLevel ===
                    "Critical"
                      ? "🔴 Critical"
                      : riskLevel ===
                        "Warning"
                      ? "🟠 Warning"
                      : "🟢 Normal"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {report.length === 0 && (
        <div className="no-data">
          Select class and generate report
        </div>
      )}
    </div>
  </div>
);
}