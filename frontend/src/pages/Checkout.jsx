import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import "./Checkout.css";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const {
    products,
    currency,
    cartItems,
    getCartAmount,
    delivery_fee,
    token,
    backendUrl,
    setToken,
    appliedPromo,
    promoDiscount,
    applyPromoCode,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    zipcode: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const subtotal = getCartAmount();
      const discountAmount = (subtotal * promoDiscount) / 100;

      let orderData = {
        address: formData,
        items: orderItems,
        amount: subtotal - discountAmount + delivery_fee,
        promoCode: appliedPromo,
        discount: discountAmount,
      };

      if (paymentMethod === "cod") {
        let response;
        if (token) {
          // Logged in user - use authenticated endpoint
          response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } },
          );
        } else {
          // Guest user - use guest endpoint (no auth required)
          response = await axios.post(
            backendUrl + "/api/order/guest",
            orderData,
          );
        }
        if (response.data.success) {
          toast.success("Order placed successfully!");
          navigate("/success", { state: { orderId: response.data.orderId, email: formData.email } });
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.info("Online payment integration coming soon.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <form onSubmit={onSubmitHandler} className="checkout-layout">
          {/* Left Column: Forms */}
          <div className="checkout-main">
            <section className="checkout-section">
              <h3>Shipping Information</h3>
              <div className="checkout-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>FIRST NAME</label>
                    <input
                      required
                      name="firstName"
                      onChange={onChangeHandler}
                      value={formData.firstName}
                      type="text"
                      placeholder="Julianne"
                    />
                  </div>
                  <div className="input-group">
                    <label>LAST NAME</label>
                    <input
                      required
                      name="lastName"
                      onChange={onChangeHandler}
                      value={formData.lastName}
                      type="text"
                      placeholder="Moore"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>EMAIL ADDRESS</label>
                  <input
                    required
                    name="email"
                    onChange={onChangeHandler}
                    value={formData.email}
                    type="email"
                    placeholder="julianne@example.com"
                  />
                </div>

                <div className="input-group">
                  <label>ADDRESS</label>
                  <input
                    required
                    name="street"
                    onChange={onChangeHandler}
                    value={formData.street}
                    type="text"
                    placeholder="725 Fifth Avenue"
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>CITY</label>
                    <input
                      required
                      name="city"
                      onChange={onChangeHandler}
                      value={formData.city}
                      type="text"
                      placeholder="New York"
                    />
                  </div>
                  <div className="input-group">
                    <label>POSTAL CODE</label>
                    <input
                      required
                      name="zipcode"
                      onChange={onChangeHandler}
                      value={formData.zipcode}
                      type="text"
                      placeholder="10022"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>PHONE NUMBER</label>
                  <input
                    required
                    name="phone"
                    onChange={onChangeHandler}
                    value={formData.phone}
                    type="text"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <div
                  className={`payment-card ${paymentMethod === "cod" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    readOnly
                  />
                  <div className="payment-details">
                    <strong>Cash on Delivery (COD)</strong>
                    <p>Pay with cash upon delivery of your order.</p>
                  </div>
                </div>
                <div
                  className={`payment-card ${paymentMethod === "card" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    readOnly
                  />
                  <div className="payment-details">
                    <strong>Credit / Debit Card</strong>
                    <p>Secure payment via encrypted gateway.</p>
                  </div>
                </div>
              </div>
            </section>

            <button type="submit" className="btn-continue-checkout">
              PLACE ORDER <span className="arrow">→</span>
            </button>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="checkout-sidebar">
            <div className="order-summary-box">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>SUBTOTAL</span>
                <span>
                  {currency}
                  {getCartAmount()}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="summary-row" style={{ color: "#a88a6d" }}>
                  <span>DISCOUNT ({promoDiscount}%)</span>
                  <span>
                    -{currency}
                    {(getCartAmount() * promoDiscount) / 100}
                  </span>
                </div>
              )}
              <div className="summary-row">
                <span>SHIPPING</span>
                <span>
                  {delivery_fee === 0
                    ? "Complimentary"
                    : currency + delivery_fee}
                </span>
              </div>
            </div>

            <div
              className="promo-section"
              style={{
                padding: "20px 0",
                borderTop: "1px solid #f0f0f0",
                borderBottom: "1px solid #f0f0f0",
                margin: "20px 0",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#888",
                  letterSpacing: "1px",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                PROMO CODE
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #ddd",
                    fontSize: "11px",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => applyPromoCode(promoCode)}
                  style={{
                    background: "#1a1a1a",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  APPLY
                </button>
              </div>
              {appliedPromo && (
                <p
                  style={{
                    fontSize: "10px",
                    color: "#10b981",
                    marginTop: "10px",
                    fontWeight: "bold",
                  }}
                >
                  CODE APPLIED: {appliedPromo}
                </p>
              )}
            </div>

            <div className="summary-total-large">
              <span>TOTAL</span>
              <span>
                {currency}
                {getCartAmount() -
                  (getCartAmount() * promoDiscount) / 100 +
                  delivery_fee}
              </span>
            </div>

            <div
              className="summary-footer"
              style={{
                marginTop: "30px",
                borderTop: "1px solid #eee",
                paddingTop: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#888",
                  marginBottom: "15px",
                }}
              >
                By placing your order, you agree to the Vogue Echo terms of
                service and privacy policy.
              </p>
              <div
                className="checkout-trust-icons"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  className="trust-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "10px",
                    color: "#666",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  SECURE SSL ENCRYPTION
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
