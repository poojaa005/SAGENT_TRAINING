// src/components/DoctorCard/DoctorCard.js
import React from "react";
import "./DoctorCard.css";

const DoctorCard = ({ doctor }) => {
  const name = doctor?.doctorName || doctor?.name || "N/A";
  const specialization = doctor?.specialization || "N/A";
  const contact = doctor?.contactNo || doctor?.contact_no || "N/A";
  const email = doctor?.doctorEmail || doctor?.email || "N/A";

  return (
    <div className="doctor-card">
      <h4>{name}</h4>
      <p>Specialization: {specialization}</p>
      <p>Contact: {contact}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default DoctorCard;
