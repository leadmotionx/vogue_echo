import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Plus, Ticket } from "lucide-react";
import { backendUrl } from "../config";

const Promos = ({ token }) => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPromos = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/promo/list");
      if (response.data.success) {
        setPromos(response.data.promos);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/promo/add",
        { code, discount: Number(discount) },
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setCode("");
        setDiscount("");
        fetchPromos();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removePromo = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/promo/remove",
        { id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchPromos();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return (
    <div className="dashboard-container">
      <div
        className="table-header"
        style={{ border: "none", padding: "0", marginBottom: "40px" }}
      >
        <h3 className="serif" style={{ fontSize: "32px" }}>
          Promo Codes
        </h3>
        <p>Create and manage discount codes for your archival boutique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Promo Form */}
        <div className="lg:col-span-1">
          <div className=" p-8 border border-[#eee]">
            <h4 className="stat-title mb-6">Create New Promo</h4>
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
              <div className="input-group">
                <label>PROMO CODE</label>
                <input
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  value={code}
                  type="text"
                  placeholder="E.G. VOGUE20"
                  required
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              <div className="input-group">
                <label>DISCOUNT PERCENTAGE (%)</label>
                <input
                  onChange={(e) => setDiscount(e.target.value)}
                  value={discount}
                  type="number"
                  placeholder="20"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{ width: "100%", marginTop: "10px" }}
              >
                {loading ? "CREATING..." : "CREATE PROMO"}
              </button>
            </form>
          </div>
        </div>

        {/* Promos List */}
        <div className="lg:col-span-2">
          <div className="border border-[#eee]">
            <div className="p-6 border-bottom border-[#eee]">
              <h4 className="stat-title">Active Promo Codes</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fcfcfc] border-bottom border-[#eee]">
                  <tr>
                    <th className="p-4 text-left text-[10px] font-bold text-[#888] tracking-widest">
                      CODE
                    </th>
                    <th className="p-4 text-left text-[10px] font-bold text-[#888] tracking-widest">
                      DISCOUNT
                    </th>
                    <th className="p-4 text-left text-[10px] font-bold text-[#888] tracking-widest">
                      STATUS
                    </th>
                    <th className="p-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee]">
                  {promos.map((promo) => (
                    <tr
                      key={promo._id}
                      className="hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#f5f5f5] rounded">
                            <Ticket size={16} color="#1a1a1a" />
                          </div>
                          <span className="font-bold tracking-wider">
                            {promo.code}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-[#f0f9ff] text-[#0369a1] rounded-full text-[11px] font-bold">
                          {promo.discount}% OFF
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-[11px] text-[#10b981] font-bold uppercase">
                          <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full"></div>
                          Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => removePromo(promo._id)}
                          className="p-2 text-[#ef4444] hover:bg-[#fee2e2] rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {promos.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-12 text-center text-[#888] italic"
                      >
                        No active promo codes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promos;
