import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';
import { normalizeList, normalizeUser } from '../utils/entityAdapters';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('grocery_user');
    if (stored) setUser(normalizeUser(JSON.parse(stored)));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await userService.searchByEmail(email);
      const userFromApi = Array.isArray(response) ? response[0] : (normalizeList(response)[0] || response);
      const normalized = normalizeUser(userFromApi);

      if (!normalized || !normalized.email) throw new Error('User not found');
      if (normalized.password !== password) throw new Error('Wrong password');

      setUser(normalized);
      localStorage.setItem('grocery_user', JSON.stringify(normalized));
      toast.success(`Welcome back, ${normalized.name}!`);
      return normalized;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = normalizeUser(await userService.createUser({ ...userData, role: 'USER' }));
      setUser(newUser);
      localStorage.setItem('grocery_user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
      return newUser;
    } catch (err) {
      toast.error('Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('grocery_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
