const express = require('express');
const { allOrders, updateStatus, placeOrder, userOrders, trackOrder } = require('../controllers/orderController');
const adminAuth = require('../middleware/adminAuth');
const authUser = require('../middleware/authUser');

const orderRouter = express.Router();

// Admin Features
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.post('/track', trackOrder); // Public tracking

module.exports = orderRouter;
