import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import './Success.css';

const Success = () => {
    const { setCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId || "N/A";
    const email = location.state?.email || "";

    useEffect(() => {
        // Clear cart on reaching success page
        setCartItems({});
        localStorage.removeItem('cartItems');
    }, []);

    return (
        <div className="success-page">
            <div className="container">
                <div className="success-card">
                    <div className="success-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="tag">ORDER CONFIRMED</span>
                    <h1>Thank you for your archival selection.</h1>
                    <p>Your order has been received and is currently being processed by our curation team.</p>
                    
                    <div className="order-number-box">
                        <span className="label">YOUR TRACKING ID</span>
                        <h3 className="order-id-display">{orderId}</h3>
                        <p className="note">Save this Tracking ID — you'll need it to track your shipment.</p>
                    </div>

                    {email && (
                        <div className="email-confirm-box">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <p>A confirmation email with your Tracking ID has been sent to <strong>{email}</strong></p>
                        </div>
                    )}

                    <div className="success-actions">
                        <button onClick={() => navigate(`/track-order?id=${orderId}`)} className="btn-solid">TRACK MY ORDER</button>
                        <button onClick={() => navigate('/')} className="btn-outline">RETURN TO STORE</button>
                    </div>

                    <div className="success-footer">
                        <p>Use your Tracking ID to check your order status anytime.</p>
                        <div className="footer-links">
                            <a href={`/track-order?id=${orderId}`}>TRACK SHIPMENT</a>
                            <span>|</span>
                            <a href="/contact">NEED ASSISTANCE?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;
