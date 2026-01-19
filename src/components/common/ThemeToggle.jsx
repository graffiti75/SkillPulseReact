import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

export const ThemeToggle = () => {
	const { isDarkMode, toggleTheme } = useTheme();

	return (
		<button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
			{isDarkMode ? '☀️' : '🌙'}
		</button>
	);
};
