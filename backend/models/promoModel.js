const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Percentage (e.g. 10 for 10%)
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date },
    date: { type: Number, required: true }
});

const promoModel = mongoose.models.promo || mongoose.model('promo', promoSchema);

module.exports = promoModel;
