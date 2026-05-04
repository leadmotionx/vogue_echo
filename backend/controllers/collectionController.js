const collectionModel = require('../models/collectionModel');
const cloudinary = require('cloudinary').v2;

// Add Collection
const addCollection = async (req, res) => {
    try {
        const { name, description } = req.body;
        const imageFile = req.file;

        let imageUrl = "";
        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            imageUrl = result.secure_url;
        }

        const collectionData = {
            name,
            description,
            image: imageUrl
        };

        const collection = new collectionModel(collectionData);
        await collection.save();

        res.json({ success: true, message: "Collection Created" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Collection
const updateCollection = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        const imageFile = req.file;

        const updateData = {
            name,
            description
        };

        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            updateData.image = result.secure_url;
        }

        const updatedCollection = await collectionModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCollection) {
            return res.json({ success: false, message: "Collection not found" });
        }

        res.json({ success: true, message: "Collection Updated", collection: updatedCollection });

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

module.exports = { addCollection, listCollections, removeCollection, updateCollection };
