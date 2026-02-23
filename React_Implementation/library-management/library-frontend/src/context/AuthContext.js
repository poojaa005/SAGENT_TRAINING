import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function normalizeUser(userData, roleOverride) {
  const role = (roleOverride || userData?.role || 'member').toLowerCase();
  return { ...userData, role };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lms_user');
      return saved ? normalizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, role) => {
    const normalizedUser = normalizeUser(userData, role);
    localStorage.setItem('lms_user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('lms_user');
    setUser(null);
  };

  const isMember = user?.role === 'member';
  const isLibrarian = user?.role === 'librarian';

  return (
    <AuthContext.Provider value={{ user, login, logout, isMember, isLibrarian }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
