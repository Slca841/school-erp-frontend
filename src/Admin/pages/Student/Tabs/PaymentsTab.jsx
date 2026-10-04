import React, { useEffect, useState } from "react";
import {
  deletePayment,
  addPayment,
  saveOtherFees,
} from "../../../../services/studentService.js";
import axios from "axios";
import { API_URLS } from "../../../../Context/config.js";
import { generateReceipt, generatePaymentReceipt, } from "../utils/pdfUtils.js";
import "./PaymentsTab.css";

const PaymentsTab = ({ student, setStudent, reload,role  }) => {
  const [showAddFee, setShowAddFee] = useState(false);
  const [amount, setAmount] = useState("");
  const [installment, setInstallment] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [sessions, setSessions] = useState([]);
const [selectedSessionId, setSelectedSessionId] = useState("");
const [loadingSessions, setLoadingSessions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const currentSessionFee =
  student?.fees?.sessionWiseFees?.find(
    (fee) => fee.sessionId?.isCurrent === true
  ) ||
  student?.fees?.sessionWiseFees?.[student.fees.sessionWiseFees.length - 1];

const currentPreviousYearFee = currentSessionFee?.previousYearFee ?? 0;
const currentYearlyFee = currentSessionFee?.yearlyFee ?? 0;
const currentTotalFee = currentSessionFee?.totalFee ?? 0;
const currentPaidAmount = currentSessionFee?.paidAmount ?? 0;
const currentRemainingAmount = currentSessionFee?.remainingAmount ?? 0;
const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return (
      value._id?.toString() ||
      value.id?.toString() ||
      ""
    );
  }

  return value.toString();
};

const selectedSessionFee =
  student?.fees?.sessionWiseFees?.find(
    (fee) =>
      getId(fee.sessionId) ===
      getId(selectedSessionId)
  ) || null;

const selectedSessionPayments =
  student?.monthlyPayments?.filter((payment) => {
    const paymentSessionId =
      typeof payment.sessionId === "object"
        ? payment.sessionId?._id
        : payment.sessionId;

    return (
      paymentSessionId?.toString() ===
      selectedSessionId?.toString()
    );
  }) || [];

const selectedYearlyFee =
  selectedSessionFee?.yearlyFee ?? 0;

const selectedPreviousYearFee =
  selectedSessionFee?.previousYearFee ?? 0;

const selectedTotalFee =
  selectedSessionFee?.totalFee ?? 0;

const selectedPaidAmount =
  selectedSessionFee?.paidAmount ?? 0;

const selectedRemainingAmount =
  selectedSessionFee?.remainingAmount ?? 0;
  
  const installments = [
    "Admission Fee",
    "Installment 1",
    "Installment 2",
    "Installment 3",
    "Installment 4",
    "Previous Year Fee",
    "Exam Fee",
    "Annual Function Fee",
    "Smart Class Fee",
    "Diary Fee",
    "Identity Card Fee",
    "Penalty",
    "Transportation Fee",

  ];
  const [feeForm, setFeeForm] = useState({});
const startEdit = () => {
  if (!selectedSessionFee) {
    alert("⚠️ Please select an academic session first");
    return;
  }

  setFeeForm({
    previousYearFee:
      selectedSessionFee.previousYearFee ?? "",
    examFee:
      selectedSessionFee.examFee ?? "",
    admissionFee:
      selectedSessionFee.admissionFee ?? "",
    smartClassFee:
      selectedSessionFee.smartClassFee ?? "",
    annualFunctionFee:
      selectedSessionFee.annualFunctionFee ?? "",
    diaryFee:
      selectedSessionFee.diaryFee ?? "",
    identityCardFee:
      selectedSessionFee.identityCardFee ?? "",
    panalty:
      selectedSessionFee.panalty ?? "",
    otherCharges:
      selectedSessionFee.otherCharges ?? "",
    discount:
      selectedSessionFee.discount ?? "",
    transportationFee:
      selectedSessionFee.transportationFee ?? "",
  });

  setEditMode(true);
};
useEffect(() => {
  const loadSessions = async () => {
    try {
      setLoadingSessions(true);

      const res = await axios.get(
        API_URLS.ACADEMIC_SESSION
      );

      const loadedSessions =
        res.data?.sessions || [];

      setSessions(loadedSessions);

      // Current session default select
      const currentSession =
        loadedSessions.find(
          (session) => session.isCurrent === true
        );

      if (currentSession) {
        setSelectedSessionId(currentSession._id);
      }
    } catch (error) {
      console.error(
        "Load sessions error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to load academic sessions"
      );
    } finally {
      setLoadingSessions(false);
    }
  };

  loadSessions();
}, []);
  /* -------------------------------- DELETE PAYMENT ------------------------------- */
  const handleDeletePayment = async (id) => {
    if (!window.confirm("Delete this payment?")) return;

    const success = await deletePayment(id);
    if (success) {
      alert("✅ Payment deleted");
      setStudent((prev) => ({
        ...prev,
        monthlyPayments: prev.monthlyPayments.filter((p) => p._id !== id),
      }));
    }
  };

  /* -------------------------------- ADD PAYMENT -------------------------------- */
