const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  collection: { type: String },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  isNewArrival: { type: Boolean, default: false },
  date: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

module.exports = productModel;
