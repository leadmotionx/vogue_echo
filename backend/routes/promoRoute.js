const express = require('express');
const { addPromo, listPromos, removePromo, validatePromo } = require('../controllers/promoController');
const adminAuth = require('../middleware/adminAuth');

const promoRouter = express.Router();

promoRouter.post('/add', adminAuth, addPromo);
promoRouter.get('/list', adminAuth, listPromos);
promoRouter.post('/remove', adminAuth, removePromo);
promoRouter.post('/validate', validatePromo);

module.exports = promoRouter;
