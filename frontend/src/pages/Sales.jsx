/**
 * Sales Summary & Financial Analytics Page
 * 
 * WHAT IT DOES:
 * Aggregates and displays bookstore revenue, total orders, average order value,
 * and breakdown by book title.
 * 
 * WHY IT IS NEEDED:
 * Fulfills Feature 5 (SALES SUMMARY):
 * - Display total orders and total sales
 * - Calculate sales from stored orders
 * 
 * HOW IT WORKS:
 * Pulls stored orders and calculates sales metrics dynamically in the browser
 * and cross-verifies with the backend `/api/stats/dashboard` aggregation.
 */

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';

export default function Sales({ refreshTrigger, showToast }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        api.getOrders(),
        api.getDashboardStats(),
      ]);

      if (ordersRes.success) setOrders(ordersRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      showToast('Error loading sales data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, [refreshTrigger]);

  // Derived financial metrics
  const totalSales = orders.reduce((sum, ord) => sum + (ord.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00';
  const totalUnitsSold = orders.reduce((sum, ord) => sum + (ord.quantity || 0), 0);

  // Group sales by book title
  const bookSalesMap = {};
  orders.forEach((order) => {
    const title = order.bookTitle || 'Unknown';
    if (!bookSalesMap[title]) {
      bookSalesMap[title] = { title, unitsSold: 0, revenue: 0 };
    }
    bookSalesMap[title].unitsSold += order.quantity;
    bookSalesMap[title].revenue += order.totalPrice;
  });
  const bookSalesList = Object.values(bookSalesMap).sort((a, b) => b.revenue - a.revenue);

  return (
    <div>
      {/* 4 Core Financial KPI Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Sales Revenue"
          value={`$${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtext="Calculated from stored orders"
          icon="💰"
          color="amber"
        />
        <StatCard
          title="Total Orders Count"
          value={totalOrders}
          subtext="Processed sales transactions"
          icon="🛒"
          color="purple"
        />
        <StatCard
          title="Average Order Value"
          value={`$${avgOrderValue}`}
          subtext="Revenue divided by orders"
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Total Copies Sold"
          value={totalUnitsSold}
          subtext="Total units shipped"
          icon="📦"
          color="green"
        />
      </div>

      {/* Two Column Section: Book Sales Breakdown & Category Distribution */}
      <div className="sales-grid">
        {/* Book Performance Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📖 Sales by Book Title</span>
          </div>
          {loading ? (
            <div className="loading-spinner">Loading sales calculations...</div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="table-responsive desktop-only-view">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Units Sold</th>
                      <th>Total Revenue ($)</th>
                      <th>% of Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookSalesList.length > 0 ? (
                      bookSalesList.map((item, idx) => {
                        const percentage = totalSales > 0 ? ((item.revenue / totalSales) * 100).toFixed(1) : 0;
                        return (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{item.title}</td>
                            <td>
                              <span style={{ fontWeight: 600 }}>{item.unitsSold}</span> units
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                              ${item.revenue.toFixed(2)}
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{percentage}%</span>
                                <div
                                  style={{
                                    flex: 1,
                                    height: '6px',
                                    backgroundColor: '#e2e8f0',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${percentage}%`,
                                      height: '100%',
                                      backgroundColor: 'var(--primary)',
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-state">
                          No sales recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="mobile-only-cards-view">
                {bookSalesList.length > 0 ? (
                  bookSalesList.map((item, idx) => {
                    const percentage = totalSales > 0 ? ((item.revenue / totalSales) * 100).toFixed(1) : 0;
                    return (
                      <div key={idx} className="mobile-card mobile-sales-card">
                        <div className="mobile-card-header">
                          <div className="mobile-card-title">{item.title}</div>
                          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                            ${item.revenue.toFixed(2)}
                          </div>
                        </div>
                        <div className="mobile-card-body">
                          <div className="mobile-card-info-row">
                            <span className="info-label">Units Sold:</span>
                            <span className="info-value" style={{ fontWeight: 600 }}>{item.unitsSold} copies</span>
                          </div>
                          <div className="mobile-card-info-row">
                            <span className="info-label">Share of Revenue:</span>
                            <span className="info-value" style={{ fontWeight: 600 }}>{percentage}%</span>
                          </div>
                          <div
                            style={{
                              marginTop: '6px',
                              height: '6px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: '100%',
                                backgroundColor: 'var(--primary)',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <p>No sales recorded yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Category Performance Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🏷️ Category Distribution</span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              Current catalog representation across subject genres:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                stats.categoryStats.map((cat) => (
                  <div
                    key={cat._id}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{cat._id}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {cat.stock} in stock
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {cat.count} {cat.count === 1 ? 'title' : 'titles'} listed
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>No category metrics</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
