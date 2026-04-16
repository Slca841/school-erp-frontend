import React, { createContext, useContext, useState } from "react";

// 👇 Screens ko import karo
import StudentDashboard from "../Dashboards/StudentDashboard/Pages/StudentFees.jsx";
import AdminDashboard from "../Dashboards/AdminDashboard/AdminDashboard.jsx";
import TeacherDashboard from "../Dashboards/TeacherDashboard/TeacherDashboard.jsx";
import AdminHome from "../Dashboards/AdminDashboard/Pages/AdminHome.jsx"
import AllStudent from "../Dashboards/AdminDashboard/Pages/AllStudent/AllStudent.jsx"
import ApplicationScreen from "../Dashboards/StudentDashboard/Pages/Application.jsx";
import StudentFeesScreen from "../Dashboards/StudentDashboard/Pages/StudentFees.jsx";
import NotificationScreen from "../Dashboards/StudentDashboard/Pages/NotificationScreen.jsx";
import ProfileScreen from "../Dashboards/Common/Profile.jsx";
import AdminNotice from "../Admin/pages/Notice/adminNotice.jsx";

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [studentActiveTab, setStudentActiveTab] = useState("StudentDashboard");
  const [teacherActiveTab, setTeacherActiveTab] = useState("TeacherDashboard");
  const [adminActiveTab, setAdminActiveTab] = useState("AdminDashboard");

  const studentRenderScreen = () => {
    switch (studentActiveTab) {
      case "StudentDashboard":
        return <StudentDashboard />;
      case "Application":
        return <ApplicationScreen />;
      case "StudentFees":
        return <StudentFeesScreen />;
      case "Notification":
        return <NotificationScreen />;
      case "Profile":
        return <ProfileScreen />;
      default:
        return <StudentDashboard />;
    }
  };

  const adminRenderScreen = () =>{
switch (adminActiveTab){
  case "AdminHome":
 return <AdminHome/>;
case "Application":
  return <ApplicationScreen/>;
  case "AllStudent":
    return <AllStudent/>;
    case "Application":
      return <ApplicationScreen/>;
      case "Profile":
      return <ProfileScreen/>;
}
  };
  const teacherRenderScreen = () =>{

  };

  return (
    <TabContext.Provider
      value={{ studentActiveTab, setStudentActiveTab, studentRenderScreen, teacherActiveTab, setTeacherActiveTab,teacherRenderScreen, adminActiveTab, setAdminActiveTab,adminRenderScreen }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => useContext(TabContext);
