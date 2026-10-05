import { useState, useEffect } from 'react';
import Login from './views/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './views/Dashboard/Dashboard';
import Products from './views/Products/Products';
import PurchaseOrders from './views/PurchaseOrders/PurchaseOrders';
import POS from './views/POS/POS'; // Injecting final cash terminal counter view layer
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
    setActiveTab('dashboard'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Central Router dynamic content router templates switches manager engine
  const renderActiveViewContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'purchase':
        return <PurchaseOrders />;
      case 'pos':
        return <POS />; // Dynamically loading core checkout sales point of sale interfaces modules
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

