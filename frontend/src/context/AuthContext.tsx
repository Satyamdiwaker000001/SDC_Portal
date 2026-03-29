/* cspell:disable */
import { useState, type ReactNode } from "react"; // 'type' keyword added here
import { AuthContext } from "./useAuth.ts"; 

interface User {
  name: string;
  role: "admin" | "developer" | null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, role: "admin" | "developer" | null) => {
    setUser({ name, role });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}