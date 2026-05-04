const productModel = require("../models/productModel");
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
    const image1 = req.files.image1 && req.files.image1[0].filename;
    const image2 = req.files.image2 && req.files.image2[0].filename;
    const image3 = req.files.image3 && req.files.image3[0].filename;
    const image4 = req.files.image4 && req.files.image4[0].filename;

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
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
      image: images,
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
