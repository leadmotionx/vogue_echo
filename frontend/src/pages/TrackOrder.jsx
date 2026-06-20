import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './TrackOrder.css';

const TrackOrder = () => {
    const { backendUrl, currency } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Auto-fill tracking ID from URL query params (from email link)
    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            setOrderId(idFromUrl);
            // Auto-track when ID comes from URL
            handleTrackById(idFromUrl);
        }
    }, [searchParams]);

    const handleTrackById = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/order/track', { orderId: id });
            if (response.data.success) {
                setOrderData(response.data.order);
            } else {
                toast.error("Order not found. Please check your tracking ID.");
                setOrderData(null);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        handleTrackById(orderId);
    };

    const getStatusIndex = (status) => {
        const statuses = ['Order Placed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered'];
        return statuses.indexOf(status);
    }

    return (
        <div className="track-page">
            <div className="container">
                <div className="track-hero">
                    <h1>Track your shipment</h1>
                    <p>Enter your Tracking ID to see the current status of your editorial pieces.</p>
                    
                    <form className="track-form" onSubmit={handleTrack}>
                        <div className="track-input-group">
                            <label>TRACKING IDENTIFIER</label>
                            <div className="input-with-btn">
                                <input 
                                    type="text" 
                                    placeholder="VE-2026-X8R2" 
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={loading}>
                                    {loading ? 'SEARCHING...' : 'TRACK STATUS'}
                                </button>
                            </div>
                            <p className="track-hint">You can find your Tracking ID in the confirmation email sent to your email address.</p>
                        </div>
                    </form>
                </div>

                {orderData && (
                    <div className="track-results">
                        <div className="track-status-header">
                            <div className="status-current">
                                <span className="label">CURRENT STATUS</span>
                                <h2>{orderData.status}</h2>
                            </div>
                            <div className="delivery-estimate">
                                <span className="label">TRACKING ID</span>
                                <p style={{fontWeight: '600', letterSpacing: '2px'}}>{orderData.orderId}</p>
                            </div>
                            <div className="delivery-estimate">
                                <span className="label">ESTIMATED DELIVERY</span>
                                <p>{new Date(orderData.date + 5 * 24 * 60 * 60 * 1000).toDateString()}</p>
                            </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="track-progress-bar">
                            {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                                const currentIdx = getStatusIndex(orderData.status);
                                let isActive = false;
                                if (idx === 0 && currentIdx >= 0) isActive = true;
                                if (idx === 1 && currentIdx >= 1) isActive = true;
                                if (idx === 2 && currentIdx >= 2) isActive = true;
                                if (idx === 3 && currentIdx >= 4) isActive = true;

                                return (
                                    <div key={idx} className={`progress-step ${isActive ? 'active' : ''}`}>
                                        <div className="step-circle"></div>
                                        <span className="step-label">{step}</span>
                                        {idx < 3 && <div className="step-line"></div>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="track-details-grid">
                            <div className="shipment-log">
                                <h3>SHIPMENT LOG</h3>
                                <div className="log-list">
                                    <div className="log-item active">
                                        <div className="log-date">{new Date(orderData.date).toLocaleDateString()}</div>
                                        <div className="log-info">
                                            <strong>{orderData.status}</strong>
                                            <p>Updated via Digital Flagship Store</p>
                                        </div>
                                    </div>
                                    <div className="log-item">
                                        <div className="log-date">{new Date(orderData.date).toLocaleDateString()}</div>
                                        <div className="log-info">
                                            <strong>Order received</strong>
                                            <p>Vogue Echo Warehouse</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-summary-card">
                                <h3>Order Summary</h3>
                                <div className="summary-items-list">
                                    {orderData.items.map((item, idx) => (
                                        <div key={idx} className="summary-item">
                                            <img src={item.image[0]} alt="" />
                                            <div className="item-txt">
                                                <h4>{item.name}</h4>
                                                <p>Size: {item.size} / Qty: {item.quantity}</p>
                                                <span>{currency}{item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="summary-totals">
                                    <div className="total-row"><span>SUBTOTAL</span><span>{currency}{orderData.amount}</span></div>
                                    <div className="total-row"><span>SHIPPING</span><span>COMPLIMENTARY</span></div>
                                    <div className="total-row final"><span>TOTAL</span><span>{currency}{orderData.amount}</span></div>
                                </div>
                                <div className="shipping-address-box">
                                    <h3>SHIPPING ADDRESS</h3>
                                    <p>{orderData.address.firstName} {orderData.address.lastName}</p>
                                    <p>{orderData.address.street}</p>
                                    <p>{orderData.address.city}, {orderData.address.zipcode}</p>
                                </div>
                            </div>
                        </div>

                        <div className="track-assistance">
                            <p>Need assistance? Our concierge team is available to assist with your delivery inquiries.</p>
                            <div className="assistance-links">
                                <a href="/contact">CONTACT CONCIERGE</a>
                                <a href="/faq">FAQ & RETURNS</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
