/* cspell:disable */
import { createContext, useContext } from "react";

type Role = "admin" | "developer" | null;

interface AuthContextType {
  user: { name: string; role: Role } | null;
  login: (name: string, role: Role) => void;
  logout: () => void;
}

// 1. Context create kiya
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Custom Hook export kiya
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};