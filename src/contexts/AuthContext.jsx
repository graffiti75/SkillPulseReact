import { createContext, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children, user, isLoading }) => {
	return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
};

// Hook to use AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
