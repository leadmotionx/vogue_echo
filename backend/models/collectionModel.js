const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // Optional banner image for collection
    isDeleted: { type: Boolean, default: false }
});

const collectionModel = mongoose.models.collection || mongoose.model('collection', collectionSchema);

module.exports = collectionModel;
