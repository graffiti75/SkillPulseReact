import { useState, useEffect } from 'react';
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
			<div className="loading-screen">
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
