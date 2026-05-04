import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Edit, Eye, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/product/list",
      );
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/product/remove",
          { id },
          { headers: { token } },
        );
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchList();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="serif" style={{ fontSize: "32px" }}>
            Inventory List
          </h3>
          <p>Manage and organize your archival pieces</p>
        </div>
        <div className="flex gap-4">
          <div
            className="navbar-actions"
            style={{
              background: "white",
              padding: "10px 20px",
              border: "1px solid #eee",
            }}
          >
            <Search size={18} color="#888" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                marginLeft: "10px",
              }}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list
              .filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item, index) => (
                <tr key={index}>
                <td style={{ padding: "15px 40px" }}>
                  <img
                    src={`http://localhost:4000/uploads/${item.image[0]}`}
                    alt=""
                    style={{
                      width: "50px",
                      height: "65px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td style={{ fontWeight: "600" }}>{item.name}</td>
                <td style={{ color: "#666" }}>
                  {item.category}
                  <div style={{ fontSize: '10px', color: '#a88a6d', fontWeight: 'bold', marginTop: '4px' }}>
                    {item.collection || 'NO COLLECTION'}
                  </div>
                </td>
                <td style={{ fontWeight: "700" }}>
                  Rs.{item.price - (item.price * item.discount / 100)}
                  {item.discount > 0 && (
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      <span style={{ textDecoration: 'line-through' }}>Rs.{item.price}</span>
                      <span style={{ color: '#ef4444', marginLeft: '5px', fontWeight: 'bold' }}>{item.discount}% OFF</span>
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex gap-4">
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#888",
                      }}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/inventory/edit/${item._id}`)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#888",
                      }}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                      }}
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div style={{ padding: "100px", textAlign: "center", color: "#888" }}>
            <p
              className="serif"
              style={{ fontSize: "24px", marginBottom: "10px" }}
            >
              Empty Collection
            </p>
            <p style={{ fontSize: "13px" }}>
              Start adding products to your inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
