const express = require('express');
const { addCollection, listCollections, removeCollection } = require('../controllers/collectionController');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/multer');

const collectionRouter = express.Router();

collectionRouter.post('/add', adminAuth, upload.single('image'), addCollection);
collectionRouter.get('/list', listCollections);
collectionRouter.post('/remove', adminAuth, removeCollection);

module.exports = collectionRouter;
