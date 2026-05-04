import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import './Success.css';

const Success = () => {
    const { setCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId || "N/A";

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
                        <span className="label">ORDER IDENTIFIER</span>
                        <h3 className="order-id-display">{orderId}</h3>
                        <p className="note">Please keep this ID for your records and shipment tracking.</p>
                    </div>

                    <div className="success-actions">
                        <button onClick={() => navigate('/orders')} className="btn-solid">VIEW MY ORDERS</button>
                        <button onClick={() => navigate('/')} className="btn-outline">RETURN TO STORE</button>
                    </div>

                    <div className="success-footer">
                        <p>A confirmation email has been sent to your registered address.</p>
                        <div className="footer-links">
                            <a href="/track-order">TRACK SHIPMENT</a>
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
