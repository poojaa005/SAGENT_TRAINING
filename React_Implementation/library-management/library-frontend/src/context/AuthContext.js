import React, { createContext, useContext, useState } from 'react';
import { getAuthToken, setAuthToken } from '../services/http';

const AuthContext = createContext(null);

function normalizeUser(userData, roleOverride) {
  const role = (roleOverride || userData?.role || 'member').toLowerCase();
  const normalized = { ...userData, role };
  if (role === 'member' && !normalized.memberId && normalized.id) {
    normalized.memberId = normalized.id;
  }
  if (role === 'librarian' && !normalized.librarianId && normalized.id) {
    normalized.librarianId = normalized.id;
  }
  return normalized;
}

function resolveAuthToken(userData, explicitToken) {
  return (
    explicitToken ||
    userData?.token ||
    userData?.accessToken ||
    userData?.jwt ||
    userData?.jwtToken
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = getAuthToken();
      const saved = localStorage.getItem('lms_user');
      return saved && token ? normalizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, role, token) => {
    const normalizedUser = normalizeUser(userData, role);
    setAuthToken(resolveAuthToken(userData, token));
    localStorage.setItem('lms_user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    setAuthToken(null);
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
