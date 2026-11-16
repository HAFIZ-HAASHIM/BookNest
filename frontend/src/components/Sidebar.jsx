/**
 * Sidebar Component
 * 
 * WHAT IT DOES:
 * Provides persistent left-side navigation for the administrator.
 * 
 * WHY IT IS NEEDED:
 * Standard dashboard layout allowing the admin to switch between Dashboard,
 * Books, Inventory, Orders, and Sales Summary views with a single click.
 * 
 * HOW IT WORKS:
 * Receives `activeTab` and `setActiveTab` state props from `App.jsx`.
 * Updates the state when an admin clicks a menu item.
 */

import React from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'books', label: 'Book Management', icon: '📚' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'orders', label: 'Customer Orders', icon: '🛒' },
  { id: 'sales', label: 'Sales Summary', icon: '📈' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">BN</div>
        <div className="brand-info">
          <h1>BookNest</h1>
          <span>Bookstore Admin</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div>System: Online</div>
        <div className="footer-badge">
          <span className="status-dot"></span>
          <span>MongoDB Connected</span>
        </div>
      </div>
    </aside>
  );
}
