/**
 * StatCard Component
 * 
 * WHAT IT DOES:
 * Displays a single key performance indicator (KPI) metric block with title,
 * number, subtext, and theme-colored icon.
 * 
 * WHY IT IS NEEDED:
 * Essential for the core Dashboard requirement:
 * 1. Total number of books
 * 2. Total available stock
 * 3. Total orders
 * 4. Total sales
 */

import React from 'react';

export default function StatCard({ title, value, subtext, icon, color = 'blue' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
      <div className={`stat-icon-wrapper icon-${color}`}>
        <span>{icon}</span>
      </div>
    </div>
  );
}
