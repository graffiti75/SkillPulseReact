import { useState } from 'react';
import { Icons } from '../common';
import { login, signUp } from '../../firebase';
import './LoginScreen.css';

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
				<div className="auth-logo">
					<div className="auth-logo-icon">
						<Icons.Pulse />
					</div>
					<h1 className="auth-title">SkillPulse</h1>
					<p className="auth-subtitle">Track your tasks, boost your productivity</p>
				</div>

				{error && <div className="auth-error">{error}</div>}

				<div className="form-group">
					<label className="form-label">Email</label>
					<input
						type="email"
						className="form-input"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label className="form-label">Password</label>
					<div className="form-input-wrapper">
						<input
							type={showPassword ? 'text' : 'password'}
							className="form-input"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							style={{ paddingRight: '44px' }}
						/>
						<span
							className="form-input-icon"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
						</span>
					</div>
				</div>

				<div className="btn-group" style={{ flexDirection: 'column' }}>
					<button
						className="btn btn-primary btn-full"
						onClick={handleLogin}
						disabled={isLoading || !email || !password}
					>
						{isLoading ? 'Loading...' : 'Log In'}
					</button>
					<button
						className="btn btn-secondary btn-full"
						onClick={handleSignUp}
						disabled={isLoading || !email || !password}
					>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
