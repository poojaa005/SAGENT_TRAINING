// src/components/AppointmentCard/AppointmentCard.js
import React from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment }) => {
  const doctorName = appointment?.doctor?.doctorName || appointment?.doctorName || "N/A";
  const patientName = appointment?.patient?.name || appointment?.patientName || "N/A";
  const date = appointment?.appointmentDate || appointment?.date || "N/A";
  const time = appointment?.appointmentTime || appointment?.time || "N/A";
  const status = appointment?.appointmentStatus || appointment?.status || "N/A";

  return (
    <div className="appointment-card">
      <h4>Doctor: {doctorName}</h4>
      <p>Patient: {patientName}</p>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p>Status: {status}</p>
    </div>
  );
};

export default AppointmentCard;
