const promoModel = require('../models/promoModel');

const addPromo = async (req, res) => {
    try {
        const { code, discount, expiryDate } = req.body;
        const promoData = {
            code: code.toUpperCase(),
            discount: Number(discount),
            expiryDate,
            date: Date.now()
        };
        const newPromo = new promoModel(promoData);
        await newPromo.save();
        res.json({ success: true, message: "Promo Code Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listPromos = async (req, res) => {
    try {
        const promos = await promoModel.find({});
        res.json({ success: true, promos });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removePromo = async (req, res) => {
    try {
        await promoModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Promo Code Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const validatePromo = async (req, res) => {
    try {
        const { code } = req.body;
        const promo = await promoModel.findOne({ code: code.toUpperCase(), isActive: true });
        
        if (promo) {
            // Check expiry
            if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
                return res.json({ success: false, message: "Promo Code Expired" });
            }
            res.json({ success: true, discount: promo.discount });
        } else {
            res.json({ success: false, message: "Invalid Promo Code" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { addPromo, listPromos, removePromo, validatePromo };
