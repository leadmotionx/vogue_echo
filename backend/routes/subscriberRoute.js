const express = require('express');
const { subscribe, listSubscribers } = require('../controllers/subscriberController');
const adminAuth = require('../middleware/adminAuth');

const subscriberRouter = express.Router();

subscriberRouter.post('/add', subscribe);
subscriberRouter.get('/list', adminAuth, listSubscribers);

module.exports = subscriberRouter;
