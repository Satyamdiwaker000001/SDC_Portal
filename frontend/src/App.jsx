import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import ProjectsView from './pages/ProjectsView';
import TeamView from './pages/TeamView';
import TeamsView from './pages/TeamsView';
import NoticesView from './pages/NoticesView';
import RecruitmentView from './pages/RecruitmentView';
import TelemetryView from './pages/TelemetryView';
import LoginView from './pages/LoginView';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginView />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="projects" element={<ProjectsView />} />
            <Route path="recruitment" element={<RecruitmentView />} />
            <Route path="team" element={<TeamView />} />
            <Route path="teams" element={<TeamsView />} />
            <Route path="notices" element={<NoticesView />} />
            <Route path="telemetry" element={<TelemetryView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
