import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const theme = 'dark'; // Always use dark theme

    useEffect(() => {
        // Remove any stored theme preference
        localStorage.removeItem('admin-theme');
        // Force dark theme
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.removeAttribute('data-theme'); // Remove attribute to use default dark theme
    }, []);

    const toggleTheme = () => {
        // Disabled - always dark theme
        console.log('Theme toggle disabled - using dark theme only');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
