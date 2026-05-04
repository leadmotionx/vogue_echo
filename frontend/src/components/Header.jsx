import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import './Header.css';
import { ShopContext } from '../context/ShopContext';

const Header = () => {
  const { token, setToken, getCartCount, setShowSearch } = useContext(ShopContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setMenuVisible(false);
  }

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={() => setMenuVisible(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <NavLink to="/">
            <img src={assets.logo} alt="Logo" className="logo" />
          </NavLink>
        </div>
        
        <nav className="header-center">
          <ul>
            <li><NavLink to="/collections">COLLECTIONS</NavLink></li>
            <li><NavLink to="/new-arrivals">NEW ARRIVALS</NavLink></li>
            <li><NavLink to="/contact">CONTACT</NavLink></li>
            <li><NavLink to="/about">ABOUT US</NavLink></li>
          </ul>
        </nav>

        <div className="header-right">
          <div className="search-icon-btn" onClick={() => setShowSearch(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span className="search-text">SEARCH</span>
          </div>
          
          <div className="header-icons">
            <div className="profile-group" style={{ position: 'relative' }}>
              {token ? (
                <div className="user-nav-item">
                   <button className="icon-btn profile-trigger">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                   </button>
                   <div className="profile-dropdown">
                      <Link to="/orders">MY ORDERS</Link>
                      <Link to="/track-order">TRACK SHIPMENT</Link>
                      <button onClick={logout} className="logout-btn">LOGOUT</button>
                   </div>
                </div>
              ) : (
                <NavLink to="/login" className="icon-btn-link">
                  <button className="icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </button>
                </NavLink>
              )}
            </div>
            
            <NavLink to="/cart" className="icon-btn-link cart-icon-wrapper" style={{ position: 'relative' }}>
              <button className="icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-sidebar ${menuVisible ? 'active' : ''}`}>
        <div className="sidebar-header">
            <img src={assets.logo} alt="Logo" className="sidebar-logo" />
            <button className="close-menu" onClick={() => setMenuVisible(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
        <nav className="mobile-nav">
            <NavLink onClick={() => setMenuVisible(false)} to="/">HOME</NavLink>
            <NavLink onClick={() => setMenuVisible(false)} to="/collections">COLLECTIONS</NavLink>
            <NavLink onClick={() => setMenuVisible(false)} to="/new-arrivals">NEW ARRIVALS</NavLink>
            <NavLink onClick={() => setMenuVisible(false)} to="/about">ABOUT US</NavLink>
            <NavLink onClick={() => setMenuVisible(false)} to="/contact">CONTACT</NavLink>
            {token ? (
                <>
                    <div className="sidebar-divider"></div>
                    <Link onClick={() => setMenuVisible(false)} to="/orders">MY ORDERS</Link>
                    <Link onClick={() => setMenuVisible(false)} to="/track-order">TRACK SHIPMENT</Link>
                    <button onClick={logout} className="sidebar-logout">LOGOUT</button>
                </>
            ) : (
                <NavLink onClick={() => setMenuVisible(false)} to="/login" className="sidebar-login">LOGIN</NavLink>
            )}
        </nav>
      </div>
      
      {/* Overlay */}
      {menuVisible && <div className="menu-overlay" onClick={() => setMenuVisible(false)}></div>}
    </header>
  );
};

export default Header;
