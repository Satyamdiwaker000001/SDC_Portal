import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import DeveloperDashboard from './DeveloperDashboard';

const Dashboard: React.FC = () => {
  const rawUser = localStorage.getItem('sdc_user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route 
        index 
        element={
          user.role === 'admin' 
            ? <Navigate to="admin" replace /> 
            : <Navigate to="developer" replace />
        } 
      />
      {/* Admin Route Group */}
      <Route path="admin" element={<AdminDashboard view="desk" />} />
      <Route path="admin/members" element={<AdminDashboard view="members" />} />
      <Route path="admin/teams" element={<AdminDashboard view="teams" />} />
      <Route path="admin/projects" element={<AdminDashboard view="projects" />} />
      <Route path="admin/tasks" element={<AdminDashboard view="tasks" />} />
      <Route path="admin/applications" element={<AdminDashboard view="applications" />} />
      <Route path="admin/announcements" element={<AdminDashboard view="announcements" />} />
      <Route path="admin/leaderboard" element={<AdminDashboard view="leaderboard" />} />

      {/* Developer Route Group */}
      <Route path="developer" element={<DeveloperDashboard view="desk" />} />
      <Route path="developer/members" element={<DeveloperDashboard view="members" />} />
      <Route path="developer/teams" element={<DeveloperDashboard view="teams" />} />
      <Route path="developer/projects" element={<DeveloperDashboard view="projects" />} />
      <Route path="developer/tasks" element={<DeveloperDashboard view="tasks" />} />
      <Route path="developer/applications" element={<DeveloperDashboard view="applications" />} />
      <Route path="developer/announcements" element={<DeveloperDashboard view="announcements" />} />
      <Route path="developer/leaderboard" element={<DeveloperDashboard view="leaderboard" />} />
    </Routes>
  );
};

export default Dashboard;
