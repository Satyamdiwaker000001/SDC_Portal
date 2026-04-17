import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { SDCThemeProvider } from './context/ThemeContext';
import GlacialLoader from './components/common/GlacialLoader';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    // Inject Mock Development Identity [BYPASS_AUTH]
    if (!localStorage.getItem('sdc_token')) {
      localStorage.setItem('sdc_token', 'mock_tactical_token_v5');
      localStorage.setItem('sdc_user', JSON.stringify({
        id: 'ADMIN-001',
        name: 'COMMANDER_SINCERE',
        email: 'admin@sdc.com',
        role: 'admin',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      }));
    }

    const timer = setTimeout(() => {
      setIsBooted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SDCThemeProvider>
      <BrowserRouter>
        <GlobalStyles />
        {!isBooted ? (
          <GlacialLoader />
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="members" element={<Dashboard />} />
                <Route path="teams" element={<Dashboard />} />
                <Route path="projects" element={<Dashboard />} />
                <Route path="tasks" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                <Route path="applications" element={<Dashboard />} />
                <Route path="announcements" element={<Dashboard />} />
                <Route path="leaderboard" element={<Dashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </BrowserRouter>
    </SDCThemeProvider>
  );
}

export default App;

