const collectionModel = require('../models/collectionModel');

// Add Collection
const addCollection = async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file ? req.file.filename : "";

        const collectionData = {
            name,
            description,
            image
        };

        const collection = new collectionModel(collectionData);
        await collection.save();

        res.json({ success: true, message: "Collection Created" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List Collections
const listCollections = async (req, res) => {
    try {
        const collections = await collectionModel.find({ isDeleted: false });
        res.json({ success: true, collections });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove Collection (Soft Delete)
const removeCollection = async (req, res) => {
    try {
        await collectionModel.findByIdAndUpdate(req.body.id, { isDeleted: true });
        res.json({ success: true, message: "Collection Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { addCollection, listCollections, removeCollection };
