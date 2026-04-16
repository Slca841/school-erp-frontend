import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.jsx";

import Home from "./pages/Home/Home.jsx";
import Student from "./pages/Student/Student.jsx";
import Teachers from "./pages/Teacher/Teacher.jsx";
import NewRecord from "./pages/newRecord/newRecord.jsx";
import StudentProfile from "./pages/Student/StudentProfile.jsx";
import ClassAssign from "./pages/Teacher/ClassAssign.jsx";
import TeacherComplaints from "./pages/Home/TeacherComplaints.jsx";
import AdminNotice from "./pages/Notice/adminNotice.jsx";
import AdminFeeReminder from "./pages/Remainder/AdminFeeReminder.jsx";
import EventCalendar from "./pages/Home/EventCal.jsx";
import AdminTools from "./pages/AdminTools/AdminTools.jsx";

const AdminDashboard = () => {
  return (
    <div className="dashboard-main" style={{margin:0, padding:0}}>
      <Sidebar />
      <div className="dashboard-content" style={{width:"100%"}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Student />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/assign" element={<ClassAssign />} />
          <Route path="/newRecord" element={<NewRecord />} />
          <Route path="students/student/:id" element={<StudentProfile />} />
          <Route path="/teacher/complaints" element={<TeacherComplaints />} />
          <Route path="/notice" element={<AdminNotice />} />
          <Route path="/feeReminder" element={<AdminFeeReminder />} />
                    <Route path="/adminTools" element={<AdminTools />} />
          <Route path="/eventCalendar" element={<EventCalendar isAdmin={true} />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;