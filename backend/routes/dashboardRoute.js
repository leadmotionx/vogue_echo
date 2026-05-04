const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const adminAuth = require('../middleware/adminAuth');

const dashboardRouter = express.Router();

dashboardRouter.get('/stats', adminAuth, getDashboardStats);

module.exports = dashboardRouter;
