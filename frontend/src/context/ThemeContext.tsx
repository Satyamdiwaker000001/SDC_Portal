import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    bg: { primary: string; card: string; sidebar: string; active: string; scrollbar: string };
    text: { primary: string; secondary: string; dim: string; inverse: string };
    accent: { primary: string; secondary: string; accent: string; success: string; warning: string; error: string };
  };
  spaces: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', string>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl' | 'full', string>;
  border: string;
  shadow: string;
  bgMain: string;
  bgCard: string;
  bgSidebar: string;
  bgSidebarActive: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSecondary: string;
  danger: string;
  success: string;
  warning: string;
}

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

/* --- DESIGN TOKENS --- */
const spaces = {
  xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '3rem', xxl: '5rem'
};

const radius = {
  sm: '4px', md: '8px', lg: '16px', xl: '24px', full: '9999px'
};

export const createTheme = (mode: 'light' | 'dark'): Theme => {
  const t = {
    mode,
    spaces,
    radius,
    colors: {
      bg: {
        primary: mode === 'light' ? '#F8FAFC' : '#000000',
        card: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 15, 15, 0.65)',
        sidebar: mode === 'light' ? '#F1F5F9' : '#070707',
        active: mode === 'light' ? '#E2E8F0' : 'rgba(96, 165, 250, 0.08)',
        scrollbar: mode === 'light' ? '#CBD5E1' : '#1e293b'
      },
      text: {
        primary: mode === 'light' ? '#0F172A' : '#F1F5F9',
        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
        dim: mode === 'light' ? '#94A3B8' : '#64748B',
        inverse: mode === 'light' ? '#FFFFFF' : '#0F172A'
      },
      accent: {
        primary: mode === 'light' ? '#2563EB' : '#60A5FA',
        secondary: mode === 'light' ? '#4F46E5' : '#818CF8',
        accent: '#2DD4BF', // Teal
        success: '#34D399',
        warning: '#FBBF24',
        error: '#FB7185'
      }
    },
    border: mode === 'light' ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.05)',
    shadow: mode === 'light' ? '0 10px 40px -10px rgba(15, 23, 42, 0.08)' : '0 20px 50px rgba(0, 0, 0, 0.8)'
  };

  // Compatibility Aliases for Legacy Components
  return {
    ...t,
    bgMain: t.colors.bg.primary,
    bgCard: t.colors.bg.card,
    bgSidebar: t.colors.bg.sidebar,
    bgSidebarActive: t.colors.bg.active,
    textPrimary: t.colors.text.primary,
    textSecondary: t.colors.text.secondary,
    accent: t.colors.accent.primary,
    accentSecondary: t.colors.accent.secondary,
    danger: t.colors.accent.error,
    success: t.colors.accent.success,
    warning: t.colors.accent.warning
  } as Theme;
};

export const SDCThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sdc_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('sdc_theme', mode);
    if (mode === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeValue = useMemo(() => ({ mode, toggleTheme }), [mode]);
  const activeTheme = useMemo(() => createTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <ThemeProvider theme={activeTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
