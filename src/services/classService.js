import axios from "axios";
import { API_URLS } from "../Context/config.js";

// ✅ Get all classes
export const fetchClasses = async () => {
  try {
    const res = await axios.get(`${API_URLS.ASSIGN}/class`);
    return res.data.success ? res.data.classes : [];
  } catch (err) {
    console.error("Error fetching classes", err);
    return [];
  }
};

// ✅ Get students of a class
export const fetchClassStudents = async (classId) => {
  try {
    const res = await axios.get(`${API_URLS.ASSIGN}/class/${classId}/students`);
    return res.data.success ? res.data.students : [];
  } catch (err) {
    console.error("Error fetching class students", err);
    return [];
  }
};
