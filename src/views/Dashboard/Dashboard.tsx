import React, { useState, useEffect } from "react";
import API from "../../services/api";
import type { DashboardAPIResponse, DashboardSummaryPayload } from "../../types";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardSummaryPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response =
          await API.get<DashboardAPIResponse>("/dashboard/summary");
        if (response.data.success) {
          setMetrics(response.data.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to populate live ledger calculations data analytics metrics.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading-state-screen-spinner">
        <div className="spinner-element"></div>
        <p>Computing Business Intelligence Summaries Ledger...</p>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard-error-banner-alert-view">{error}</div>;
  }

  return (
    <div className="dashboard-view-workspace-wrapper">
      <div className="dashboard-content-header-card">
        <h1>Enterprise Business Summary</h1>
        <p>Real-time analytics engine ledger summaries record insights</p>
      </div>

      {/* 🚀 METRICS COUNTERS STATUS GRID BOARDS */}
      <div className="dashboard-status-metrics-counters-grid">
        <div className="metric-card-tile revenue-card">
          <div className="card-badge-header">
            <span>Total Revenue</span>
            <span className="card-icon-asset">💰</span>
          </div>
          <h3>${metrics?.financials.totalRevenue.toFixed(2)}</h3>
          <p>Gross terminal checkouts volume ledger</p>
        </div>

        <div className="metric-card-tile profit-card">
          <div className="card-badge-header">
            <span>Gross Profit Margin</span>
            <span className="card-icon-asset">📈</span>
          </div>
          <h3 style={{ color: "#10b981" }}>
            ${metrics?.financials.totalGrossProfit.toFixed(2)}
          </h3>
          <p>Net margin clearance profits accumulated</p>
        </div>

        <div className="metric-card-tile expense-card">
          <div className="card-badge-header">
            <span>Purchase Inward Costs</span>
            <span className="card-icon-asset">📉</span>
          </div>
          <h3>${metrics?.financials.totalInwardPurchaseExpenses.toFixed(2)}</h3>
          <p>Supplier intake expenditure volume ledger</p>
        </div>

        <div className="metric-card-tile alert-card-indicator">
          <div className="card-badge-header">
            <span>Low Stock Safety Breaches</span>
            <span className="card-icon-asset">🚨</span>
          </div>
          <h3
            style={{
              color: metrics?.inventorySummary.lowStockAlertsActiveCount
                ? "#ef4444"
                : "#1e293b",
            }}
          >
            {metrics?.inventorySummary.lowStockAlertsActiveCount} ITEMS
          </h3>
          <p>Stock safety thresholds critical alerts active</p>
        </div>
      </div>

      {/* 📊 CORE TABLES INTEGRATION WORKSPACE GRID SPLIT */}
      <div className="dashboard-tables-layout-split-blocks-grid">
        {/* LEFT SECTION TABLE: CRITICAL STOCK THRESHOLDS ALERTS LIST */}
        <div className="table-block-card-panel">
          <div className="table-heading-meta">
            <h4>⚠️ Critical Low Stock Actions Inventory</h4>
          </div>
          <div className="table-viewport-body-overflow">
            {metrics?.criticalAlerts && metrics.criticalAlerts.length > 0 ? (
              <table className="dashboard-data-grid-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU Code</th>
                    <th>Available Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.criticalAlerts.map((item) => (
                    <tr key={item.id} className="critical-row-row-highlight">
                      <td>
                        <strong>{item.name}</strong>
                      </td>
                      <td>
                        <code>{item.sku}</code>
                      </td>
                      <td>
                        <span className="badged-red-alert-counter">
                          {item.remainingStock} Units left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-table-state-notices">
                🚀 Sound warehouse levels. Zero inventory safety stock threshold
                breaches detected.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION TABLE: TOP SELLING VELOCITY PRODUCT RECORDS */}
        <div className="table-block-card-panel">
          <div className="table-heading-meta">
            <h4>🏆 High Velocity Fast Moving Performers Ranking</h4>
          </div>
          <div className="table-viewport-body-overflow">
            {metrics?.topSellingPerformers &&
            metrics.topSellingPerformers.length > 0 ? (
              <table className="dashboard-data-grid-table">
                <thead>
                  <tr>
                    <th>Product Item Info</th>
                    <th>SKU Barcode</th>
                    <th>Units Sold Out</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.topSellingPerformers.map((item, index) => (
                    <tr key={item.sku}>
                      <td>
                        <strong>
                          Rank #{index + 1} - {item.name}
                        </strong>
                      </td>
                      <td>
                        <code>{item.sku}</code>
                      </td>
                      <td>
                        <span className="badged-blue-velocity-counter">
                          {item.totalSoldUnits} Units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-table-state-notices">
                ⏳ Waiting for transactional cash counter point of sale receipts
                registers processing logging.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
