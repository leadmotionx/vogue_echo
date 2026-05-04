import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Plus,
  Layers
} from 'lucide-react';

const Sidebar = ({ setToken, showSidebar, setShowSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Add Items', path: '/inventory/add', icon: <Plus size={18} /> },
    { name: 'List Items', path: '/inventory', icon: <Package size={18} /> },
    { name: 'Collections', path: '/manage-collections', icon: <Layers size={18} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={18} /> },
    { name: 'Promos', path: '/promos', icon: <Plus size={18} /> },
    { name: 'Subscribers', path: '/subscribers', icon: <Users size={18} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
      <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="serif">Admin Portal</h1>
          <p>Vogue Echo Management</p>
        </div>
        <button className="menu-toggle" onClick={() => setShowSidebar(false)} style={{ margin: 0, padding: '5px' }}>
          <X size={20} />
        </button>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px 0', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: '700' }}>
            <span style={{ margin: 'auto' }}>AD</span>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600' }}>Admin User</p>
            <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Chief Curator</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '15px 0', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#888', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
