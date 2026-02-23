// src/pages/Login/Login.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser as loginRequest } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [role, setRole] = useState("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginRequest({ email, password, role });
      loginUser(data.user, data.token);

      if (role === "PATIENT") navigate("/patient-dashboard");
      else navigate("/doctor-dashboard");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">
        <h2>Login</h2>

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

        <form className="login-form" onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
