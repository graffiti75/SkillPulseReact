import { Icons } from '../../common';
import './LoginScreen.css';

const LoginHeader = ({ email, setEmail, error }) => {
	return (
		<>
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
		</>
	);
};

export default LoginHeader;
