// src/pages/Home/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Healthcare Portal</h1>
          <p>Manage appointments, view health records, and connect with your doctors seamlessly.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://img.freepik.com/free-vector/medical-healthcare-concept-illustration_114360-2706.jpg?w=740&t=st=1684642716~exp=1684643316~hmac=14ebdf374db30b08c7e0f64be5481a76b1b52c4c2f5c8d3b6db5b1f6f0e945ad"
            alt="Healthcare"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-cards">
          <div className="feature-card">
            <h3>Patient Dashboard</h3>
            <p>Access your health records, view appointments, and communicate with your doctor.</p>
          </div>
          <div className="feature-card">
            <h3>Doctor Dashboard</h3>
            <p>Manage patients, appointments, and update health records efficiently.</p>
          </div>
          <div className="feature-card">
            <h3>Secure & Reliable</h3>
            <p>Your data is protected and confidential. Access it anytime, anywhere.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;