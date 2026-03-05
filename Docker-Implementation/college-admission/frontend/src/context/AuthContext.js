import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(() => {
    const s = localStorage.getItem('student');
    return s ? JSON.parse(s) : null;
  });
  const [officer, setOfficer] = useState(() => {
    const o = localStorage.getItem('officer');
    return o ? JSON.parse(o) : null;
  });

  const loginStudent = (data) => {
    setStudent(data);
    localStorage.setItem('student', JSON.stringify(data));
  };

  const loginOfficer = (data) => {
    setOfficer(data);
    localStorage.setItem('officer', JSON.stringify(data));
  };

  const logout = () => {
    setStudent(null);
    setOfficer(null);
    localStorage.removeItem('student');
    localStorage.removeItem('officer');
  };

  return (
    <AuthContext.Provider value={{ student, officer, loginStudent, loginOfficer, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
