/* cspell:disable */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/landingpage/landingpage";
import LoginPage from "./pages/auth/LoginPage";
import AdminView from "./pages/dashboard/AdminView"; // Import AdminView
import DeveloperView from "./pages/dashboard/DeveloperView"; // Import DeveloperView
import { useAuth } from "./context/useAuth"; // Hook for ProtectedRoute check

// --- SIMPLE PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, roleRequired }: { children: React.ReactNode, roleRequired?: string }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* FIXED: Nested Dashboard Routes 
              Ab /dashboard/admin aur /dashboard/developer dono valid honge
          */}
          <Route path="/dashboard">
            <Route 
              path="admin" 
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="developer" 
              element={
                <ProtectedRoute roleRequired="developer">
                  <DeveloperView userName="SDC_OPERATIVE" />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback: Unknown routes go to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;