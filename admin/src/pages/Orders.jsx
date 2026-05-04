import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Package, MapPin, Phone, CreditCard, Calendar, Hash } from 'lucide-react'
import { backendUrl } from '../config'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/order/list", { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const statusHandler = async (event, orderId) => {
     try {
        const response = await axios.post(backendUrl + "/api/order/status", { orderId, status: event.target.value }, { headers: { token } });
        if (response.data.success) {
           await fetchOrders();
           toast.success("Status Updated");
        }
     } catch (error) {
        console.log(error);
        toast.error(error.message);
     }
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  return (
    <div className="admin-orders-page" style={{ padding: '40px' }}>
      <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
        <div>
          <h2 style={{ fontSize: '36px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'serif' }}>Curated Shipments</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Managing the logistics of archival elegance.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', letterSpacing: '2px' }}>TOTAL VOLUME</span>
          <p style={{ fontSize: '24px', fontWeight: '300' }}>{orders.length} ORDERS</p>
        </div>
      </div>

      <div className="orders-stack" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {orders.map((order, index) => (
          <div key={index} className="order-block" style={{ background: 'white', border: '1px solid #eee', padding: '0', display: 'grid', gridTemplateColumns: '1fr 300px' }}>
            <div className="order-main-info" style={{ padding: '30px' }}>
              <div className="order-top-bar" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f5f5f5', paddingBottom: '20px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                   <div style={{ background: '#000', color: '#fff', padding: '8px 15px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      NEW ORDER
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#888', fontWeight: '600' }}>
                      <Hash size={12} /> {order._id}
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: '#666' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(order.date).toLocaleDateString()}</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={14} /> {order.paymentMethod}</span>
                </div>
              </div>

              <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px' }}>
                 <div className="items-list">
                    <span style={{ fontSize: '10px', color: '#888', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '15px' }}>ARCHIVAL PIECES</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                         <span style={{ fontWeight: '500' }}>{item.name} <span style={{ color: '#888', fontSize: '11px' }}>x{item.quantity}</span></span>
                         <span style={{ color: '#888' }}>{item.size}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #eee', display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ fontSize: '11px', fontWeight: 'bold' }}>TOTAL VALUE</span>
                       <span style={{ fontSize: '18px', fontWeight: '300' }}>${order.amount}</span>
                    </div>
                 </div>

                 <div className="shipping-info">
                    <span style={{ fontSize: '10px', color: '#888', fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '15px' }}>DESTINATION DETAILS</span>
                    <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#444' }}>
                       <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{order.address.firstName} {order.address.lastName}</p>
                       <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}><MapPin size={14} style={{ marginTop: '3px' }} /> {order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                       <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}><Phone size={14} /> {order.address.phone}</p>
                       <p style={{ fontSize: '11px', color: '#888', marginTop: '10px' }}>{order.address.email}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="order-action-sidebar" style={{ background: '#fafafa', borderLeft: '1px solid #eee', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
               <div>
                  <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', display: 'block', marginBottom: '10px', letterSpacing: '1px' }}>SHIPMENT STATUS</label>
                  <select 
                    onChange={(e) => statusHandler(e, order._id)} 
                    value={order.status} 
                    style={{ width: '100%', padding: '15px', border: '1px solid #ddd', background: 'white', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: order.payment ? '#ecfdf5' : '#fff7ed', border: '1px solid', borderColor: order.payment ? '#10b98133' : '#f9731633' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: order.payment ? '#10b981' : '#f97316' }}></div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: order.payment ? '#065f46' : '#9a3412', letterSpacing: '1px' }}>
                    {order.payment ? 'PAYMENT VERIFIED' : 'PENDING SETTLEMENT'}
                  </span>
               </div>

               <button style={{ background: 'transparent', border: '1px solid #eee', padding: '12px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseOver={(e) => e.target.style.borderColor = '#000'} onMouseOut={(e) => e.target.style.borderColor = '#eee'}>
                  PRINT SHIPPING LABEL
               </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div style={{ padding: '150px 0', textAlign: 'center', color: '#aaa' }}>
            <Package size={48} style={{ margin: '0 auto 20px', opacity: 0.2 }} />
            <h3 style={{ fontSize: '20px', fontWeight: '300', letterSpacing: '1px' }}>No archival shipments detected.</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
