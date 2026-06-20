const express = require('express');
const { allOrders, updateStatus, placeOrder, placeGuestOrder, userOrders, trackOrder } = require('../controllers/orderController');
const adminAuth = require('../middleware/adminAuth');
const authUser = require('../middleware/authUser');

const orderRouter = express.Router();

// Admin Features
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Authenticated User Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/userorders', authUser, userOrders);

// Guest Checkout (No login required)
orderRouter.post('/guest', placeGuestOrder);

// Public tracking (No login required)
orderRouter.post('/track', trackOrder);

module.exports = orderRouter;
