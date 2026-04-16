import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ClassFeeReadOnly.css";
import { API_URLS } from "../../Context/config.js";

const ClassFeeReadOnly = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
const CLASS_ORDER = [
  "Nursery",
  "LKG",
  "UKG",
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
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      // ✅ existing GET API (same jo admin use karta hai)
      const res = await axios.get(`${API_URLS.GET_STUDENTS}/get-class-fees`);
 if (res.data?.success) {
  const sortedFees = [...res.data.data].sort((a, b) => {
    return (
      CLASS_ORDER.indexOf(a.className) -
      CLASS_ORDER.indexOf(b.className)
    );
  });

  setFees(sortedFees);
}

    } catch (err) {
      console.error("Fee load error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading fees...</p>;

  return (
    <div className="account-fee-page">
  <div className="fee-container">
        <h2>💰 Class Fee Structure</h2>

      <table className="fee-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Yearly</th>
            <th>Exam</th>
            <th>Admission</th>
            <th>Smart Class</th>
            <th>Annual</th>
            <th>Diary</th>
            <th>ID Card</th>
            <th>Penalty</th>
            <th>Other</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((f) => (
            <tr key={f._id}>
              <td><b>{f.className}</b></td>
              <td>₹{f.yearlyFee || 0}</td>
              <td>₹{f.examFee || 0}</td>
              <td>₹{f.admissionFee || 0}</td>
              <td>₹{f.smartClassFee || 0}</td>
              <td>₹{f.annualFunctionFee || 0}</td>
              <td>₹{f.diaryFee || 0}</td>
              <td>₹{f.identityCardFee || 0}</td>
              <td>₹{f.panalty || 0}</td>
              <td>₹{f.otherCharges || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
  </div>
    </div>
  );
};

export default ClassFeeReadOnly;
