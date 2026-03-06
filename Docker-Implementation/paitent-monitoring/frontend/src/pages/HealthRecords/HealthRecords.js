// src/pages/HealthRecords/HealthRecords.js
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import HealthRecordCard from "../../components/HealthRecordCard/HealthRecordCard";
import { getPatientRecords } from "../../services/patientService";
import { AuthContext } from "../../context/AuthContext";
import "./HealthRecords.css";

const HealthRecords = () => {
  const { user } = useContext(AuthContext); // Get logged-in patient
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!user) return;

    getPatientRecords(user.id)
      .then(setRecords)
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="healthrecords-page">
      <Navbar />
      <div className="records-container">
        <h2>My Health Records</h2>
        {records.length > 0 ? (
          <div className="records-cards">
            {records.map((record) => (
              <HealthRecordCard key={record.recordId} record={record} />
            ))}
          </div>
        ) : (
          <p>No health records available</p>
        )}
      </div>
    </div>
  );
};

export default HealthRecords;
