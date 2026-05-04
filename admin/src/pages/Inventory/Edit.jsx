import React, { useEffect, useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../../config";

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [collection, setCollection] = useState("");
  const [collectionsList, setCollectionsList] = useState([]);
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/collection/list");
      if (response.data.success) {
        setCollectionsList(response.data.collections);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchProductData = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/single",
        { id },
      );
      if (response.data.success) {
        const product = response.data.product;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setDiscount(product.discount);
        setCollection(product.collection);
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setBestseller(product.bestseller);
        setIsNewArrival(product.isNewArrival);
        setSizes(product.sizes);
        setExistingImages(product.image);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProductData();
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        {
          id,
          name,
          description,
          price,
          discount,
          collection,
          category,
          subCategory,
          bestseller,
          isNewArrival,
          sizes: JSON.stringify(sizes),
        },
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/inventory");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div
        className="table-header"
        style={{ border: "none", padding: "0", marginBottom: "40px" }}
      >
        <h3 className="serif" style={{ fontSize: "32px" }}>
          Edit Product
        </h3>
        <p>Refine your archival collection details</p>
      </div>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-8">
        <div className="bg-white p-10 border border-[#eee]">
          <p className="stat-title mb-6">Current Images</p>
          <div className="flex gap-6">
            {existingImages.map((img, idx) => (
              <div
                key={idx}
                style={{
                  width: "120px",
                  height: "150px",
                  border: "1px solid #eee",
                  overflow: "hidden",
                }}
              >
                <img
                  src={img.startsWith('http') ? img : backendUrl + "/uploads/" + img}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#888", marginTop: "15px" }}>
            Note: Image update is currently restricted to new additions. Archive
            edit focuses on metadata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg-grid-cols-2 gap-8">
          <div className="bg-white p-10 border border-[#eee] flex flex-col gap-6">
            <p className="stat-title">Product Details</p>

            <div className="input-group">
              <label>Select Collection</label>
              <select onChange={(e) => setCollection(e.target.value)} value={collection}>
                <option value="">None / Basic</option>
                {collectionsList.map((col) => (
                  <option key={col._id} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Product Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
              />
            </div>

            <div className="input-group">
              <label>Product Description</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="input-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              <div className="input-group">
                <label>Sub Category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 border border-[#eee] flex flex-col gap-8">
            <p className="stat-title">Pricing & Attributes</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="input-group">
                <label>Original Price (PKR)</label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  type="number"
                  placeholder="5000"
                  required
                />
              </div>
              <div className="input-group">
                <label>Discount (%)</label>
                <input
                  onChange={(e) => setDiscount(e.target.value)}
                  value={discount}
                  type="number"
                  placeholder="20"
                />
              </div>
            </div>

            <div>
              <label
                className="stat-title"
                style={{
                  fontSize: "10px",
                  marginBottom: "15px",
                  display: "block",
                }}
              >
                Available Sizes
              </label>
              <div className="flex gap-3">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <div
                    key={size}
                    onClick={() =>
                      setSizes((prev) =>
                        prev.includes(size)
                          ? prev.filter((item) => item !== size)
                          : [...prev, size],
                      )
                    }
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #eee",
                      cursor: "pointer",
                      background: sizes.includes(size) ? "#1a1a1a" : "white",
                      color: sizes.includes(size) ? "white" : "#1a1a1a",
                      fontWeight: "700",
                      fontSize: "12px",
                    }}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setBestseller((prev) => !prev)}
            >
              <input
                type="checkbox"
                checked={bestseller}
                readOnly
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1a1a1a",
                }}
              />
              <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                Mark as Bestseller
              </label>
            </div>

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsNewArrival((prev) => !prev)}
            >
              <input
                type="checkbox"
                checked={isNewArrival}
                readOnly
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1a1a1a",
                }}
              />
              <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                Mark as New Arrival
              </label>
            </div>

            <button
              type="submit"
              className="login-btn"
              style={{ marginTop: "auto" }}
            >
              Update Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;
