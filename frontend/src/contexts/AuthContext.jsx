import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/services';

const AuthContext = createContext({
  user: null,
  role: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data);
      setRole(data.role || 'developer'); // fallback
    } catch (error) {
      setUser(null);
      setRole(null);
      localStorage.removeItem('sdc_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('sdc_token');
    if (token) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await authAPI.login(username, password);
    if (data && data.access_token) {
      localStorage.setItem('sdc_token', data.access_token);
      await fetchMe();
    } else {
      throw new Error("Invalid authentication response");
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch(e) {
      // ignore
    }
    localStorage.removeItem('sdc_token');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
