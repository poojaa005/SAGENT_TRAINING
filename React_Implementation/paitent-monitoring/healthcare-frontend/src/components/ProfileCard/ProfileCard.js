// src/components/ProfileCard/ProfileCard.js
import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ user }) => {
  if (!user) return <p>No profile data</p>;

  const name = user.name || user.doctorName || "N/A";
  const age = user.age ?? "N/A";
  const gender = user.gender || "N/A";
  const email = user.email || user.doctorEmail || "N/A";
  const contact = user.contactNo || user.contact_no || "N/A";

  return (
    <div className="profile-card">
      <h4>{name}</h4>
      <p>Age: {age}</p>
      <p>Gender: {gender}</p>
      <p>Email: {email}</p>
      <p>Contact: {contact}</p>
    </div>
  );
};

export default ProfileCard;
