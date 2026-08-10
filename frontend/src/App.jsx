import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { SessionTimeoutGuard } from './components/SessionTimeoutGuard';

// Global Protection Component for Back/Forward Navigation & Copy Prevention
const GlobalProtection = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Block Browser Back/Forward navigation
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // 2. Block keyboard shortcuts (Alt+Left/Right navigation, Ctrl+C, Ctrl+X, Cmd+C, Cmd+X, Ctrl+U, Ctrl+S)
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        e.stopPropagation();
      }
      if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'x', 'X', 'u', 'U', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Block mouse & clipboard events: copy, cut, selectstart
    const preventCopy = (e) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('copy', preventCopy, true);
    document.addEventListener('cut', preventCopy, true);
    document.addEventListener('selectstart', preventCopy, true);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('copy', preventCopy, true);
      document.removeEventListener('cut', preventCopy, true);
      document.removeEventListener('selectstart', preventCopy, true);
    };
  }, [location]);

  return null;
};

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
        <GlobalProtection />
        <SessionTimeoutGuard />
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
