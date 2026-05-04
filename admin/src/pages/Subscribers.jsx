import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Users, Mail, Calendar } from 'lucide-react'

const Subscribers = ({ token }) => {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/subscriber/list", { headers: { token } });
      if (response.data.success) {
        setSubscribers(response.data.subscribers);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchSubscribers();
  }, [])

  return (
    <div className="dashboard-container">
      <div className="table-header" style={{ border: 'none', padding: '0', marginBottom: '40px' }}>
        <h3 className="serif" style={{ fontSize: '32px' }}>Newsletter Audience</h3>
        <p>Manage your curators and subscribers</p>
      </div>

      <div className="bg-white border border-[#eee] overflow-hidden">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email Address</th>
              <th>Subscribed Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((item, index) => (
              <tr key={index}>
                <td style={{ fontSize: '11px', color: '#888' }}>{index + 1}</td>
                <td style={{ fontWeight: '600' }}>{item.email}</td>
                <td style={{ color: '#666' }}>{new Date(item.date).toLocaleDateString()}</td>
                <td>
                  <span style={{ fontSize: '9px', padding: '4px 10px', background: '#e6fffa', color: '#2d3748', borderRadius: '4px', fontWeight: '700' }}>
                    ACTIVE
                  </span>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No subscribers found yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Subscribers
