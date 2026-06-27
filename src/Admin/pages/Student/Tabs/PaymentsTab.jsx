import React, { useState } from "react";
import {
  deletePayment,
  addPayment,
  saveOtherFees,
} from "../../../../services/studentService.js";
import { generateReceipt, generatePaymentReceipt, } from "../utils/pdfUtils.js";
import "./PaymentsTab.css";

const PaymentsTab = ({ student, setStudent, reload }) => {
  const [showAddFee, setShowAddFee] = useState(false);
  const [amount, setAmount] = useState("");
  const [installment, setInstallment] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [editMode, setEditMode] = useState(false);
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
    setFeeForm({
      previousYearFee: student.previousYearFee ?? "",
      examFee: student.examFee ?? "",
      admissionFee: student.admissionFee ?? "",
      smartClassFee: student.smartClassFee ?? "",
      annualFunctionFee: student.annualFunctionFee ?? "",
      diaryFee: student.diaryFee ?? "",
      identityCardFee: student.identityCardFee ?? "",
      panalty: student.panalty ?? "",
      otherCharges: student.otherCharges ?? "",
      discount: student.discount ?? "",
      transportationFee: student.transportationFee ?? "",
    });
    setEditMode(true);
  };

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
    if (!amount || !installment || !year)
      return alert("⚠️ Please fill all fields");

    const success = await addPayment({
      studentId: student._id,
      paidAmount: Number(amount),
      installment,
      year,
    });

    if (success) {
      alert("✅ Payment added");
      setShowAddFee(false);
      setAmount("");
      setInstallment("");
      setYear(new Date().getFullYear());
      reload(); // backend recalculation
    }
  };

  /* ---------------------------- SAVE OTHER FEES ---------------------------- */
  const handleSaveOtherFees = async () => {
    const payload = Object.fromEntries(
      Object.entries(feeForm).map(([k, v]) => [k, Number(v) || 0])
    );

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
          <h2>💳 Payment History</h2>
          {
            student.status === "ACTIVE" && (
              <button className="btn-add-fee" onClick={() => setShowAddFee(true)}>
                ➕ Add Payment
              </button>
            )}
        </div>

        {/* PAYMENT TABLE */}
        {student?.monthlyPayments?.length > 0 ? (
          <table className="payment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Installment</th>
                <th>Amount</th>
                <th>Receipt</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {student.monthlyPayments.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>
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
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeletePayment(p._id)}
                    >
                      🗑
                    </button>
                  </td>

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
            <p><strong>Yearly Fee:</strong> ₹{student.yearlyFee}</p>
            <p><strong>Previous Year Fee:</strong> ₹{student.previousYearFee}</p>
            <p><strong>Other Fees:</strong> ₹{student.otherFees}</p>
            <p><strong>Discount:</strong> ₹{student.discount}</p>
            <hr />
            <p><strong>Total Fee:</strong> ₹{student.totalFee}</p>
          </div>

          <div>
            <p><strong>Total Paid:</strong> ₹{student.totalPaid}</p>
            <p><strong>Total Fee:</strong> ₹{student.totalFee}</p>
            <hr />
            <p className="remaining">
              <strong>Remaining Fee:</strong> ₹{student.remainingFee}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-download"
            onClick={() => generateReceipt(student)}
          >
            📄 Download Receipt
          </button>

          <button
            className="btn-primary"
            onClick={() => generateReceipt(student, true)}
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
                <div className="fee-value">₹{student[f.key] || 0}</div>
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

        {!editMode ? (
          <button className="btn-primary" onClick={startEdit}>
            ✏️ Edit
          </button>

        ) : (
          <button className="btn-success" onClick={handleSaveOtherFees}>
            💾 Save
          </button>
        )}
      </div>

      {/* ================= ADD PAYMENT MODAL ================= */}
      {showAddFee && (
        <>
          <div className="overlay" onClick={() => setShowAddFee(false)} />
          <div className="modal-box">
            <h3>➕ Add Payment</h3>
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
