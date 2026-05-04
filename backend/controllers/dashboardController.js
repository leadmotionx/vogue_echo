const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        const products = await productModel.countDocuments({ isDeleted: false });
        const users = await userModel.countDocuments({});

        // Calculate Total Revenue
        const totalRevenue = orders.reduce((total, order) => {
            // Only count paid orders or all orders depending on preference (counting all for now)
            return total + order.amount;
        }, 0);

        // Get recent 5 orders
        const recentOrders = await orderModel.find({}).sort({ date: -1 }).limit(5);

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders: orders.length,
                totalProducts: products,
                totalUsers: users
            },
            recentOrders
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats };
