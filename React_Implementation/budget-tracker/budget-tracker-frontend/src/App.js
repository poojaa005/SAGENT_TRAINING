import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Sidebar from './components/sidebar/Sidebar';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home';
import Income from './pages/income/Income';
import Expense from './pages/expense/Expense';
import Budget from './pages/budget/Budget';
import Goals from './pages/goals/Goals';

const PrivateRoute = ({ children }) => {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      <Route path="/" element={
        <PrivateRoute>
          <AppLayout><Home /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/income" element={
        <PrivateRoute>
          <AppLayout><Income /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/expenses" element={
        <PrivateRoute>
          <AppLayout><Expense /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/budget" element={
        <PrivateRoute>
          <AppLayout><Budget /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/goals" element={
        <PrivateRoute>
          <AppLayout><Goals /></AppLayout>
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <UserProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </UserProvider>
);

export default App;
