// src/pages/PatientDashboard/PatientDashboard.js
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import HealthRecordCard from "../../components/HealthRecordCard/HealthRecordCard";
import { getAppointments, getPatientRecords } from "../../services/patientService";
import { AuthContext } from "../../context/AuthContext";
import "./PatientDashboard.css";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const { user } = useContext(AuthContext); // Get logged-in patient

  useEffect(() => {
    if (!user) return;
    const patientId = user.id; // Use patient ID from AuthContext
    getAppointments(patientId).then(setAppointments).catch(err => console.error(err));
    getPatientRecords(patientId).then(setRecords).catch(err => console.error(err));
  }, [user]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome Back, Patient!</h2>
            <p>Here is your health summary and upcoming appointments.</p>
          </div>

          {/* Appointments Section */}
          <section className="appointments-section">
            <h3>Upcoming Appointments</h3>
            <div className="appointments-cards">
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <AppointmentCard key={appt.appointmentId} appointment={appt} />
                ))
              ) : (
                <p>No upcoming appointments</p>
              )}
            </div>
          </section>

          {/* Health Records Section */}
          <section className="records-section">
            <h3>Health Records</h3>
            <div className="records-cards">
              {records.length > 0 ? (
                records.map((record) => (
                  <HealthRecordCard key={record.recordId} record={record} />
                ))
              ) : (
                <p>No health records found</p>
              )}
            </div>
          </section>

          {/* Profile Section */}
<section className="profile-section">
  <h3>My Profile</h3>
  <ProfileCard user={user?.raw || user} />
</section>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
