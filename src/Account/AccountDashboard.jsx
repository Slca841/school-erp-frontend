import React from "react";
import { Routes, Route } from "react-router-dom";
import Student from "../Admin/pages/Student/Student.jsx";
import AccountHome from "./pages/AccountHome.jsx";
import StudentProfile from "../Admin/pages/Student/StudentProfile.jsx"; // ✅ import same component
import AdminFeeReminder from "../Admin/pages/Remainder/AdminFeeReminder.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import ClassFeeReadOnly from "../Account/pages/ClassFeeReadOnly.jsx"

const AccountDashboard = () => {
  return (
    <div className="dashboard-main">
          <Navbar/>
      <div style={{ width: "100%" }}>
        <Routes>
          {/* Account Home (student list) */}
          <Route path="/" element={<AccountHome />} />

          {/* ✅ Add this route for student profile */}
                  <Route path="/students" element={<Student />} />
          <Route path="students/student/:id" element={<StudentProfile />} />
            <Route path="/feeReminder" element={<AdminFeeReminder />} />
              <Route path="/classFee" element={<ClassFeeReadOnly />} />
        </Routes>
      </div>
    </div>
  );
};

export default AccountDashboard;