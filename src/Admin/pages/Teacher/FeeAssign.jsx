import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config";
import { fetchClasses } from "../../../services/classService";
import "./ClassAssign.css";

const FeeAssign = () => {
  const [feeClass, setFeeClass] = useState("");
  const [feeType, setFeeType] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [classFeeList, setClassFeeList] = useState([]);
  const [classes, setClasses] = useState([]);

  /* ===============================
     DEFAULT FEE STRUCTURE
     =============================== */
     const calculateTotalFee = (fee) => {
  return (
    Number(fee.yearlyFee || 0) +
    Number(fee.examFee || 0) +
    Number(fee.smartClassFee || 0) +
    Number(fee.admissionFee || 0) +
    Number(fee.annualFunctionFee || 0) +
    Number(fee.diaryFee || 0) +
    Number(fee.identityCardFee || 0) +
    Number(fee.panalty || 0) +
    Number(fee.otherCharges || 0)
  );
};

  const defaultFee = {
    yearlyFee: 0,
    examFee: 0,
    smartClassFee: 0,
    admissionFee: 0,
    annualFunctionFee: 0,
    diaryFee: 0,
    identityCardFee: 0,
    panalty: 0,
    otherCharges: 0,
  };

  /* ===============================
     LOAD DATA
     =============================== */
  const loadData = async () => {
    try {
      const cls = await fetchClasses();
      setClasses(cls || []);

      const res = await axios.get(
        `${API_URLS.GET_STUDENTS}/get-class-fees`
      );
      setClassFeeList(res.data?.data || []);
    } catch (err) {
      console.error("❌ Error loading fee data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ===============================
     SAVE / UPDATE FEE
     =============================== */
  const handleSaveFee = async () => {
    if (!feeClass || !feeType || !feeAmount) {
      return alert("⚠️ Please fill all fields");
    }

    try {
      await axios.post(`${API_URLS.GET_STUDENTS}/set-class-fee`, {
        className: feeClass,
        feeType,
        feeAmount: Number(feeAmount),
      });

      alert("✅ Fee saved successfully");
      setFeeAmount("");
      loadData();
    } catch (err) {
      console.error("❌ Error saving fee:", err);
      alert("Failed to save fee");
    }
  };

  /* ===============================
     MERGE CLASSES + FEES
     =============================== */
  const mergedFeeList = classes.map((cls) => {
    const assignedFee = classFeeList.find(
      (f) => f.className === cls.name
    );

    return {
      className: cls.name,
      ...(assignedFee || defaultFee),
    };
  });

  /* ===============================
     UI
     =============================== */
  return (
    <div>
      {/* ===============================
          CONTROLS
         =============================== */}
      <div className="assign-controls">
        <select
          className="custom-select"
          value={feeClass}
          onChange={(e) => setFeeClass(e.target.value)}
        >
          <option value="">-- Select Class --</option>
          {classes.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="custom-select"
          value={feeType}
          onChange={(e) => setFeeType(e.target.value)}
        >
          <option value="">-- Select Fee Type --</option>
          <option value="yearlyFee">Yearly Fee</option>
          <option value="examFee">Exam Fee</option>
          <option value="smartClassFee">Smart Class Fee</option>
          <option value="admissionFee">Admission Fee</option>
          <option value="annualFunctionFee">Annual Function Fee</option>
          <option value="diaryFee">Diary Fee</option>
          <option value="identityCardFee">Identity Card Fee</option>
          <option value="panalty">Penalty</option>
          <option value="otherCharges">Other Charges</option>
        </select>

        <input
          type="number"
          placeholder="Enter Amount ₹"
          className="amount-input"
          value={feeAmount}
          onChange={(e) => setFeeAmount(e.target.value)}
        />

        <button className="assign-btn" onClick={handleSaveFee}>
          💾 Save / Update
        </button>
      </div>

      {/* ===============================
          TABLE
         =============================== */}
      <div className="assigned-table">
        <h3>📋 Class-wise Fee Structure</h3>

        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Yearly</th>
              <th>Exam</th>
              <th>Smart</th>
              <th>Admission</th>
              <th>Annual</th>
              <th>Diary</th>
              <th>ID</th>
              <th>Penalty</th>
              <th>Other</th>
                 <th>Total Fee</th>
            </tr>
          </thead>

          <tbody>
            {mergedFeeList.length > 0 ? (
              mergedFeeList.map((fee, index) => (
                <tr key={index}>
                  <td>{fee.className}</td>
                  <td>₹{fee.yearlyFee}</td>
                  <td>₹{fee.examFee}</td>
                  <td>₹{fee.smartClassFee}</td>
                  <td>₹{fee.admissionFee}</td>
                  <td>₹{fee.annualFunctionFee}</td>
                  <td>₹{fee.diaryFee}</td>
                  <td>₹{fee.identityCardFee}</td>
                  <td>₹{fee.panalty}</td>
                  <td>₹{fee.otherCharges}</td>
                   <td style={{ fontWeight: "600" }}>
        ₹{calculateTotalFee(fee)}
      </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No classes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeAssign;
