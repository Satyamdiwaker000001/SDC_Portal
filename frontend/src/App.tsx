import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { SoundProvider } from './context/SoundContext';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
