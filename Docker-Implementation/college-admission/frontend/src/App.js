import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Application from './pages/Application/Application';
import Courses from './pages/Courses/Courses';
import Payment from './pages/Payment/Payment';
import ApplicationStatus from './pages/ApplicationStatus/ApplicationStatus';
import OfficerLogin from './pages/OfficerLogin/OfficerLogin';
import OfficerDashboard from './pages/OfficerDashboard/OfficerDashboard';
import AIAssistant from './ai/AIAssistant';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apply" element={<Application />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/payment/:appId" element={<Payment />} />
          <Route path="/status" element={<ApplicationStatus />} />
          <Route path="/officer/login" element={<OfficerLogin />} />
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
