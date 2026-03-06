// src/components/HealthRecordCard/HealthRecordCard.js
import React from "react";
import "./HealthRecordCard.css";

const HealthRecordCard = ({ record }) => {
  const recordDate = record?.recordDate || record?.date || "N/A";
  const heartRate = record?.heartRate ?? "N/A";
  const bloodPressure = record?.bloodPressure || "N/A";
  const temperature = record?.temperature ?? "N/A";
  const oxygenLevel = record?.oxygenLevel ?? "N/A";

  return (
    <div className="healthrecord-card">
      <h4>Health Vitals</h4>
      <p>Date: {recordDate}</p>
      <p>Heart Rate: {heartRate}</p>
      <p>Blood Pressure: {bloodPressure}</p>
      <p>Temperature: {temperature}</p>
      <p>Oxygen Level: {oxygenLevel}</p>
    </div>
  );
};

export default HealthRecordCard;