const handleAddPayment = async () => {
  if (
    !amount ||
    !installment ||
    !year ||
    !selectedSessionId
  ) {
    return alert(
      "⚠️ Please select academic session and fill all fields"
    );
  }

  const payload = {
    studentId: student._id,
    paidAmount: Number(amount),
    installment,
    year: Number(year),
    sessionId: selectedSessionId,
    
  };

  console.log("🚀 PAYMENT PAYLOAD:", payload);

  const success = await addPayment(payload);

  if (success) {
    alert("✅ Payment added");

    setShowAddFee(false);
    setAmount("");
    setInstallment("");
    setYear(new Date().getFullYear());
    setSelectedSessionId("");

    reload();
  }
};
  /* ---------------------------- SAVE OTHER FEES ---------------------------- */
  const handleSaveOtherFees = async () => {
  const payload = {
  sessionId: selectedSessionId,

  ...Object.fromEntries(
    Object.entries(feeForm).map(([k, v]) => [
      k,
      Number(v) || 0,
    ])
  ),
};

const updated = await saveOtherFees(student._id, payload);
    if (updated) {
      alert("✅ Other fees updated");
      setEditMode(false);
      reload();
    } else {
      alert("❌ Failed to update fees");
    }
  };

  /* ---------------------------- EDITABLE FIELDS ---------------------------- */
  const feeFields = [
    { label: "Previous Year Fee", key: "previousYearFee" },
    { label: "Exam Fee", key: "examFee" },
    { label: "Admission Fee", key: "admissionFee" },
    { label: "Annual Function Fee", key: "annualFunctionFee" },
    { label: "Smart Class Fee", key: "smartClassFee" },
    { label: "Diary Fee", key: "diaryFee" },
    { label: "Identity Card Fee", key: "identityCardFee" },
    { label: "Penalty", key: "panalty" },
    { label: "Transportation Fee", key: "transportationFee" },
    { label: "Other Charges", key: "otherCharges" },
    { label: "Discount", key: "discount" },
  ];

  return (
    <div className="payment-layout">
      {/* ================= LEFT : PAYMENT HISTORY ================= */}
      <div className="payment-section">
<div className="payment-header">

  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <h2>💳 Payment History</h2>

    <select
      value={selectedSessionId}
      onChange={(e) => setSelectedSessionId(e.target.value)}
      disabled={loadingSessions}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontWeight: "600",
        background: "#fff",
      }}
    >
      <option value="">
        {loadingSessions
          ? "Loading..."
          : "-- Select Session --"}
      </option>

      {sessions.map((session) => (
        <option
          key={session._id}
          value={session._id}
        >
          {session.name}
          {session.isCurrent ? " (Current)" : ""}
        </option>
      ))}
    </select>
  </div>

  {student.status === "ACTIVE" && (
    <button
      className="btn-add-fee"
      onClick={() => setShowAddFee(true)}
    >
      ➕ Add Payment
    </button>
  )}
