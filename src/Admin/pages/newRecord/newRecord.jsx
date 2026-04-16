import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { API_URLS } from "../../../Context/config.js";
import "./newrecord.css";
import BulkUpload from "./BulkUpload.jsx";

/* ✅ Memoized Input Wrapper — prevents re-renders on each keystroke */
const LabeledInput = memo(({ label, children }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
  </div>
));

const NewRecord = () => {
  const [activeRole, setActiveRole] = useState("student");
  const [classes, setClasses] = useState([]);
  const [authorizedPersons, setAuthorizedPersons] = useState([
    { name: "", relation: "", contactNumber: "", note: "" },
  ]);

  const initialFormState = {
    name: "",
    email: "",
    password: "",
    role: "student",
  
    fullName: "",
    studentFatherName: "",
    studentMotherName: "",
    dateOfBirth: "",
    studentclass: "",
    rollNo: "",
    dateOfAdmission: "",
    category: "",
    gender: "",
    contact1: "",
    contact2: "",
    scholarNo: "",
    aadharNo: "",
    samagraId: "",
    penNo: "",
    apaarId: "",
    address: "",
  religion:"",
    guardianName: "",
    guardianRelation: "",
    guardianContact: "",
    guardianEmail: "",
    guardianAddress: "",
  
    fatherName: "",
    motherName: "",
    dateOfJoining: "",
    qualification: "",
    salary: "",
    contact: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  /* ✅ Fetch Class List Once */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_URLS.ASSIGN}/class`);
        setClasses(res.data?.classes || []);
      } catch (err) {
        console.error("❌ Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  /* ✅ Stable Input Handler (useCallback avoids recreation) */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* ✅ Authorized Persons Handlers */
  const handleAuthorizedChange = useCallback((index, field, value) => {
    setAuthorizedPersons((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const addAuthorizedPerson = useCallback(() => {
    setAuthorizedPersons((prev) => [
      ...prev,
      { name: "", relation: "", contactNumber: "", note: "" },
    ]);
  }, []);

  const removeAuthorizedPerson = useCallback((index) => {
    setAuthorizedPersons((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /* ✅ Handle Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        role: activeRole,
        guardian: {
          name: formData.guardianName,
          relation: formData.guardianRelation,
          contactNumber: formData.guardianContact,
          email: formData.guardianEmail,
          address: formData.guardianAddress,
          authorizedPersons,
        },
      };

      const res = await axios.post(`${API_URLS.LOGIN}/register`, payload);

      if (res.data.success) {
        alert(`✅ ${activeRole.toUpperCase()} registered successfully`);
         setFormData(initialFormState);
  setAuthorizedPersons([
    { name: "", relation: "", contactNumber: "", note: "" },
  ]);
      } else {
        alert("❌ " + res.data.message);
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("❌ Something went wrong!");
    }
  };

  /* ✅ Render */
  return (
    <div className="register-container">
      {/* Role Switch Buttons */}
      <div className="toggle-buttons">
        {["student", "teacher", "account", "bulk"].map((role) => (
          <button
            key={role}
            className={activeRole === role ? "active" : ""}
            onClick={() => setActiveRole(role)}
            type="button"
          >
            {role === "student"
              ? "🎓 Student"
              : role === "teacher"
              ? "👨‍🏫 Teacher"
              : role === "account"
              ? "💰 Account"
            :"Bulk"
            }
          </button>
        ))}
      </div>

      <h2>
        {activeRole === "student"
          ? "🎓 Student Registration"
          : activeRole === "teacher"
          ? "👨‍🏫 Teacher Registration"
          : activeRole === "account"
          ? "💰 Account Registration"
        : "Bulk Registration"}
      </h2>

      <form key={activeRole} className="register-form" onSubmit={handleSubmit}>
        {/* COMMON FIELDS */}
{["teacher", "account", "student"].includes(activeRole) && (
  <>
    <LabeledInput label="Username">
      <input
        type="text"
        name="name"
        placeholder="Enter User Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </LabeledInput>

    <LabeledInput label="Email">
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </LabeledInput>

    <LabeledInput label="Password">
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
    </LabeledInput>
  </>
)}


        {/* STUDENT SECTION */}
        {activeRole === "student" && (
          <>
            <LabeledInput label="Full Name">
              <input
                name="fullName"
                value={formData.fullName}
                placeholder="Enter Full Name"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Father's Name">
              <input
                name="studentFatherName"
                value={formData.studentFatherName}
                placeholder="Enter Father's Name"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Mother's Name">
              <input
                name="studentMotherName"
                value={formData.studentMotherName}
                placeholder="Enter Mother's Name"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Date of Birth">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Roll No">
              <input
                name="rollNo"
                value={formData.rollNo}
                placeholder="Enter Roll Number"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Class">
              <select
                name="studentclass"
                value={formData.studentclass}
                onChange={handleChange}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </LabeledInput>


            <LabeledInput label="Category">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>General</option>
                <option>OBC</option>
                <option>ST</option>
                <option>SC</option>
              </select>
            </LabeledInput>

            <LabeledInput label="Gender">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </LabeledInput>
            <LabeledInput label="Religion">
              <input
                name="religion"
                value={formData.religion}
                placeholder="Enter Religion"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Date of Admission">
              <input
                type="date"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
              />
            </LabeledInput>

            {/* Contact Details */}
            <LabeledInput label="Contact No. 1">
              <input
                name="contact1"
                value={formData.contact1}
                placeholder="Enter Contact"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Contact No. 2">
              <input
                name="contact2"
                value={formData.contact2}
                placeholder="Enter Alternate Contact"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Scholar No">
              <input
                name="scholarNo"
                value={formData.scholarNo}
                placeholder="Enter Scholar Number"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Aadhar No">
              <input
                name="aadharNo"
                value={formData.aadharNo}
                placeholder="Enter Aadhar Number"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Samagra ID">
              <input
                name="samagraId"
                value={formData.samagraId}
                placeholder="Enter Samagra ID"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="PEN No">
              <input
                name="penNo"
                value={formData.penNo}
                placeholder="Enter PEN Number"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="APAAR ID">
              <input
                name="apaarId"
                value={formData.apaarId}
                placeholder="Enter APAAR ID"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Address">
              <input
                name="address"
                value={formData.address}
                placeholder="Enter Address"
                onChange={handleChange}
              />
            </LabeledInput>

            {/* Guardian Section */}
            <h3>👨‍👩‍👦 Guardian Details</h3>
            <LabeledInput label="Guardian Name">
              <input
                name="guardianName"
                value={formData.guardianName}
                placeholder="Enter Guardian Name"
                onChange={handleChange}
              />
            </LabeledInput>
     <LabeledInput label="Relation">
              <select
                name="guardianRelation"
                     placeholder="Enter Relation"
                value={formData.guardianRelation}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option> 
                <option>Other</option>
              </select>
            </LabeledInput>
        

            <LabeledInput label="Guardian Contact">
              <input
                name="guardianContact"
                value={formData.guardianContact}
                placeholder="Enter Contact"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Guardian Email">
              <input
                name="guardianEmail"
                value={formData.guardianEmail}
                placeholder="Enter Email"
                onChange={handleChange}
              />
            </LabeledInput>

            <LabeledInput label="Guardian Address">
              <input
                name="guardianAddress"
                value={formData.guardianAddress}
                placeholder="Enter Address"
                onChange={handleChange}
              />
            </LabeledInput>

            {/* Authorized Persons */}
            <h4>🧾 Authorized Persons</h4>
            {authorizedPersons.map((person, index) => (
              <div key={index} className="authorized-person-box">
                <input
                  type="text"
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) =>
                    handleAuthorizedChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Relation"
                  value={person.relation}
                  onChange={(e) =>
                    handleAuthorizedChange(index, "relation", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={person.contactNumber}
                  onChange={(e) =>
                    handleAuthorizedChange(index, "contactNumber", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Note"
                  value={person.note}
                  onChange={(e) =>
                    handleAuthorizedChange(index, "note", e.target.value)
                  }
                />
                {authorizedPersons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthorizedPerson(index)}
                    className="btn-remove"
                  >
                    ❌ Remove
                  </button>
                )}
              </div>
            ))}
          <div>
              <button type="button" className="btn-add" onClick={addAuthorizedPerson}>
              ➕ Add Authorized Person
            </button>
  
        
          </div>
           
          </>
        )}

        {/* TEACHER SECTION */}
        {activeRole === "teacher" && (
          <>
            <LabeledInput label="Full Name">
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Father's Name">
              <input
                name="fatherName"
                    placeholder="Father's Name"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Mother's Name">
              <input
                name="motherName"
                    placeholder="Mother's Name"
                value={formData.motherName}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Date of Birth">
              <input
                type="date"
                name="dateOfBirth"
                    placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Date of Joining">
              <input
                type="date"
                name="dateOfJoining"
                    placeholder="Date of Joining"
                value={formData.dateOfJoining}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Qualification">
              <input
                name="qualification"
                    placeholder="Qualification"
                value={formData.qualification}
                onChange={handleChange}
              />
            </LabeledInput>
          
                  <LabeledInput label="Category">
              <select
                name="category"
                       placeholder="Category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>General</option>
                <option>OBC</option>
                <option>ST</option>
                <option>SC</option>
              </select>
            </LabeledInput>
            <LabeledInput label="Gender">
              <select
                name="gender"
                    placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </LabeledInput>
            <LabeledInput label="Contact No">
              <input
                name="contact"
                    placeholder="Contact No"
                value={formData.contact}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Aadhar No">
              <input
                name="aadharNo"
                    placeholder="Aadhar No"
                value={formData.aadharNo}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Address">
              <input
                name="address"
                    placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </LabeledInput>
            <LabeledInput label="Salary">
              <input
                type="number"
                name="salary"
                    placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
              />
            </LabeledInput>
          </>
        )}

        {/* ACCOUNT SECTION */}
        {activeRole === "account" && (
          <p className="account-note">
            💰 Create an Account user to manage finance and reports.
          </p>
        )}
     {activeRole === "bulk" && (
<>
          <div className="bulk">
     <BulkUpload/>
            </div>

          <p className="account-note">
             Create an Bulk user just few steps.
          </p>
  </>
        )}
        <button type="submit" className="btn-register">
          {activeRole === "student"
            ? "Register Student"
            : activeRole === "teacher"
            ? "Register Teacher"
            : activeRole === "account"
            ? "Register Account"
            : "Bulk Registration"
          }
        </button>

      
      </form>
      
    </div>
  );
};

export default NewRecord;
