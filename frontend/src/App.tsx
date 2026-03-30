/* cspell:disable */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import Provider
import LandingPage from "./pages/landingpage/landingpage";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    // Sabse important: AuthProvider se wrap karo
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Fallback: Unknown routes go to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;