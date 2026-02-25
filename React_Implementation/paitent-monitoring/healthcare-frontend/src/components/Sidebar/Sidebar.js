// src/components/Sidebar/Sidebar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

const AiIcon = () => (
  <svg
    className="sidebar-link-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 6v6M21 9h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) return null; // hide sidebar if not logged in

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>HealthCare</h2>
      </div>

      <ul className="sidebar-links">
        <li className={location.pathname.includes("dashboard") ? "active" : ""}>
          <Link to={user.role === "PATIENT" ? "/patient-dashboard" : "/doctor-dashboard"}>Dashboard</Link>
        </li>

        <li className={location.pathname.includes("appointments") ? "active" : ""}>
          <Link to="/appointments">Appointments</Link>
        </li>

        <li className={location.pathname.includes("ai-assistant") ? "active" : ""}>
          <Link to="/ai-assistant" className="sidebar-ai-link">
            <AiIcon />
            <span>AI Assistant</span>
          </Link>
        </li>

        {user.role === "PATIENT" && (
          <li className={location.pathname.includes("health-records") ? "active" : ""}>
            <Link to="/health-records">Health Records</Link>
          </li>
        )}

        <li className={location.pathname.includes("profile") ? "active" : ""}>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
