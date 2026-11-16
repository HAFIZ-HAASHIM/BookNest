/**
 * Toast Notification Component
 * 
 * WHAT IT DOES:
 * Displays non-intrusive feedback alerts for successful actions or errors.
 * 
 * WHY IT IS NEEDED:
 * Informs the user immediately when an operation succeeds (e.g., "Order created",
 * "Book deleted") or fails (e.g., "Network error").
 */

import React from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        <span>{type === 'success' ? '✅' : '❌'}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: '1rem',
          }}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
