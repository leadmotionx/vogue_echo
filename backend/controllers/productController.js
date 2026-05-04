const productModel = require("../models/productModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      collection,
      category,
      subCategory,
      sizes,
      bestseller,
      isNewArrival,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    // Upload to Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        // Clean up local temporary file
        if (fs.existsSync(item.path)) {
          fs.unlinkSync(item.path);
        }
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      collection,
      category,
      subCategory,
      bestseller: bestseller === "true" || bestseller === true ? true : false,
      isNewArrival: isNewArrival === "true" || isNewArrival === true ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List Products (Excluding soft-deleted)
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({ isDeleted: false });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      discount,
      collection,
      category,
      subCategory,
      sizes,
      bestseller,
      isNewArrival,
    } = req.body;

    const updateData = {
      name,
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      collection,
      category,
      subCategory,
      bestseller: bestseller === "true" || bestseller === true ? true : false,
      isNewArrival: isNewArrival === "true" || isNewArrival === true ? true : false,
      sizes: JSON.parse(sizes),
    };

    // Handle Image Updates if files are provided
    if (req.files && Object.keys(req.files).length > 0) {
      const image1 = req.files.image1 && req.files.image1[0];
      const image2 = req.files.image2 && req.files.image2[0];
      const image3 = req.files.image3 && req.files.image3[0];
      const image4 = req.files.image4 && req.files.image4[0];

      const images = [image1, image2, image3, image4].filter(
        (item) => item !== undefined
      );

      if (images.length > 0) {
        let imagesUrl = await Promise.all(
          images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, {
              resource_type: "image",
            });
            if (fs.existsSync(item.path)) {
              fs.unlinkSync(item.path);
            }
            return result.secure_url;
          })
        );
        updateData.image = imagesUrl;
      }
    }

    await productModel.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Soft Delete Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndUpdate(req.body.id, { isDeleted: true });
    res.json({ success: true, message: "Product Removed (Soft Deleted)" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single Product Info
const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  listProducts,
  updateProduct,
  removeProduct,
  singleProduct,
};
