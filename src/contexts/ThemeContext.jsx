import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	// Check if user had a preference saved
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const saved = localStorage.getItem('darkMode');
		if (saved !== null) return JSON.parse(saved);
		// Check system preference
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	// Save preference to localStorage when it changes
	useEffect(() => {
		localStorage.setItem('darkMode', JSON.stringify(isDarkMode));

		// Add/remove class to root element
		if (isDarkMode) {
			document.documentElement.classList.add('dark-mode');
		} else {
			document.documentElement.classList.remove('dark-mode');
		}
	}, [isDarkMode]);

	const toggleTheme = () => {
		setIsDarkMode((prev) => !prev);
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Custom hook to use the theme
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
};
