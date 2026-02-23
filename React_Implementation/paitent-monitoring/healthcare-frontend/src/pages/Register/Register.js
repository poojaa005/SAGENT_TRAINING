// src/pages/Register/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient, registerDoctor } from "../../services/authService";
import Navbar from "../../components/Navbar/Navbar";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("PATIENT"); // default role
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      if (role === "PATIENT") {
        await registerPatient({ name, email, password });
      } else {
        await registerDoctor({ name, email, password });
      }
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <Navbar />

      <div className="register-container">
        <h2>Register</h2>

        {/* Role Tabs */}
        <div className="role-tabs">
          <button
            className={role === "PATIENT" ? "active" : ""}
            onClick={() => setRole("PATIENT")}
          >
            Patient
          </button>
          <button
            className={role === "DOCTOR" ? "active" : ""}
            onClick={() => setRole("DOCTOR")}
          >
            Doctor
          </button>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
