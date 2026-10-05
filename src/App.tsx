import { useState, useEffect } from 'react';
import Login from './views/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './views/Dashboard/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
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
    setActiveTab('dashboard'); // Auto redirect to dashboard view context on success
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Render view template block dynamically matching active buttons navigation mapping matrix
  const renderActiveViewContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <div style={{ padding: '40px' }}><h2>📦 Products Module Workspace Canvas Placeholder</h2></div>;
      case 'purchase':
        return <div style={{ padding: '40px' }}><h2>📥 Inward Purchase Module Workspace Canvas Placeholder</h2></div>;
      case 'pos':
        return <div style={{ padding: '40px' }}><h2>🛒 Counter Terminal Sales POS Workspace Canvas Placeholder</h2></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-master-runtime-wrapper">
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="app-authenticated-layout-root">
          <Navbar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={handleLogout} 
          />
          <main className="app-main-content-viewport-body">
            {renderActiveViewContent()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
