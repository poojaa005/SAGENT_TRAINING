import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './services/http';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Books from './pages/books/Books';
import Members from './pages/members/Members';
import BorrowRequests from './pages/borrowRequests/BorrowRequests';
import Fines from './pages/fines/Fines';
import Notifications from './pages/notifications/Notifications';
import Inventory from './pages/inventory/Inventory';
import AI from './pages/ai/AI';
import './App.css';

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout><Home /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/books" element={
        <PrivateRoute allowedRoles={['member', 'librarian']}>
          <AppLayout><Books /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/members" element={
        <PrivateRoute allowedRoles={['librarian']}>
          <AppLayout><Members /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/borrow-requests" element={
        <PrivateRoute allowedRoles={['librarian']}>
          <AppLayout><BorrowRequests /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/fines" element={
        <PrivateRoute allowedRoles={['librarian']}>
          <AppLayout><Fines /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/notifications" element={
        <PrivateRoute allowedRoles={['member', 'librarian']}>
          <AppLayout><Notifications /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/inventory" element={
        <PrivateRoute allowedRoles={['librarian']}>
          <AppLayout><Inventory /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/ai" element={
  <PrivateRoute>
    <AppLayout><AI /></AppLayout>
  </PrivateRoute>
} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
