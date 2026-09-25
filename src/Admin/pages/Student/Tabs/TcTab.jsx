import React, { useEffect, useState } from "react";
import { approveTC, fetchStudentTCs, previewTC } from "../../../../services/studentService.js";
import { generateTC } from "../utils/pdfUtils.js";
import "../StudentProfile.css";

const TcTab = ({ student, studentId, reload }) => {
  const [tcList, setTcList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [dateOfLeaving, setDateOfLeaving] = useState("");
  const [reasonOfTC, setReasonOfTC] = useState("");
const [previewData, setPreviewData] = useState(null);
const [previewLoading, setPreviewLoading] = useState(false);

const [attendance, setAttendance] = useState({
  totalWorkingDays: 0,
  overallPresent: 0,
  overallAbsent: 0,
  overallLeave: 0,
  attendancePercentage: 0,
});

const [generalConduct, setGeneralConduct] =
  useState("GOOD");
const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
const [pdfPreviewLoading, setPdfPreviewLoading] = useState(false);
  // 🔹 Load TC history
  const loadTCs = async () => {
    if (!studentId) return;
    const list = await fetchStudentTCs(studentId);
    setTcList(list);
  };
const hasTC = tcList.length > 0;
const latestTC = tcList[0];

const formatTCNumber = (number) => {
  if (number === undefined || number === null) {
    return "-";
  }

  return String(number).padStart(2, "0");
};
const handleOpenTCPreview = async () => {
  setPreviewLoading(true);

  const data = await previewTC(studentId);

  setPreviewLoading(false);

  if (!data) return;

  setPreviewData(data);

  setAttendance({
    totalWorkingDays: data.attendance?.totalWorkingDays || 0,
    overallPresent: data.attendance?.overallPresent || 0,
    overallAbsent: data.attendance?.overallAbsent || 0,
    overallLeave: data.attendance?.overallLeave || 0,
    attendancePercentage: data.attendance?.attendancePercentage || 0,
  });

  setShowModal(true);
};
useEffect(() => {
  if (!showModal || !previewData) return;

  const studentForPDF = {
    ...previewData.student,

    tcNumber: "PREVIEW",

    generalConduct,

    totalWorkingDays: Number(attendance.totalWorkingDays) || 0,
    overallPresent: Number(attendance.overallPresent) || 0,
    overallAbsent: Number(attendance.overallAbsent) || 0,
    overallLeave: Number(attendance.overallLeave) || 0,

    attendancePercentage:
      Number(attendance.totalWorkingDays) > 0
        ? Number(
            (
              (Number(attendance.overallPresent) /
                Number(attendance.totalWorkingDays)) *
              100
            ).toFixed(2)
          )
        : 0,

    dateOfLeaving,
    reason: reasonOfTC,
  };

  const url = generateTC(studentForPDF, false, true);

  setPdfPreviewUrl(url);

  // Previous Blob URL clean karo
  return () => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  };
}, [
  showModal,
  previewData,
  attendance.totalWorkingDays,
  attendance.overallPresent,
  attendance.overallAbsent,
  attendance.overallLeave,
  generalConduct,
  dateOfLeaving,
  reasonOfTC,
]);
const handleGeneratePDFPreview = async () => {
  try {
    if (!previewData) return;

    setPdfPreviewLoading(true);

    const studentForPDF = {
      ...previewData.student,

      // Preview mein actual TC number nahi banega
      tcNumber: "PREVIEW",

      // Edited values
      generalConduct,

      totalWorkingDays: Number(
        attendance.totalWorkingDays
      ),

      overallPresent: Number(
        attendance.overallPresent
      ),

      overallAbsent: Number(
        attendance.overallAbsent
      ),

      overallLeave: Number(
        attendance.overallLeave
      ),

      attendancePercentage:
        attendance.totalWorkingDays > 0
          ? Number(
              (
                (Number(attendance.overallPresent) /
                  Number(attendance.totalWorkingDays)) *
                100
              ).toFixed(2)
            )
          : 0,

      dateOfLeaving,
      reason: reasonOfTC,
    };

    const url = generateTC(
      studentForPDF,
      false,
      true
    );

    setPdfPreviewUrl(url);
  } catch (error) {
    console.error(
      "TC PDF PREVIEW ERROR:",
      error
    );
  } finally {
    setPdfPreviewLoading(false);
  }
};

  // 🔹 Final approve
 const handleConfirmApprove = async () => {
  if (!dateOfLeaving || !reasonOfTC) {
    return alert(
      "⚠️ Date of Leaving & Reason are required"
    );
  }

  const tc = await approveTC(studentId, {
    dateOfLeaving,
    reasonOfTC,

    // ✅ EDITED ATTENDANCE
    attendance: {
      totalWorkingDays:
        Number(attendance.totalWorkingDays),

      overallPresent:
        Number(attendance.overallPresent),

      overallAbsent:
        Number(attendance.overallAbsent),

      overallLeave:
        Number(attendance.overallLeave),
    },

    // ✅ EDITED CONDUCT
    generalConduct,
  });

  if (!tc) return;

  console.log("TC FROM API:", tc);

  generateTC(
    {
      ...student,
      ...tc,

      tcNumber: formatTCNumber(
        tc.tcNumber
      ),

      // ✅ PDF VALUES
      totalWorkingDays:
        tc.totalWorkingDays,

      overallPresent:
        tc.overallPresent,

      overallAbsent:
        tc.overallAbsent,

      overallLeave:
        tc.overallLeave,

      attendancePercentage:
        tc.attendancePercentage,

      reason:
        tc.reason,

      generalConduct:
        tc.generalConduct,
    },
    true
  );

  setShowModal(false);

  setDateOfLeaving("");
  setReasonOfTC("");

  await loadTCs();
  reload();

  window.dispatchEvent(
    new Event("TC_APPROVED")
  );
};
  useEffect(() => {
    loadTCs();
  }, [studentId]);

  return (
    <div>
      <h2 className="section-title">Transfer Certificate</h2>

      {/* ✅ Generate Button */}
{/* ================= GENERATE TC BUTTON ================= */}

{hasTC ? (
  <button
    type="button"
    className="btn btn-save tc-main-generate-btn"
    onClick={() =>
      generateTC(
        {
          ...student,
          ...latestTC,
          tcNumber: formatTCNumber(latestTC.tcNumber),
        },
        true
      )
    }
  >
    🖨️ Print TC
  </button>
) : (
  <button
    type="button"
    className="btn tc-main-generate-btn"
    onClick={handleOpenTCPreview}
    disabled={previewLoading}
  >
    {previewLoading ? "Loading TC..." : "📜 Generate TC"}
  </button>
)}

      {/* ================= MODAL ================= */}
{showModal && (
  <div className="modal-overlay">
    <div
      className="modal-box tc-preview-modal"
      style={{
        width: "95%",
        maxWidth: "1100px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <h3>
        📜 Transfer Certificate Preview & Edit
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "350px 1fr",
          gap: "25px",
          marginTop: "20px",
        }}
      >

        {/* ================= LEFT EDIT ================= */}

        <div>
          <h4>✏️ Edit TC Details</h4>

          {/* DATE */}
          <div className="form-group">
            <label>Date of Leaving</label>

            <input
              type="date"
              value={dateOfLeaving}
              onChange={(e) =>
                setDateOfLeaving(
                  e.target.value
                )
              }
            />
          </div>

          {/* REASON */}
          <div className="form-group">
            <label>Reason of TC</label>

            <textarea
              rows="3"
              placeholder="Enter reason"
              value={reasonOfTC}
              onChange={(e) =>
                setReasonOfTC(
                  e.target.value
                )
              }
            />
          </div>

          <hr />

          <h4>📊 Attendance</h4>

          {/* TOTAL DAYS */}
          <div className="form-group">
            <label>
              Total Working Days
            </label>

            <input
              type="number"
              value={
                attendance.totalWorkingDays
              }
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  totalWorkingDays:
                    e.target.value,
                }))
              }
            />
          </div>

          {/* PRESENT */}
          <div className="form-group">
            <label>
              Present Days
            </label>

            <input
              type="number"
              value={
                attendance.overallPresent
              }
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  overallPresent:
                    e.target.value,
                }))
              }
            />
          </div>

          {/* ABSENT */}
          <div className="form-group">
            <label>
              Absent Days
            </label>

            <input
              type="number"
              value={
                attendance.overallAbsent
              }
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  overallAbsent:
                    e.target.value,
                }))
              }
            />
          </div>

          {/* LEAVE */}
          <div className="form-group">
            <label>
              Leave Days
            </label>

            <input
              type="number"
              value={
                attendance.overallLeave
              }
              onChange={(e) =>
                setAttendance((prev) => ({
                  ...prev,
                  overallLeave:
                    e.target.value,
                }))
              }
            />
          </div>

          {/* PERCENTAGE */}
          <div className="form-group">
            <label>
              Attendance Percentage
            </label>

            <input
              type="number"
              step="0.01"
              value={
                attendance.totalWorkingDays > 0
                  ? (
                      (
                        Number(
                          attendance.overallPresent
                        ) /
                        Number(
                          attendance.totalWorkingDays
                        )
                      ) * 100
                    ).toFixed(2)
                  : 0
              }
              readOnly
            />
          </div>

          {/* CONDUCT */}
          <div className="form-group">
            <label>
              General Conduct
            </label>

            <select
              value={generalConduct}
              onChange={(e) =>
                setGeneralConduct(
                  e.target.value
                )
              }
            >
              <option value="GOOD">
                GOOD
              </option>

              <option value="VERY GOOD">
                VERY GOOD
              </option>

              <option value="EXCELLENT">
                EXCELLENT
              </option>

              <option value="SATISFACTORY">
                SATISFACTORY
              </option>
            </select>
          </div>
        </div>

        {/* ================= RIGHT PREVIEW ================= */}

       {/* ================= RIGHT PREVIEW ================= */}

