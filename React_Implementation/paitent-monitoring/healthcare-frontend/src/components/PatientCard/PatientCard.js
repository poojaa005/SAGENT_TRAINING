// src/components/PatientCard/PatientCard.js
import React from "react";
import "./PatientCard.css";

const PatientCard = ({ patient }) => {
  return (
    <div className="patient-card">
      <h4>{patient.name}</h4>
      <p>Age: {patient.age}</p>
      <p>Gender: {patient.gender}</p>
      <p>Contact: {patient.contactNo}</p>
      <p>Email: {patient.email}</p>
    </div>
  );
};

export default PatientCard;
