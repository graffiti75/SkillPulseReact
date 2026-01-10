import React, { useState } from 'react';
import { LoginScreen } from './components/auth';
import { TaskScreen } from './pages';
import { Alert } from './components/common';
import './styles/global.css';

function App() {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleLogin = (email) => {
    setUser(email.split('@')[0]);
    setAlert({ message: 'Welcome back!', type: 'success' });
  };

  const handleSignUp = (email) => {
    setUser(email.split('@')[0]);
    setAlert({ message: 'Account created successfully!', type: 'success' });
  };

  const handleLogout = () => {
    setUser(null);
    setAlert({ message: 'Logged out successfully', type: 'success' });
  };

  return (
    <>
      {user ? (
        <TaskScreen user={user} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} />
      )}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
}

export default App;
