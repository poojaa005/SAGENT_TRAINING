// src/services/authService.js
import { api } from "./api";

const normalizeRole = (role) => (role || "PATIENT").toUpperCase();
const normalizeEmail = (value) => (value || "").trim().toLowerCase();

const buildSessionUser = (role, rawUser) => {
  if (role === "DOCTOR") {
    return {
      id: rawUser.doctorId,
      role: "DOCTOR",
      name: rawUser.doctorName,
      email: rawUser.doctorEmail,
      raw: rawUser,
    };
  }

  return {
    id: rawUser.patientId,
    role: "PATIENT",
    name: rawUser.name,
    email: rawUser.email,
    raw: rawUser,
  };
};

const fetchUserByRoleAndEmail = async (role, email) => {
  const normalizedRole = normalizeRole(role);
  const cleanEmail = normalizeEmail(email);

  const searchEndpoint =
    normalizedRole === "DOCTOR"
      ? `/doctors/search/email/${encodeURIComponent(cleanEmail)}`
      : `/patients/search/email/${encodeURIComponent(cleanEmail)}`;

  const searchResponse = await api.get(searchEndpoint);
  if (searchResponse.data) {
    return searchResponse.data;
  }

  // Fallback for case/format mismatch in backend search methods.
  const listEndpoint = normalizedRole === "DOCTOR" ? "/doctors" : "/patients";
  const listResponse = await api.get(listEndpoint);
  const users = Array.isArray(listResponse.data) ? listResponse.data : [];

  return (
    users.find((item) => {
      const itemEmail =
        normalizedRole === "DOCTOR" ? item.doctorEmail : item.email;
      return normalizeEmail(itemEmail) === cleanEmail;
    }) || null
  );
};

const emailExistsForRole = async (role, email) => {
  const normalizedRole = normalizeRole(role);
  const cleanEmail = normalizeEmail(email);

  const endpoint =
    normalizedRole === "DOCTOR"
      ? `/doctors/search/email/${encodeURIComponent(cleanEmail)}`
      : `/patients/search/email/${encodeURIComponent(cleanEmail)}`;

  const response = await api.get(endpoint);
  return !!response.data;
};

// Login using existing backend search endpoints
export const loginUser = async ({ email, password, role }) => {
  try {
    const normalizedRole = normalizeRole(role);
    const cleanPassword = (password || "").trim();
    const user = await fetchUserByRoleAndEmail(normalizedRole, email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const storedPassword =
      normalizedRole === "DOCTOR" ? user.doctorPassword : user.password;

    if (!storedPassword) {
      throw new Error("Account password is missing in DB. Update the doctor password and try again.");
    }

    if (storedPassword !== cleanPassword) {
      throw new Error("Invalid email or password");
    }

    const sessionUser = buildSessionUser(normalizedRole, user);
    const token = `local-${normalizedRole.toLowerCase()}-${sessionUser.id}-${Date.now()}`;

    return {
      token,
      user: sessionUser,
    };
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw new Error("User not found");
    }

    if (err.response) {
      const msg =
        err.response.data && err.response.data.message
          ? err.response.data.message
          : `Request failed with status ${err.response.status}`;
      throw new Error(msg);
    }

    throw new Error(err.message || "Login failed");
  }
};

// Register patient
export const registerPatient = async (patientData) => {
  try {
    const cleanEmail = normalizeEmail(patientData.email);
    const exists = await emailExistsForRole("PATIENT", cleanEmail);
    if (exists) {
      throw new Error("Email already registered. Please login or use another email.");
    }

    const payload = {
      name: (patientData.name || "").trim(),
      email: cleanEmail,
      password: (patientData.password || "").trim(),
      age: patientData.age ?? 0,
      contactNo: patientData.contactNo ?? "",
      gender: patientData.gender ?? "",
    };

    const response = await api.post("/patients", payload);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 500) {
      throw new Error("Registration failed: email may already exist.");
    }
    if (err.response) {
      throw new Error(`Registration failed with status ${err.response.status}`);
    }
    throw new Error(err.message || "Registration failed");
  }
};

// Register doctor
export const registerDoctor = async (doctorData) => {
  try {
    const cleanEmail = normalizeEmail(doctorData.email);
    const exists = await emailExistsForRole("DOCTOR", cleanEmail);
    if (exists) {
      throw new Error("Email already registered. Please login or use another email.");
    }

    const payload = {
      doctorName: (doctorData.name || "").trim(),
      doctorEmail: cleanEmail,
      doctorPassword: (doctorData.password || "").trim(),
      specialization: doctorData.specialization ?? "General",
    };

    const response = await api.post("/doctors", payload);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 500) {
      throw new Error("Registration failed: email may already exist.");
    }
    if (err.response) {
      throw new Error(`Registration failed with status ${err.response.status}`);
    }
    throw new Error(err.message || "Registration failed");
  }
};
