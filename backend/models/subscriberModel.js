const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now }
});

const subscriberModel = mongoose.models.subscriber || mongoose.model('subscriber', subscriberSchema);

module.exports = subscriberModel;
