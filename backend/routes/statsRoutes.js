/**
 * Stats Routes
 * 
 * Maps HTTP methods and URL paths to Stats Controller functions.
 * 
 * Endpoints:
 * GET /api/stats/dashboard - Fetch aggregated bookstore dashboard stats
 */

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');

router.get('/dashboard', getDashboardStats);

module.exports = router;
