import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { SoundProvider } from './context/SoundContext';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import PublicLayout from './components/layout/PublicLayout';
import AboutPage from './pages/about/AboutPage';
import ProjectsPage from './pages/projects/ProjectsPage';

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          
          {/* Protected Internal Deck */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<DashboardLayout />}>
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
