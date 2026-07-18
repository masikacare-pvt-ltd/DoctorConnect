import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { loadSettings, saveSettings } from '../services/settings.service';
import type { UserSettings } from '../types/domain';

type Theme = 'light' | 'dark';
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, isProfileComplete } = useAuth();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (user && isProfileComplete) {
      loadSettings(user.id).then((s) => setTheme((s.theme as Theme) ?? 'light'));
    }
  }, [user, isProfileComplete]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (user && isProfileComplete) {
      const current: UserSettings = { theme: next, notificationsEnabled: true, digestEnabled: true };
      saveSettings(user.id, current);
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
