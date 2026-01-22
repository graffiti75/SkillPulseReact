import { Icons } from 'src/components/common';
import './LoginScreen.css';

const LoginPasswordGroup = ({ password, setPassword, showPassword, setShowPassword }) => {
	return (
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
				<span className="form-input-icon" onClick={() => setShowPassword(!showPassword)}>
					{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
				</span>
			</div>
		</div>
	);
};

export default LoginPasswordGroup;
