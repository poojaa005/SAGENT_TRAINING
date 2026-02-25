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

const getAppointmentDateTime = (appointment) => {
  const dateValue = appointment?.appointmentDate || appointment?.date;
  const timeValue = appointment?.appointmentTime || appointment?.time || "00:00:00";
  if (!dateValue) return null;

  const parsed = new Date(`${dateValue}T${String(timeValue).slice(0, 8)}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isUpcomingAppointment = (appointment) => {
  const status = String(appointment?.appointmentStatus || appointment?.status || "").toLowerCase();
  const when = getAppointmentDateTime(appointment);
  if (!when) return false;

  const activeStatus =
    status === "booked" ||
    status === "scheduled" ||
    status === "pending" ||
    status === "confirmed";

  return activeStatus && when.getTime() >= Date.now();
};

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

  const upcomingAppointments = Array.isArray(appointments)
    ? appointments.filter(isUpcomingAppointment)
    : [];

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
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
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
