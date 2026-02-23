// src/pages/DoctorDashboard/DoctorDashboard.js
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import AppointmentCard from "../../components/AppointmentCard/AppointmentCard";
import { getDoctorPatients, getDoctorAppointments } from "../../services/doctorService";
import { AuthContext } from "../../context/AuthContext";
import "./DoctorDashboard.css";
import PatientCard from "../../components/PatientCard/PatientCard";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    const doctorId = user.id; // Use logged-in doctor ID from AuthContext
    getDoctorPatients(doctorId).then(setPatients).catch(err => console.error(err));
    getDoctorAppointments(doctorId).then(setAppointments).catch(err => console.error(err));
  }, [user]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome Back, Doctor!</h2>
            <p>Manage your patients and upcoming appointments.</p>
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

          {/* Patients Section */}
          <section className="patients-section">
            <h3>My Patients</h3>
            <div className="patients-cards">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <PatientCard key={patient.patientId} patient={patient} />
                ))
              ) : (
                <p>No patients assigned</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
