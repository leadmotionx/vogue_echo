const express = require('express');
const { addCollection, listCollections, removeCollection, updateCollection } = require('../controllers/collectionController');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/multer');

const collectionRouter = express.Router();

collectionRouter.post('/add', adminAuth, upload.single('image'), addCollection);
collectionRouter.post('/update', adminAuth, upload.single('image'), updateCollection);
collectionRouter.get('/list', listCollections);
collectionRouter.post('/remove', adminAuth, removeCollection);

module.exports = collectionRouter;
