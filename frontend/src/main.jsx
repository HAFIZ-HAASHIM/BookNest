/**
 * main.jsx - Vite React Application Entry Point
 * 
 * Mounts the root React component tree into the DOM (#root element).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
