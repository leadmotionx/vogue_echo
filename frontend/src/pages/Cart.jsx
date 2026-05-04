import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Recommended from "../components/Recommended";
import "./Cart.css";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getCartAmount, backendUrl } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-layout">
          {/* Left Side: Selection */}
          <div className="cart-selection">
            <header className="selection-header">
              <h2>Your Selection</h2>
              <span className="item-count">{cartData.length} {cartData.length === 1 ? 'ITEM' : 'ITEMS'}</span>
            </header>

            <div className="cart-items-list">
              {cartData.map((item, index) => {
                const productData = products.find((p) => p._id === item._id);
                return (
                  <div key={index} className="cart-item">
                    <div className="item-img">
                      <img src={backendUrl + "/uploads/" + productData.image[0]} alt={productData.name} />
                    </div>
                    <div className="item-info">
                      <div className="info-header">
                        <h3>{productData.name}</h3>
                        <button onClick={() => updateQuantity(item._id, item.size, 0)} className="remove-btn">✕</button>
                      </div>
                      <p className="item-variant">SIZE {item.size}</p>

                      <div className="item-actions">
                        <div className="quantity-selector">
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                        <span className="item-price">
                          {currency}{(productData.price - (productData.price * productData.discount / 100)) * item.quantity}
                          {productData.discount > 0 && (
                            <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '11px', marginLeft: '10px' }}>
                              {currency}{productData.price * item.quantity}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {cartData.length === 0 && <p style={{ padding: '60px 0', textAlign: 'center', color: '#888' }}>Your selection is empty.</p>}
            </div>
          </div>

          {/* Right Side: Summary */}
          <aside className="cart-summary-box">
            <div className="summary-inner">
              <h2>Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{currency}{getCartAmount()}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span className="complimentary">Complimentary</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span className="small-note">Calculated at Checkout</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>{currency}{getCartAmount()}</span>
              </div>

              <Link to="/checkout" className="btn-checkout-link">
                <button className="btn-checkout" disabled={cartData.length === 0}>PROCEED TO CHECKOUT</button>
              </Link>

              <div className="summary-footer">
                <p>Complimentary shipping on all orders.</p>
                <p>Secure checkout powered by Vogue Echo.</p>
                <div className="secure-icons" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="cart-recommended">
          <Recommended />
        </div>
      </div>
    </div>
  );
};

export default Cart;
