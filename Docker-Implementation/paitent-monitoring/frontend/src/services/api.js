// src/services/api.js
import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add auth token automatically if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
