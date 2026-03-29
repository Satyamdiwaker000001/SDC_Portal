/* cspell:disable */
import { useAuth } from "../../context/useAuth";
import AdminView from "./AdminView";
import DeveloperView from "./DeveloperView";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  // Redirect if session is missing
  if (!user) return <Navigate to="/login" />;

  // --- DEBUGGING: Console mein check karo ki role "admin" hai ya "developer" ---
  console.log("Current Session User:", user);

  return (
    // 'antialiased' add kiya hai taaki text ki quality orange theme par crisp dikhe
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased">
      {/* Yahan se component switch hoga:
          - Admin login par Orange Admin Command Center khulega.
          - Dev login par Orange Developer Workspace khulega.
      */}
      {user.role === "admin" ? (
        <AdminView userName={user.name} />
      ) : (
        <DeveloperView userName={user.name} />
      )}
    </div>
  );
}