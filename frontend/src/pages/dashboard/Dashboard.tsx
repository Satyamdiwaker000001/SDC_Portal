import React from 'react';
import { useLocation } from 'react-router-dom';
import OverviewView from '../../components/dashboard/views/OverviewView';
import MembersView from '../../components/dashboard/views/MembersView';
import TeamsView from '../../components/dashboard/views/TeamsView';
import ProjectsView from '../../components/dashboard/views/ProjectsView';
import TasksView from '../../components/dashboard/views/TasksView';
import ApplicationsView from '../../components/dashboard/views/ApplicationsView';
import SettingsView from '../../components/dashboard/views/SettingsView';
import AnnouncementsView from '../../components/dashboard/views/AnnouncementsView';
import LeaderboardView from '../../components/dashboard/LeaderboardView';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('sdc_user') || '{"role": "developer"}');

  const renderView = () => {
    switch (location.pathname) {
      case '/dashboard/members':
        return <MembersView />;
      case '/dashboard/teams':
        return <TeamsView />;
      case '/dashboard/projects':
        return <ProjectsView />;
      case '/dashboard/tasks':
        return <TasksView />;
      case '/dashboard/settings':
        return <SettingsView />;
      case '/dashboard/applications':
        return user.role === 'admin' ? <ApplicationsView /> : <OverviewView />;
      case '/dashboard/announcements':
        return <AnnouncementsView />;
      case '/dashboard/leaderboard':
        return <LeaderboardView />;
      default:
        return <OverviewView />;
    }
  };

  return <>{renderView()}</>;
};

export default Dashboard;