</div>

        {/* PAYMENT TABLE */}
      {selectedSessionPayments.length > 0 ? (
          <table className="payment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Receipt No.</th>
                <th>Session</th>
                <th>Date</th>
                <th>Installment</th>
                <th>Amount</th>
                <th>Receipt</th>
             {role === "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
{selectedSessionPayments.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>
  <strong>
    {p.receiptNumber != null
      ? String(p.receiptNumber).padStart(2, "0")
      : "-"}
  </strong>
</td>
<td>
  {p.sessionId?.name ||
    p.sessionId?.sessionName ||
    "-"}
</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{p.installment}</td>
                  <td>₹{p.paidAmount}</td>
                  <td>


                    <button
                      className="btn-primary"
                      onClick={() =>
                        generatePaymentReceipt(student, p, true)
                      }
                    >
                      🖨
                    </button>
                  </td>
          {role === "admin" && (
  <td>
    <button
      className="btn-delete"
      onClick={() => handleDeletePayment(p._id)}
    >
      🗑
    </button>
  </td>
)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-text">No payment records yet.</p>
        )}

        {/* ================= SUMMARY (BACKEND CALCULATED) ================= */}
        <div className="summary-box">
          <div>
          <p>
  <strong>Yearly Fee:</strong> ₹{selectedSessionFee?.yearlyFee ?? 0}
</p>

<p>
  <strong>Previous Year Fee:</strong>{" "}
  ₹{selectedSessionFee?.previousYearFee ?? 0}
</p>

<p>
  <strong>Other Fees:</strong>{" "}
  ₹{(
    Number(selectedSessionFee?.examFee || 0) +
    Number(selectedSessionFee?.admissionFee || 0) +
    Number(selectedSessionFee?.annualFunctionFee || 0) +
    Number(selectedSessionFee?.smartClassFee || 0) +
    Number(selectedSessionFee?.diaryFee || 0) +
    Number(selectedSessionFee?.identityCardFee || 0) +
    Number(selectedSessionFee?.panalty || 0) +
    Number(selectedSessionFee?.otherCharges || 0) +
    Number(selectedSessionFee?.transportationFee || 0)
  )}
</p>

<p>
  <strong>Discount:</strong>{" "}
  ₹{selectedSessionFee?.discount ?? 0}
</p>

<hr />

<p>
  <strong>Total Fee:</strong> ₹{selectedSessionFee?.totalFee ?? 0}
</p>
          </div>

          <div>
  <p>
  <strong>Total Paid:</strong>{" "}
  ₹{selectedSessionFee?.paidAmount ?? 0}
</p>

<p>
  <strong>Total Fee:</strong>{" "}
  ₹{selectedSessionFee?.totalFee ?? 0}
</p>

<hr />

<p className="remaining">
  <strong>Remaining Fee:</strong>{" "}
  ₹{selectedSessionFee?.remainingAmount ?? 0}
</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-download"
            onClick={() => generateReceipt(student, selectedSessionFee)}
          >
            📄 Download Receipt
          </button>

          <button
            className="btn-primary"
            onClick={() => generateReceipt(
  student,
  selectedSessionFee,
  true
)}
          >
            🖨 Print Receipt
          </button>
        </div>
      </div>

      {/* ================= RIGHT : OTHER FEES ================= */}
      <div className="other-fee-section">
        <h2>💰 Other Fees</h2>

        <div className="other-fee-fields">
          {feeFields.map((f) => (
            <div key={f.key} className="fee-field">
              <label>{f.label}</label>
              {!editMode ? (
       <div className="fee-value">
  ₹{selectedSessionFee?.[f.key] ?? 0}
</div>
              ) : (
                <input
                  className="fee-input"
                  type="number"
                  value={feeForm[f.key] ?? ""}
                  onChange={(e) =>
                    setFeeForm((prev) => ({
                      ...prev,
                      [f.key]: e.target.value,
                    }))
                  }
                />

              )}
            </div>
          ))}
        </div>
{role === "admin" && (
  !editMode ? (
    <button className="btn-primary" onClick={startEdit}>
      ✏️ Edit
    </button>
  ) : (
    <button className="btn-success" onClick={handleSaveOtherFees}>
      💾 Save
    </button>
  )
)}
      </div>

      {/* ================= ADD PAYMENT MODAL ================= */}
      {showAddFee && (
        <>
          <div className="overlay" onClick={() => setShowAddFee(false)} />
          <div className="modal-box">
            <h3>➕ Add Payment</h3>
            <select
  value={selectedSessionId}
  onChange={(e) =>
    setSelectedSessionId(e.target.value)
  }
  disabled={loadingSessions}
>
  <option value="">
    {loadingSessions
      ? "Loading Sessions..."
      : "-- Select Academic Session --"}
  </option>

  {sessions.map((session) => (
    <option
      key={session._id}
      value={session._id}
    >
      {session.name}
      {session.isCurrent ? " (Current)" : ""}
    </option>
  ))}
</select>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
            >
              <option value="">-- Select Installment --</option>

              {installments.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <button className="btn-success" onClick={handleAddPayment}>
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsTab;
