import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AIChatbot from './components/AIChatbot';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicTracker from './pages/PublicTracker';
import NotFoundPage from './pages/NotFoundPage';

import CitizenDashboard from './pages/citizen/CitizenDashboard';
import FileComplaint from './pages/citizen/FileComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import CitizenTrack from './pages/citizen/CitizenTrack';
import ComplaintDetail from './pages/citizen/ComplaintDetail';

import OfficerDashboard from './pages/officer/OfficerDashboard';
import AssignedComplaints from './pages/officer/AssignedComplaints';
import ResolvedComplaints from './pages/officer/ResolvedComplaints';

import AdminDashboard from './pages/admin/AdminDashboard';
import AllComplaints from './pages/admin/AllComplaints';
import Officers from './pages/admin/Officers';
import Departments from './pages/admin/Departments';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontSize: '14px', fontWeight: '500' },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/track" element={<PublicTracker />} />

            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/citizen/dashboard" replace />} />
              <Route path="dashboard" element={<CitizenDashboard />} />
              <Route path="file" element={<FileComplaint />} />
              <Route path="complaints" element={<MyComplaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="track" element={<CitizenTrack />} />
            </Route>

            <Route
              path="/officer"
              element={
                <ProtectedRoute allowedRoles={['officer']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/officer/dashboard" replace />} />
              <Route path="dashboard" element={<OfficerDashboard />} />
              <Route path="assigned" element={<AssignedComplaints />} />
              <Route path="resolved" element={<ResolvedComplaints />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="complaints" element={<AllComplaints />} />
              <Route path="officers" element={<Officers />} />
              <Route path="departments" element={<Departments />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <AIChatbot />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
