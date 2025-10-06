// src/components/DarkModeToggle/DarkModeToggle.jsx
import React from 'react';
import { useTheme } from '../../context/useTheme';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {isDarkMode ? '🌙' : '☀️'}
        </div>
      </div>
    </button>
  );
};

export default DarkModeToggle;