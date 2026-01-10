import React, { useState } from 'react';
import { Icons } from '../common';
import './LoginScreen.css';

const LoginScreen = ({ onLogin, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (action) => {
    if (!email || !password) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    action(email);
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
            onClick={() => handleSubmit(onLogin)}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Loading...' : 'Log In'}
          </button>
          <button
            className="btn btn-secondary btn-full"
            onClick={() => handleSubmit(onSignUp)}
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
