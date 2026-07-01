import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/services';

const AuthContext = createContext();

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
    // MOCK LOGIN FOR UI TESTING
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 'SDC-777',
          full_name: 'Satyam Diwaker',
          email: username,
          role: 'Web Developer',
          department: 'Engineering',
          profile_image_url: 'https://i.pravatar.cc/150?u=sdc_core' // Mock profile photo
        };
        setUser(mockUser);
        setRole(mockUser.role);
        localStorage.setItem('sdc_token', 'mock_token_123');
        resolve(mockUser);
      }, 1500); // 1.5s artificial network delay
    });
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
