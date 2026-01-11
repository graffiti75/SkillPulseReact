import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/auth';
import { TaskScreen } from './pages';
import { Alert, Loading } from './components/common';
import { onAuthChange, logout } from './firebase';
import './styles/global.css';

function App() {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [alert, setAlert] = useState(null);

	// Listen to Firebase auth state changes
	useEffect(() => {
		const unsubscribe = onAuthChange((firebaseUser) => {
			setUser(firebaseUser);
			setIsLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const handleLoginSuccess = (firebaseUser) => {
		setUser(firebaseUser);
		setAlert({ message: 'Welcome back!', type: 'success' });
	};

	const handleLogout = async () => {
		const result = await logout();
		if (result.success) {
			setUser(null);
			setAlert({ message: 'Logged out successfully', type: 'success' });
		}
	};

	if (isLoading) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #3B82F6 100%)',
				}}
			>
				<Loading />
			</div>
		);
	}

	return (
		<>
			{user ? (
				<TaskScreen user={user} onLogout={handleLogout} />
			) : (
				<LoginScreen onLoginSuccess={handleLoginSuccess} />
			)}
			{alert && (
				<Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
			)}
		</>
	);
}

export default App;
