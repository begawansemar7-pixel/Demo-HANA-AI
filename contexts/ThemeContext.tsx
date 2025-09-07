import React, { createContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // This effect runs once on mount to set the initial theme based on the class
    // set by the script in index.html. This avoids a re-render flash.
    const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setThemeState(initialTheme);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    const isDark = newTheme === 'dark';
    
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(newTheme);
    
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