<div className="tc-right-preview">

  <div className="tc-preview-title">
    <h4>👁️ TC Preview</h4>
  </div>

  {/* HTML PREVIEW */}
  {!pdfPreviewUrl && (
    <div className="tc-html-preview-box">

      <div className="tc-school-header">
        <h2>ST. LAXMAN CHAITANYA ACADEMY</h2>

        <p>
          Harsud Road, Nehalda, Khandwa (M.P.)
        </p>

        <hr />

        <h1>TRANSFER CERTIFICATE</h1>
      </div>

      <div className="tc-number-row">
        <span>TC No. : -</span>

        <span>
          Date : {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="tc-details">

        <p>
          <b>1. This is to certify that the student :-</b>{" "}
          {previewData?.student?.fullName}
        </p>

        <p>
          <b>2. Mother's Name :-</b>{" "}
          {previewData?.student?.studentMotherName || "N.A."}
        </p>

        <p>
          <b>3. Father's Name :-</b>{" "}
          {previewData?.student?.studentFatherName || "N.A."}
        </p>

        <p>
          <b>4. Category :-</b>{" "}
          {previewData?.student?.category || "N.A."}
        </p>

        <p>
          <b>5. Class :-</b>{" "}
          {previewData?.student?.studentclass || "N.A."}
        </p>

        <p>
          <b>8. General Conduct :-</b>{" "}
          {generalConduct}
        </p>

        <p>
          <b>9. Total Working Days :-</b>{" "}
          {attendance.totalWorkingDays}
        </p>

        <p>
          <b>10. Total Present Days :-</b>{" "}
          {attendance.overallPresent}
        </p>

        <p>
          <b>11. Total Absent Days :-</b>{" "}
          {attendance.overallAbsent}
        </p>

        <p>
          <b>12. Attendance :-</b>{" "}
          {attendance.totalWorkingDays > 0
            ? (
                (Number(attendance.overallPresent) /
                  Number(attendance.totalWorkingDays)) *
                100
              ).toFixed(2)
            : 0}
          %
        </p>

        <p>
          <b>Date of Admission :-</b>{" "}
          {previewData?.student?.dateOfAdmission
            ? new Date(
                previewData.student.dateOfAdmission
              ).toLocaleDateString()
            : "N.A."}
        </p>

        <p>
          <b>Date of Leaving :-</b>{" "}
          {dateOfLeaving
            ? new Date(dateOfLeaving).toLocaleDateString()
            : "N.A."}
        </p>

        <p>
          <b>Reason for Leaving :-</b>{" "}
          {reasonOfTC || "On Request"}
        </p>

      </div>
    </div>
  )}

  {/* ACTUAL PDF */}
  {pdfPreviewUrl && (
    <div className="tc-pdf-viewer">

      <div className="tc-pdf-viewer-header">
        <div>
          <strong>📄 Final TC PDF</strong>
          <span>Preview</span>
        </div>
      </div>

<iframe
  src={`${pdfPreviewUrl}#zoom=page-width`}
  title="Live TC Preview"
  className="tc-pdf-preview-frame"
/>

    </div>
  )}

</div>
      </div>

      {/* ================= BUTTONS ================= */}
<div
  className="modal-actions"
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  }}
>
  <button
    className="btn btn-cancel"
    onClick={() => {
      setShowModal(false);
      setPdfPreviewUrl(null);
    }}
  >
    Cancel
  </button>

  <button
    className="btn btn-save"
    onClick={handleConfirmApprove}
  >
    ✅ Approve & Generate TC
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
             <td>
  <strong>{formatTCNumber(tc.tcNumber)}</strong>
</td>
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
