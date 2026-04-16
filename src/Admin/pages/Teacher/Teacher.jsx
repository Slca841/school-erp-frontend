import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import "./Teacher.css";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherComplaints, setTeacherComplaints] = useState([]);
  const [complaintModal, setComplaintModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
const [editMode, setEditMode] = useState(false);
const [accountModal, setAccountModal] = useState(false);
const [accounts, setAccounts] = useState([]);
const [loadingAccounts, setLoadingAccounts] = useState(false);

const fetchAccounts = async () => {
  try {
    setLoadingAccounts(true);
    const res = await axios.get(`${API_URLS.TEACHER}/accounts`);
    if (res.data.success) {
      setAccounts(res.data.accounts);
      setAccountModal(true);
    }
  } catch (err) {
    alert("❌ Failed to fetch account users");
  } finally {
    setLoadingAccounts(false);
  }
};

  useEffect(() => {
    fetchTeachers();
  }, []);
const updateTeacher = async () => {
  if (!selectedTeacher) return;

  try {
    // ✅ build exact payload backend expects
    const payload = {
      // USER TABLE (login)
      name: selectedTeacher.userId?.name || "",
      email: selectedTeacher.userId?.email || "",
      password: selectedTeacher.userId?.originalPassword || "",

      // TEACHER TABLE
      fullName: selectedTeacher.fullName || "",
      fatherName: selectedTeacher.fatherName || "",
      motherName: selectedTeacher.motherName || "",
      contact: selectedTeacher.contact || "",
      category: selectedTeacher.category || "",
      gender: selectedTeacher.gender || "",
      address: selectedTeacher.address || "",
      qualification: selectedTeacher.qualification || "",
      salary: selectedTeacher.salary || 0,
      dateOfBirth: selectedTeacher.dateOfBirth || null,
      dateOfJoining: selectedTeacher.dateOfJoining || null,
    };

    const res = await axios.put(
      `${API_URLS.TEACHER}/${selectedTeacher._id}`,
      payload
    );

    if (!res.data.success) {
      alert(res.data.message || "Update failed");
      return;
    }

    alert("✅ Teacher updated successfully");

    // ✅ live update list
    setTeachers((prev) =>
      prev.map((t) =>
        t._id === selectedTeacher._id
          ? { ...t, ...res.data.teacher }
          : t
      )
    );

    setDetailModal(false);
    setEditMode(false);

  } catch (err) {
    console.error("Update teacher error:", err);
    alert("❌ Error updating teacher");
  }
};



  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URLS.TEACHER}/`);
      if (res.data.success) {
        setTeachers(res.data.teachers.reverse());
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const fetchComplaints = async (teacherId) => {
    try {
      const res = await axios.get(`${API_URLS.COMPLAINT}/complaints/${teacherId}`);
      setTeacherComplaints(res.data.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this teacher?")) return;
  try {
    const res = await axios.delete(`${API_URLS.TEACHER}/${id}`);
    if (res.data.success) {
      alert("Teacher deleted successfully");
      
      // 👇 turant state se hatao
      setTeachers((prev) => prev.filter((t) => t._id !== id));
      
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    alert("Error deleting teacher: " + err.message);
  }
};

  return (
    <div className="teacher-container">
     <div className="teacher-header">
  <h2 className="title">👨‍🏫 Teacher List</h2>

 
  <button
    className="account-view-btn"
    onClick={fetchAccounts}
  >
    💰 Account View
  </button>
</div>


      <table className="teacher-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Salary</th>
            <th>Complaints</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map((t) => (
              <tr key={t._id}>
                <td>{t.fullName || t.userId?.name}</td>
                <td>{t.userId?.email}</td>
                <td>{t.contact || "N/A"}</td>
                <td>₹{t.salary || 0}</td>
                <td>
                  <span
                    className="complaint-count"
                    onClick={() => {
                      setSelectedTeacher(t);
                      fetchComplaints(t._id);
                      setComplaintModal(true);
                    }}
                  >
                    {t.complaintCount} complaints
                  </span>
                </td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => {
                      setSelectedTeacher(t);
                      fetchComplaints(t._id);
                      setDetailModal(true);
                    }}
                  >
                    View
                  </button>
               <button
                    className="deleteBtn"
                    onClick={() => handleDelete(t._id)}
                  >
                    <p>Delete</p>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Teachers Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Complaint Modal */}
      {complaintModal && selectedTeacher && (
        <div>
          <div
            className="modal-overlay"
            onClick={() => setComplaintModal(false)}
          />
           
          <div className="modal" style={{backgroundColor:"#252522c9"}}>
            <h3 style={{color:"white"}}>📢 Complaints for {selectedTeacher.fullName}</h3>
            {teacherComplaints.length > 0 ? (
              <ul className="complaints-list">
                {teacherComplaints.map((c) => (
                  <li key={c._id} className="complaint-item">
                    <p className="complaints-title">
                      ({c.studentId?.studentclass}) → {c.complaint}
                    </p>
                    <span
                      className={`status-badge ${
                        c.status === "Resolved" ? "resolved" : "pending"
                      }`}
                    >
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No complaints for this teacher</p>
            )}
            <button
              className="close-btn"
              onClick={() => setComplaintModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
   {detailModal && selectedTeacher && (
  <div className="modal">
    <h3>📋 Teacher Details</h3>

    {/* USERNAME */}
    <p>
      <b>Username:</b>
      {!editMode ? (
        selectedTeacher.userId?.name
      ) : (
        <input
          type="text"
          value={selectedTeacher.userId?.name}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              userId: { ...selectedTeacher.userId, name: e.target.value },
            })
          }
        />
      )}
    </p>

    {/* PASSWORD */}
    <p>
      <b>Password:</b>
      {!editMode ? (
        selectedTeacher.userId?.originalPassword
      ) : (
      <input
  type="text"
  placeholder="New password (optional)"
  value={selectedTeacher.userId?.originalPassword || ""}
  onChange={(e) =>
    setSelectedTeacher({
      ...selectedTeacher,
      userId: {
        ...selectedTeacher.userId,
        originalPassword: e.target.value,
      },
    })
  }
/>

      )}
    </p>

    {/* FULL NAME */}
    <p>
      <b>Full Name:</b>
      {!editMode ? (
        selectedTeacher.fullName
      ) : (
        <input
          type="text"
          value={selectedTeacher.fullName}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              fullName: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* FATHER NAME */}
    <p>
      <b>Father Name:</b>
      {!editMode ? (
        selectedTeacher.fatherName
      ) : (
        <input
          type="text"
          value={selectedTeacher.fatherName}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              fatherName: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* MOTHER NAME */}
    <p>
      <b>Mother Name:</b>
      {!editMode ? (
        selectedTeacher.motherName
      ) : (
        <input
          type="text"
          value={selectedTeacher.motherName}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              motherName: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* EMAIL */}
    <p>
      <b>Email:</b>
      {!editMode ? (
        selectedTeacher.userId?.email
      ) : (
        <input
          type="email"
          value={selectedTeacher.userId?.email}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              userId: { ...selectedTeacher.userId, email: e.target.value },
            })
          }
        />
      )}
    </p>

    {/* CONTACT */}
    <p>
      <b>Contact:</b>
      {!editMode ? (
        selectedTeacher.contact
      ) : (
        <input
          type="text"
          value={selectedTeacher.contact}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              contact: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* CATEGORY */}
    <p>
      <b>Category:</b>
      {!editMode ? (
        selectedTeacher.category
      ) : (
        <input
          type="text"
          value={selectedTeacher.category}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              category: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* GENDER */}
    <p>
      <b>Gender:</b>
      {!editMode ? (
        selectedTeacher.gender
      ) : (
        <input
          type="text"
          value={selectedTeacher.gender}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              gender: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* ADDRESS */}
    <p>
      <b>Address:</b>
      {!editMode ? (
        selectedTeacher.address
      ) : (
        <input
          type="text"
          value={selectedTeacher.address}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              address: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* QUALIFICATION */}
    <p>
      <b>Qualification:</b>
      {!editMode ? (
        selectedTeacher.qualification
      ) : (
        <input
          type="text"
          value={selectedTeacher.qualification}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              qualification: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* SALARY */}
    <p>
      <b>Salary:</b>
      {!editMode ? (
        selectedTeacher.salary
      ) : (
        <input
          type="number"
          value={selectedTeacher.salary}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              salary: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* DOB */}
    <p>
      <b>DOB:</b>
      {!editMode ? (
        new Date(selectedTeacher.dateOfBirth).toDateString()
      ) : (
        <input
          type="date"
          value={selectedTeacher.dateOfBirth?.slice(0, 10)}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              dateOfBirth: e.target.value,
            })
          }
        />
      )}
    </p>

    {/* JOINING DATE */}
    <p>
      <b>Joining:</b>
      {!editMode ? (
        new Date(selectedTeacher.dateOfJoining).toDateString()
      ) : (
        <input
          type="date"
          value={selectedTeacher.dateOfJoining?.slice(0, 10)}
          onChange={(e) =>
            setSelectedTeacher({
              ...selectedTeacher,
              dateOfJoining: e.target.value,
            })
          }
        />
      )}
    </p>

    <p>
      <b>📢 Complaints:</b> {teacherComplaints.length}
    </p>

    {/* BUTTONS */}
    {!editMode ? (
      <button
        className="edit-btn"
        onClick={() => setEditMode(true)}
      >
        ✏️ Edit
      </button>
    ) : (
      <button
        className="save-btn"
        onClick={updateTeacher}
      >
        💾 Save
      </button>
    )}

    <button className="close-btn" onClick={() => { setDetailModal(false); setEditMode(false); }}>
      Close
    </button>
  </div>
)}
{accountModal && (
  <>
    {/* Overlay */}
    <div
      className="modal-overlay"
      onClick={() => setAccountModal(false)}
    />

    {/* Modal */}
    <div className="modal" style={{width:"550px"}}>
      <h3>💰 Account Users</h3>

      {loadingAccounts ? (
        <p>Loading...</p>
      ) : accounts.length > 0 ? (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
            
            </tr>
          </thead>
          <tbody>
            {accounts.map((a, i) => (
              <tr key={a._id}>
                <td>{i + 1}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.originalPassword}</td>
           
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No account users found</p>
      )}

      <button
        className="close-btn"
        onClick={() => setAccountModal(false)}
      >
        Close
      </button>
    </div>
  </>
)}


    </div>
  );
};

export default Teachers;