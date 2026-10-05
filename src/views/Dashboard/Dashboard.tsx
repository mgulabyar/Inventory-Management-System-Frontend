import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-view-workspace-wrapper">
      <div className="dashboard-content-header-card">
        <h1>Enterprise Business Summary</h1>
        <p>Real-time analytics engine summary records data</p>
      </div>
      <div className="dashboard-mock-grid-box">
        <p>📊 Business Intelligence metrics and financial tables will be dynamically integrated in the next module step.</p>
      </div>
    </div>
  );
};

export default Dashboard;
