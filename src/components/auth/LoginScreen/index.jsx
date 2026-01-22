import { useState } from 'react';
import { login, signUp } from 'src/firebase';
import './LoginScreen.css';
import LoginButtonGroup from './LoginButtonGroup';
import LoginPasswordGroup from './LoginPasswordGroup';
import LoginHeader from './LoginHeader';

const LoginScreen = ({ onLoginSuccess }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async () => {
		if (!email || !password) return;
		setIsLoading(true);
		setError('');

		const result = await login(email, password);
		setIsLoading(false);

		if (result.success) {
			onLoginSuccess(result.user);
		} else {
			setError(result.error);
		}
	};

	const handleSignUp = async () => {
		if (!email || !password) return;
		setIsLoading(true);
		setError('');

		const result = await signUp(email, password);
		setIsLoading(false);

		if (result.success) {
			onLoginSuccess(result.user);
		} else {
			setError(result.error);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<LoginHeader email={email} setEmail={setEmail} error={error} />
				<LoginPasswordGroup
					password={password}
					setPassword={setPassword}
					showPassword={showPassword}
					setShowPassword={setShowPassword}
				/>
				<LoginButtonGroup
					email={email}
					password={password}
					isLoading={isLoading}
					handleLogin={handleLogin}
					handleSignUp={handleSignUp}
				/>
			</div>
		</div>
	);
};

export default LoginScreen;
