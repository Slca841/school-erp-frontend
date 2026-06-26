import React, { useEffect, useState } from "react";
import { approveTC, fetchStudentTCs } from "../../../../services/studentService.js";
import { generateTC } from "../utils/pdfUtils.js";
import "../StudentProfile.css";

const TcTab = ({ student, studentId, reload }) => {
  const [tcList, setTcList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [dateOfLeaving, setDateOfLeaving] = useState("");
  const [reasonOfTC, setReasonOfTC] = useState("");

  // 🔹 Load TC history
  const loadTCs = async () => {
    if (!studentId) return;
    const list = await fetchStudentTCs(studentId);
    setTcList(list);
  };
const hasTC = tcList.length > 0;
const latestTC = tcList[0];
  // 🔹 Final approve
  const handleConfirmApprove = async () => {
    if (!dateOfLeaving || !reasonOfTC) {
      return alert("⚠️ Date of Leaving & Reason are required");
    }

    const tc = await approveTC(studentId, {
      dateOfLeaving,
      reasonOfTC,
    });

    if (!tc) return;
console.log("TC FROM API:", tc);
    alert("✅ TC Approved Successfully");

 generateTC({ ...student, ...tc }, true);

    setShowModal(false);
    setDateOfLeaving("");
    setReasonOfTC("");

    await loadTCs();
    reload();

    window.dispatchEvent(new Event("TC_APPROVED"));
  };

  useEffect(() => {
    loadTCs();
  }, [studentId]);

  return (
    <div>
      <h2 className="section-title">Transfer Certificate</h2>

      {/* ✅ Generate Button */}
{hasTC ? (
  <button
    className="btn btn-save"
    onClick={() =>
      generateTC(
        {
          ...student,
          ...latestTC,
        },
        true
      )
    }
  >
    🖨️ Print TC
  </button>
) : (
  <button
    className="btn btn-save"
    onClick={() => setShowModal(true)}
  >
    📜 Generate TC
  </button>
)}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Approve Transfer Certificate</h3>

            <div className="form-group">
              <label>Date of Leaving</label>
              <input
                type="date"
                value={dateOfLeaving}
                onChange={(e) => setDateOfLeaving(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Reason of TC</label>
              <textarea
                rows="3"
                placeholder="Enter reason"
                value={reasonOfTC}
                onChange={(e) => setReasonOfTC(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-save"
                onClick={handleConfirmApprove}
              >
                ✅ Approve & Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TC HISTORY ================= */}
      <h3 className="section-title mt-6">TC History (This Student)</h3>

      <table className="payment-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Roll No</th>
            <th>TC Number</th>
            <th>Date Approved</th>
          </tr>
        </thead>
        <tbody>
          {tcList?.length > 0 ? (
            tcList.map((tc, idx) => (
              <tr key={tc._id}>
                <td>{idx + 1}</td>
                <td>{tc.studentId?.fullName}</td>
                <td>{tc.studentId?.studentclass}</td>
                <td>{tc.studentId?.rollNo}</td>
                <td>{tc.tcNumber}</td>
                <td>{new Date(tc.dateOfLeaving).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No TC Generated Yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TcTab;
