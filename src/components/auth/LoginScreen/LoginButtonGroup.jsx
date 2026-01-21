import './LoginScreen.css';

const LoginButtonGroup = ({ email, password, isLoading, handleLogin, handleSignUp }) => {
	return (
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
	);
};

export default LoginButtonGroup;
