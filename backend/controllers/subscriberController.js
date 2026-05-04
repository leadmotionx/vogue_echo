const subscriberModel = require('../models/subscriberModel');

// Subscribe to newsletter
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if already subscribed
        const exists = await subscriberModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Already Subscribed" });
        }

        const newSubscriber = new subscriberModel({ email });
        await newSubscriber.save();
        
        res.json({ success: true, message: "Subscribed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List all subscribers
const listSubscribers = async (req, res) => {
    try {
        const subscribers = await subscriberModel.find({}).sort({ date: -1 });
        res.json({ success: true, subscribers });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { subscribe, listSubscribers };
