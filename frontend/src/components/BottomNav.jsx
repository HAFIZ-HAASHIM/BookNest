/**
 * BottomNav Component (Mobile Only)
 * 
 * WHAT IT DOES:
 * Provides a fixed bottom navigation bar on smartphone screens for 1-tap
 * switching between all 5 administrative sections.
 * 
 * WHY IT IS NEEDED:
 * On mobile devices, sidebars are awkward to use. A bottom navigation bar is the
 * mobile UI standard, keeping all core pages instantly accessible.
 */

import React from 'react';

const tabs = [
  { id: 'dashboard', label: 'Dash', icon: '📊' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'inventory', label: 'Stock', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🛒' },
  { id: 'sales', label: 'Sales', icon: '📈' },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile Bottom Navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
