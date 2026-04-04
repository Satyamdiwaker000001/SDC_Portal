import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/landingpage/landingpage";
import LoginPage from "./pages/auth/LoginPage";
import AdminView from "./pages/dashboard/AdminView"; 
import DeveloperView from "./pages/dashboard/DeveloperView"; 
import Projects from "./pages/ProjectsView/Projects";
import About from "./pages/about/About";
import { useAuth } from "./context/useAuth"; 
import RecruitmentForm from "./components/public/RecruitmentForm";
import NeuralTransition from "./components/shared/NeuralTransition";
import { SystemLoader } from "./components/shared/SystemLoader";
import { ExperienceLayout } from "./components/shared/ExperienceLayout";

const ProtectedRoute = ({ children, roleRequired }: { children: React.ReactNode, roleRequired?: string }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public_Routes */}
        <Route path="/" element={<NeuralTransition><LandingPage /></NeuralTransition>} />
        <Route path="/login" element={<NeuralTransition><LoginPage /></NeuralTransition>} />
        <Route path="/apply" element={<NeuralTransition><RecruitmentForm /></NeuralTransition>} />
        <Route path="/projects" element={<NeuralTransition><Projects /></NeuralTransition>} /> 
        <Route path="/about" element={<NeuralTransition><About /></NeuralTransition>} />

        {/* Dashboard_Routes */}
        <Route path="/dashboard">
          <Route 
            path="admin" 
            element={
              <ProtectedRoute roleRequired="admin">
                <NeuralTransition><AdminView /></NeuralTransition>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="developer" 
            element={
              <ProtectedRoute roleRequired="developer">
                <NeuralTransition><DeveloperView userName="SDC_OPERATIVE" /></NeuralTransition>
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* System_Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('SDC_BOOTED');
  });

  const handleComplete = () => {
    sessionStorage.setItem('SDC_BOOTED', 'true');
    setLoading(false);
  };

  return (
    <AuthProvider>
      <AnimatePresence>
        {loading && <SystemLoader onComplete={handleComplete} />}
      </AnimatePresence>
      
      {!loading && (
        <Router>
          <ExperienceLayout>
            <AnimatedRoutes />
          </ExperienceLayout>
        </Router>
      )}
    </AuthProvider>
  );
}

export default App;