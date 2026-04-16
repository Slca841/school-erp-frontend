import React, { useState } from "react";
import axios from "axios";
import { API_URLS } from "../../Context/config.js";
import "./Login.css";

const Login = () => {
  /* ================= LOGIN STATES ================= */
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  /* ================= FORGOT / CREATE STATES ================= */
  const [showFlow, setShowFlow] = useState(false);
  const [mode, setMode] = useState(""); // "reset" | "create"
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return alert("Fill all fields");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URLS.LOGIN}/login`, {
        identifier,
        password,
        role,
      });

      const data = res.data;
      if (!data.success) return alert(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);                          
      localStorage.setItem("userName", data.name);
localStorage.setItem("userId", data.user._id); 
      if (data.role === "admin") window.location.href = "/admin/";
      else if (data.role === "account") window.location.href = "/account/";
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP ================= */
  const sendOtp = async () => {
    try {
      if (!email) return alert("Email required");

      const res = await axios.post(`${API_URLS.SECURE}/send-otp`, { email });

      if (res.data.success) {
        setStep(2);
        alert("OTP sent to email");
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP send failed");
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otp) return alert("OTP required");

      const res = await axios.post(`${API_URLS.SECURE}/verify-otp`, { otp });

      if (res.data.success) {
        setStep(3);
        alert("OTP verified");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = async () => {
    try {
      if (!newPassword) return alert("New password required");

      const res = await axios.post(`${API_URLS.SECURE}/reset-password`, {
        newPassword,
      });

      if (res.data.success) {
        alert("Password reset successful");
        resetAll();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  /* ================= CREATE ADMIN ================= */
  const createAdmin = async () => {
    try {
      const res = await axios.post(
        `${API_URLS.SECURE}/create-admin`,
        adminForm
      );

      if (res.data.success) {
        alert("Admin created successfully");
        resetAll();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Create admin failed");
    }
  };

  const resetAll = () => {
    setShowFlow(false);
    setMode("");
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setAdminForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔐 School ERP Login</h2>

        {/* ================= LOGIN FORM ================= */}
        {!showFlow && (
          <>
            <form onSubmit={handleLogin}>
              <input
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="account">Account</option>
              </select>

              <button disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-links">
              <span
                onClick={() => {
                  setShowFlow(true);
                  setMode("reset");
                  setStep(1);
                }}
              >
                Forgot Password?
              </span>

              <span
                onClick={() => {
                  setShowFlow(true);
                  setMode("create");
                  setStep(1);
                }}
              >
                Create Admin
              </span>
            </div>
          </>
        )}

        {/* ================= OTP + ACTION FLOW ================= */}
        {showFlow && (
          <>
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <p className="info-text">
                  Enter authorized email to continue
                </p>
                <input
                  placeholder="Authorized Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={sendOtp}>Send OTP</button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <p className="info-text">Enter OTP sent to email</p>
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={verifyOtp}>Verify OTP</button>
              </>
            )}

            {/* STEP 3 RESET */}
            {step === 3 && mode === "reset" && (
              <>
                <p className="info-text">Reset Admin Password</p>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={resetPassword}>Reset Password</button>
              </>
            )}

            {/* STEP 3 CREATE */}
            {step === 3 && mode === "create" && (
              <>
                <p className="info-text">Create Admin</p>
                <input
                  placeholder="Admin Name"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, name: e.target.value })
                  }
                />
                <input
                  placeholder="Admin Email"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                />
                <button onClick={createAdmin}>Create Admin</button>
              </>
            )}

            <p className="back-link" onClick={resetAll}>
              ← Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
