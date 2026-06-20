const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, default: 'guest' },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, default: false },
    date: { type: Number, required: true },
    orderId: { type: String, required: true },
    promoCode: { type: String },
    discount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

module.exports = orderModel;
