import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);

    const loadOrderData = async () => {
        try {
            if (!token) return;
            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
            if (response.data.success) {
                let allOrdersItem = [];
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status;
                        item['payment'] = order.payment;
                        item['paymentMethod'] = order.paymentMethod;
                        item['date'] = order.date;
                        item['orderId'] = order._id;
                        allOrdersItem.push(item);
                    });
                });
                setOrderData(allOrdersItem.reverse());
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadOrderData();
    }, [token]);

    return (
        <div className="orders-page">
            <div className="container">
                <div className="orders-header">
                    <span className="tag">DASHBOARD</span>
                    <h2>My Order History</h2>
                    <p className="subtitle">Track and manage your archival selections.</p>
                </div>

                <div className="orders-list">
                    {orderData.map((item, index) => (
                        <div key={index} className="order-item-card">
                            <div className="order-left-info">
                                <img src={backendUrl + "/uploads/" + item.image[0]} alt="" className="order-img" />
                                <div className="order-text">
                                    <h4 className="item-name">{item.name}</h4>
                                    <div className="order-meta">
                                        <span>{currency}{item.price}</span>
                                        <span className="meta-sep">|</span>
                                        <span>Qty: {item.quantity}</span>
                                        <span className="meta-sep">|</span>
                                        <span>Size: {item.size}</span>
                                    </div>
                                    <p className="order-date">Date: <span>{new Date(item.date).toDateString()}</span></p>
                                    <div className="order-id-tag">
                                        <span className="id-label">ID:</span>
                                        <span className="id-value">{item.orderId}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="order-status-side">
                                <div className="status-indicator">
                                    <span className={`status-dot ${item.status.toLowerCase()}`}></span>
                                    <span className="status-text">{item.status}</span>
                                </div>
                                <button onClick={loadOrderData} className="btn-track-mini">TRACK STATUS</button>
                            </div>
                        </div>
                    ))}
                    {orderData.length === 0 && <p style={{textAlign: 'center', padding: '100px 0', color: '#888'}}>You haven't placed any archival orders yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default Orders;
