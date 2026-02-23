// src/components/Sidebar/Sidebar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

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
          <Link to={user.role === "PATIENT" ? "/patient-dashboard" : "/doctor-dashboard"}>
            Dashboard
          </Link>
        </li>

        <li className={location.pathname.includes("appointments") ? "active" : ""}>
          <Link to="/appointments">Appointments</Link>
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