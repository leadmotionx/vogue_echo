import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import './Header.css';
import { ShopContext } from '../context/ShopContext';

const Header = () => {
  const { token, setToken, getCartCount, setShowSearch } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
  }

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <NavLink to="/">
            <img src={assets.logo} alt="Logo" className="logo" />
          </NavLink>
        </div>
        <nav className="header-center">
          <ul>
             <li><NavLink to="/collections" className={({isActive}) => isActive ? 'active' : ''}>COLLECTIONS</NavLink></li>
            <li><NavLink to="/new-arrivals" className={({isActive}) => isActive ? 'active' : ''}>NEW ARRIVALS</NavLink></li>
            <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>CONTACT</NavLink></li>
            <li><NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>ABOUT US</NavLink></li>
          </ul>
        </nav>
        <div className="header-right">
          <div className="search-icon-btn" onClick={() => setShowSearch(prev => !prev)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>SEARCH</span>
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
                {getCartCount() > 0 && <span className="cart-badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'black', color: 'white', fontSize: '9px', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getCartCount()}</span>}
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
