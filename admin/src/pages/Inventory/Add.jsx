import React, { useState, useEffect } from "react";
import { Upload, X, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [collection, setCollection] = useState("");
  const [collectionsList, setCollectionsList] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [sizes, setSizes] = useState([]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/collection/list");
      if (response.data.success) {
        setCollectionsList(response.data.collections);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("collection", collection);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("isNewArrival", isNewArrival);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        "http://localhost:4000/api/product/add",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setDiscount("");
        setSizes([]);
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
          Add New Product
        </h3>
        <p>Curate your collection with new arrivals</p>
      </div>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-8">
        {/* Image Upload Section */}
        <div className=" p-10 border border-[#eee]">
          <p className="stat-title mb-6">Product Images</p>
          <div className="flex gap-6">
            {[image1, image2, image3, image4].map((img, idx) => (
              <label
                key={idx}
                htmlFor={`image${idx + 1}`}
                className="cursor-pointer"
              >
                <div
                  style={{
                    width: "120px",
                    height: "150px",
                    border: "1px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fcfcfc",
                    overflow: "hidden",
                  }}
                >
                  {!img ? (
                    <Upload size={24} color="#ccc" />
                  ) : (
                    <img
                      src={URL.createObjectURL(img)}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <input
                  onChange={(e) =>
                    [setImage1, setImage2, setImage3, setImage4][idx](
                      e.target.files[0],
                    )
                  }
                  type="file"
                  id={`image${idx + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg-grid-cols-2 gap-8">
          {/* Details Section */}
          <div className=" p-10 border border-[#eee] flex flex-col gap-6">
            <p className="stat-title">Product Details</p>

            <div className="input-group">
              <label>Product Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Silk Drape Blazer"
                required
              />
            </div>

            <div className="input-group">
              <label>Product Description</label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Write something elegant about this piece..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="input-group">
                <label>Category</label>
                <select onChange={(e) => setCategory(e.target.value)}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              <div className="input-group">
                <label>Sub Category</label>
                <select onChange={(e) => setSubCategory(e.target.value)}>
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Sizes */}
          <div className=" p-10 border border-[#eee] flex flex-col gap-8">
            <p className="stat-title">Pricing & Attributes</p>

            <div className="input-group">
              <label>Select Collection</label>
              <select onChange={(e) => setCollection(e.target.value)} value={collection}>
                <option value="">None / Basic</option>
                {collectionsList.map((col) => (
                  <option key={col._id} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

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
              Publish Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Add;
