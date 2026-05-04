import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, products, backendUrl } = useContext(ShopContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (search.trim().length > 0) {
            const filtered = products.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            ).slice(0, 5); // Show top 5 results
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [search, products]);

    // Close search bar on location change
    useEffect(() => {
        setShowSearch(false);
        setSearch('');
    }, [location]);

    if (!showSearch) return null;

    return (
        <div className="search-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.98)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '10vh',
            animation: 'fadeIn 0.3s ease'
        }}>
            {/* Close Button Top Right */}
            <button 
                onClick={() => setShowSearch(false)}
                style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1a1a1a'
                }}
            >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div style={{ width: '100%', maxWidth: '700px', padding: '0 20px' }}>
                <p style={{ fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold', marginBottom: '20px', color: '#888', textAlign: 'center' }}>WHAT ARE YOU LOOKING FOR?</p>
                
                {/* Search Input Field */}
                <div style={{ position: 'relative', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <input 
                        autoFocus
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        type="text" 
                        placeholder="SEARCH PRODUCTS..." 
                        style={{ 
                            width: '100%', 
                            border: 'none', 
                            background: 'none',
                            fontSize: '32px', 
                            letterSpacing: '1px', 
                            outline: 'none',
                            fontWeight: '300',
                            textTransform: 'uppercase',
                            fontFamily: 'inherit'
                        }} 
                    />
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1a1a1a' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>

                {/* Live Results Dropdown */}
                {search.trim().length > 0 && (
                    <div style={{ marginTop: '40px', width: '100%' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            {filteredProducts.length > 0 ? 'PRODUCT SUGGESTIONS' : 'NO PRODUCTS FOUND'}
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filteredProducts.map((item) => (
                                <Link 
                                    key={item._id} 
                                    to={`/product/${item._id}`}
                                    style={{ display: 'flex', alignItems: 'center', gap: '20px', textDecoration: 'none', color: 'inherit', padding: '10px', transition: 'background 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                >
                                    <img 
                                        src={item.image[0].startsWith('http') ? item.image[0] : `${backendUrl}/uploads/${item.image[0]}`} 
                                        alt="" 
                                        style={{ width: '60px', height: '80px', objectFit: 'cover' }} 
                                    />
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>{item.name}</h4>
                                        <p style={{ fontSize: '12px', color: '#888' }}>Rs.{item.price - (item.price * item.discount / 100)}</p>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default SearchBar;
