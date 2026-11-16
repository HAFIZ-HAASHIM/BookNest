/**
 * Dashboard Page
 * 
 * WHAT IT DOES:
 * Serves as the central administrative hub showing primary system metrics:
 * 1. Total number of books
 * 2. Total available stock
 * 3. Total orders placed
 * 4. Total sales revenue
 * Along with recent transactions and low-stock alerts.
 * 
 * WHY IT IS NEEDED:
 * Fulfills Feature 1 (DASHBOARD) of the requirements, giving an instant high-level
 * status of the bookstore business.
 * 
 * HOW IT WORKS:
 * Calls `api.getDashboardStats()` inside a `useEffect` hook to retrieve MongoDB
 * aggregations and renders responsive KPI cards and tables.
 */

import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

export default function Dashboard({ setActiveTab, onOpenAddBook, onOpenNewOrder }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError('Failed to connect to backend server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading Bookstore Dashboard Data...</div>;
  }

  if (error) {
    return (
      <div className="card" style={{ padding: '24px', borderLeft: '4px solid #dc2626' }}>
        <h3 style={{ color: '#dc2626', marginBottom: '8px' }}>Connection Error</h3>
        <p style={{ color: '#475569', marginBottom: '16px' }}>{error}</p>
        <button className="btn btn-primary btn-sm" onClick={loadDashboardData}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 4 Core Requirement Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Books"
          value={stats?.totalBooks ?? 0}
          subtext="Unique titles in catalog"
          icon="📚"
          color="blue"
        />
        <StatCard
          title="Total Stock"
          value={stats?.totalStock ?? 0}
          subtext={`${stats?.outOfStockCount ?? 0} title(s) out of stock`}
          icon="📦"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          subtext="Customer orders placed"
          icon="🛒"
          color="purple"
        />
        <StatCard
          title="Total Sales"
          value={`$${(stats?.totalSales ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Revenue from stored orders"
          icon="💰"
          color="amber"
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">⚡ Quick Management Actions</span>
        </div>
        <div className="card-body" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenAddBook}>
            + Add New Book
          </button>
          <button className="btn btn-outline" onClick={onOpenNewOrder}>
            🛒 Create Customer Order
          </button>
          <button className="btn btn-outline" onClick={() => setActiveTab('inventory')}>
            📦 View Inventory Alerts
          </button>
          <button className="btn btn-outline" onClick={() => setActiveTab('sales')}>
            📈 View Sales Report
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders and Category/Alert Summary */}
      <div className="sales-grid">
        {/* Recent Orders Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🛒 Recent Customer Orders</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('orders')}
            >
              View All Orders &rarr;
            </button>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Book Title</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 500 }}>{order.customerName}</td>
                      <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.bookTitle}
                      </td>
                      <td>{order.quantity}</td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td>
                        <span className="badge badge-order-completed">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No orders placed yet. Click "Create Customer Order" to begin!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock & Category Overview */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📊 Inventory Status</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setActiveTab('inventory')}
            >
              Inventory &rarr;
            </button>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                <span>Out of Stock Titles:</span>
                <span style={{ fontWeight: 700, color: stats?.outOfStockCount > 0 ? '#dc2626' : '#16a34a' }}>
                  {stats?.outOfStockCount ?? 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
                <span>Low Stock Titles (&le; 5 units):</span>
                <span style={{ fontWeight: 700, color: '#d97706' }}>
                  {stats?.lowStockCount ?? 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span>Total Units in Stock:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  {stats?.totalStock ?? 0}
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '14px 0' }} />

            <h4 style={{ fontSize: '0.86rem', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>
              Categories in Catalog
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                stats.categoryStats.slice(0, 5).map((cat) => (
                  <div
                    key={cat._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.84rem',
                      padding: '4px 8px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '4px',
                    }}
                  >
                    <span>{cat._id}</span>
                    <span style={{ color: '#64748b' }}>{cat.count} titles ({cat.stock} in stock)</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No category data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
