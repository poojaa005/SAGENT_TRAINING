// src/components/Navbar/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">HealthCare App</Link>
      </div>

      <ul className="navbar-links">
        {user && (
          <>
            <li>
              <Link to={user.role === "PATIENT" ? "/patient-dashboard" : "/doctor-dashboard"}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/appointments">Appointments</Link>
            </li>
            {user.role === "PATIENT" && (
              <li>
                <Link to="/health-records">Health Records</Link>
              </li>
            )}
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}

        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
