import React, { useState } from "react";
import "./ClassAssign.css";
import TeacherAssign from "./TeacherAssign.jsx";
import SubjectAssign from "./SubjectAssign.jsx";
import FeeAssign from "./FeeAssign.jsx";


const ClassAssign = () => {
  const [activeTab, setActiveTab] = useState("class");

  return (
    <div className="assign-container">
      <h2 className="title">🏫 Class Management Panel</h2>

      {/* 🔹 Tabs */}
      <div className="tab-buttons">
        <button
          className={activeTab === "class" ? "active" : ""}
          onClick={() => setActiveTab("class")}
        >
          👨‍🏫 Teacher Assign
        </button>

        <button
          className={activeTab === "subject" ? "active" : ""}
          onClick={() => setActiveTab("subject")}
        >
          📘 Subject Assign
        </button>

        <button
          className={activeTab === "fees" ? "active" : ""}
          onClick={() => setActiveTab("fees")}
        >
          💰 Class Fee Assign
        </button>

    
      </div>

      {/* 🔹 Tab Rendering */}
      {activeTab === "class" && <TeacherAssign />}
      {activeTab === "subject" && <SubjectAssign />}
      {activeTab === "fees" && <FeeAssign />}

    </div>
  );
};

export default ClassAssign;