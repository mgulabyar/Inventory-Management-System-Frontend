import React from "react";
import "./Navbar.css";

interface NavbarProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <nav className="navbar-master-container">
      <div className="navbar-left-branding">
        <span className="navbar-logo-cube">📊</span>
        <span className="navbar-brand-text">IMS GLOBAL</span>
      </div>

      <div className="navbar-center-navigation-hub">
        <button
          className={`navbar-nav-item-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`navbar-nav-item-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`navbar-nav-item-btn ${activeTab === "purchase" ? "active" : ""}`}
          onClick={() => setActiveTab("purchase")}
        >
          Purchase Orders
        </button>
        <button
          className={`navbar-nav-item-btn ${activeTab === "pos" ? "active" : ""}`}
          onClick={() => setActiveTab("pos")}
        >
          POS Counter
        </button>
      </div>

      <div className="navbar-right-user-profile">
        <div className="navbar-user-meta-badge">
          <span className="navbar-user-display-name">{user?.name}</span>
          <span className="navbar-user-display-role">{user?.role}</span>
        </div>
        <button className="navbar-action-logout-trigger-btn" onClick={onLogout}>
          Exit Portal
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
