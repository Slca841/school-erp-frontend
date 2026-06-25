import axios from "axios";
import { API_URLS } from "../Context/config.js";

// 🔹 Get Single Student
export const fetchStudent = async (id) => {
  try {
    const res = await axios.get(`${API_URLS.GET_STUDENTS}/student/${id}`);
    if (res.data.success) return res.data.student;
    return null;
  } catch (err) {
    console.error("Error fetching student", err);
    return null;
  }
};

// 🔹 Save Profile
// 🔹 Save Profile
export const saveStudentProfile = async (id, studentData) => {
  try {
    const res = await axios.put(
      `${API_URLS.GET_STUDENTS}/student/${id}`, 
      studentData   // ✅ payload send karna zaruri hai
    );
    return res.data.success ? res.data.student : null;
  } catch (err) {
    console.error("Error saving student profile", err);
    return null;
  }
};

// 🔹 Add Payment
export const addPayment = async (paymentData) => {
  try {
    const res = await axios.post(`${API_URLS.PAYMENT}/add`, paymentData);
    return res.data.success;
  } catch (err) {
    console.error("Error adding payment", err);
    return false;
  }
};

// 🔹 Delete Payment
export const deletePayment = async (paymentId) => {
  try {
    const res = await axios.delete(`${API_URLS.PAYMENT}/${paymentId}`);
    return res.data.success;
  } catch (err) {
    console.error("Error deleting payment", err);
    return false;
  }
};

// 🔹 Save Other Fees
export const saveOtherFees = async (id, fees) => {
  try {
    console.log("Sending Fees:", fees);

    const res = await axios.put(
      `${API_URLS.GET_STUDENTS}/other/${id}`,
      fees
    );

    console.log("Response:", res.data);

    return res.data.success ? res.data.fees : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 🔹 Approve TC (UPDATED)
export const approveTC = async (id, payload) => {
  try {
    const res = await axios.put(
      `${API_URLS.GET_STUDENTS}/tc/${id}`,
      payload 
    );

    return res.data.success ? res.data.tc : null;
  } catch (err) {
    console.error("Error approving TC", err);
    alert(err?.response?.data?.message || "TC approval failed");
    return null;
  }
};



// 🔹 Fetch single TC of student
export const fetchTC = async (id) => {
  try {
    const res = await axios.get(`${API_URLS.GET_STUDENTS}/tc/${id}`);
    return res.data.success ? res.data.tc : null;
  } catch (err) {
    console.error("Error fetching TC", err);
    return null;
  }
};

// 🔹 Fetch all TC list
export const fetchTCList = async () => {
  try {
    const res = await axios.get(`${API_URLS.GET_STUDENTS}/tc`);
    return res.data.success ? res.data.tcs : [];
  } catch (err) {
    console.error("Error fetching TC list", err);
    return [];
  }
};

// 🔹 Fetch TC history for one student
export const fetchStudentTCs = async (id) => {
  try {
    const res = await axios.get(`${API_URLS.GET_STUDENTS}/singletc/${id}`);
    return res.data.success ? res.data.tcs : [];
  } catch (err) {
    console.error("Error fetching TC history", err);
    return [];
  }
};
