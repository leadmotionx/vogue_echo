import { Search, Bell, Menu } from 'lucide-react';

const Navbar = ({ setToken, setShowSidebar }) => {

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="flex items-center gap-4">
          <button className="menu-toggle-btn" onClick={() => setShowSidebar(true)}>
            <Menu size={20} />
          </button>
          <div className="navbar-search">
            <Search size={18} color="#888" />
            <input type="text" placeholder="Search archive..." />
          </div>
        </div>
        
        <div className="navbar-actions">
          <button className="navbar-icon-btn">
            <Bell size={20} />
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              background: '#1a1a1a', 
              color: 'white', 
              border: 'none', 
              padding: '8px 20px', 
              fontSize: '12px', 
              fontWeight: '600', 
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
