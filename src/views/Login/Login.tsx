import React, { useState } from 'react';
import API from '../../services/api';
import './Login.css';
import type { AuthResponse } from '../../types';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post<AuthResponse>('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(token, user);
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please check your backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-master-container">
      <div className="login-glass-card">
        <div className="login-header-branding">
          <h2>IMS PORTAL</h2>
          <p>Inventory & Stock Management System</p>
        </div>

        {error && <div className="login-error-alert-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form-element">
          <div className="login-input-group">
            <label>Corporate Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label>Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-action-submit-btn" disabled={loading}>
            {loading ? 'Authenticating Credentials...' : 'Sign In Securely'}
          </button>
        </form>
        
        <div className="login-footer-security-notice">
          <span>🔒 Protected by Enterprise-Grade SSL Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
