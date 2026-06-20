const orderModel = require('../models/orderModel');
const { sendOrderConfirmationEmail } = require('../utils/emailHelper');

// Placing orders using COD Method (Authenticated users)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, promoCode, discount } = req.body;

        // Generate Branded Order ID (e.g. VE-2026-X8R2)
        const year = new Date().getFullYear();
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const brandedId = `VE-${year}-${randomStr}`;

        const orderData = {
            userId,
            items,
            address,
            amount,
            orderId: brandedId,
            promoCode,
            discount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Send Email (Asynchronously)
        sendOrderConfirmationEmail(newOrder);

        res.json({ success: true, message: "Order Placed", orderId: brandedId });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Placing orders as Guest (No login required)
const placeGuestOrder = async (req, res) => {
    try {
        const { items, amount, address, promoCode, discount } = req.body;

        // Validate that guest provided an email
        if (!address || !address.email) {
            return res.json({ success: false, message: "Email address is required for guest orders" });
        }

        // Generate Branded Order ID (e.g. VE-2026-X8R2)
        const year = new Date().getFullYear();
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const brandedId = `VE-${year}-${randomStr}`;

        const orderData = {
            userId: 'guest',
            items,
            address,
            amount,
            orderId: brandedId,
            promoCode,
            discount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Send Email with Tracking ID (Asynchronously)
        sendOrderConfirmationEmail(newOrder);

        res.json({ success: true, message: "Order Placed", orderId: brandedId });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ isDeleted: false });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User Orders Data For Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Track single order by branded Order ID (e.g. VE-2026-X8R2)
const trackOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        // Search by the branded orderId field, not MongoDB _id
        const order = await orderModel.findOne({ orderId: orderId });
        if (order) {
            res.json({ success: true, order });
        } else {
            res.json({ success: false, message: "Order not found. Please check your tracking ID." });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { placeOrder, placeGuestOrder, allOrders, updateStatus, userOrders, trackOrder };
