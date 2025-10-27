import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';

type ThemeContextType = { darkMode: boolean; toggleTheme: () => void; };
const ThemeContext = createContext<ThemeContextType>({ darkMode: true, toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark');
  const toggleTheme = () => setDarkMode(prev => !prev);
  return <ThemeContext.Provider value={{ darkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
