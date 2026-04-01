/* cspell:disable */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/landingpage/landingpage";
import LoginPage from "./pages/auth/LoginPage";
import AdminView from "./pages/dashboard/AdminView"; 
import DeveloperView from "./pages/dashboard/DeveloperView"; 
import Projects from "./pages/ProjectsView/Projects"; // New Import
import About from "./pages/about/About"; // New Import
import { useAuth } from "./context/useAuth"; 
import RecruitmentForm from "./components/public/RecruitmentForm";

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
          {/* Public_Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/apply" element={<RecruitmentForm />} />
          <Route path="/projects" element={<Projects />} /> 
          <Route path="/about" element={<About />} />

          {/* Dashboard_Routes */}
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

          {/* System_Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;