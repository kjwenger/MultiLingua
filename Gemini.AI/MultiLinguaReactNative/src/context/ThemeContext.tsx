import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Appearance } from 'react-native';

const lightColors = {
  background: '#ffffff',
  text: '#000000',
  primary: '#6200ee',
  card: '#f0f0f0',
  border: '#ccc',
};

const darkColors = {
  background: '#121212',
  text: '#ffffff',
  primary: '#bb86fc',
  card: '#1e1e1e',
  border: '#333',
};

const ThemeContext = createContext({
  isDarkMode: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
