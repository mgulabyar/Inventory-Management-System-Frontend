import { useState, useEffect } from 'react';
import Login from './views/Login/Login';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check local storage configuration state on bootstrap load
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="app-master-runtime-wrapper">
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: '#0f172a' }}>
          <h1 style={{ marginBottom: '10px' }}>Welcome back, {user?.name}!</h1>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            You are authenticated securely as a <strong>{user?.role}</strong>.
          </p>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600
            }}
          >
            Logout Securely
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
