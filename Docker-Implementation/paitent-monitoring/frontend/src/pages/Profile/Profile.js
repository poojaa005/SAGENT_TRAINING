// src/pages/Profile/Profile.js
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { getPatientProfile, updatePatientProfile } from "../../services/patientService";
import { getDoctorProfile, updateDoctorProfile } from "../../services/doctorService";
import { AuthContext } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    specialization: "",
  });

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        if (user.role === "DOCTOR") {
          const data = await getDoctorProfile(user.id);
          setProfile({
            name: data.doctorName || "",
            email: data.doctorEmail || "",
            phone: "",
            age: "",
            specialization: data.specialization || "",
          });
        } else {
          const data = await getPatientProfile(user.id);
          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.contactNo || "",
            age: data.age || "",
            specialization: "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
        if (user.role === "DOCTOR") {
          const payload = {
            doctorName: profile.name,
            doctorEmail: profile.email,
            specialization: profile.specialization,
            doctorPassword: user?.raw?.doctorPassword ?? null,
          };
          const updated = await updateDoctorProfile(user.id, payload);
          setProfile((prev) => ({
            ...prev,
            name: updated.doctorName || prev.name,
            email: updated.doctorEmail || prev.email,
            specialization: updated.specialization || prev.specialization,
          }));
          setUser((prev) => ({
            ...prev,
            name: updated.doctorName,
            email: updated.doctorEmail,
            raw: updated,
          }));
        } else {
          const payload = {
            name: profile.name,
            email: profile.email,
            contactNo: profile.phone,
            age: Number(profile.age) || 0,
            gender: user?.raw?.gender || "",
            password: user?.raw?.password || "",
          };
          const updated = await updatePatientProfile(user.id, payload);
        setProfile((prev) => ({
          ...prev,
          name: updated.name || prev.name,
          email: updated.email || prev.email,
            phone: updated.contactNo || prev.phone,
            age: updated.age || prev.age,
          }));
          setUser((prev) => ({
            ...prev,
            name: updated.name,
            email: updated.email,
            raw: updated,
          }));
        }

      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h2>My Profile</h2>
        <form className="profile-form" onSubmit={handleUpdate}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={profile.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleChange}
            required
          />
          {user?.role === "PATIENT" && (
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={profile.phone}
              onChange={handleChange}
            />
          )}
          {user?.role === "PATIENT" && (
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={profile.age}
              onChange={handleChange}
            />
          )}
          {user?.role === "DOCTOR" && (
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={profile.specialization}
              onChange={handleChange}
            />
          )}
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
