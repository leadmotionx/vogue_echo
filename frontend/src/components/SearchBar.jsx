import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useLocation } from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, products, backendUrl } = useContext(ShopContext);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [aiResults, setAiResults] = useState([]);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [searchMode, setSearchMode] = useState('smart'); // 'smart' or 'image'
    const [imagePreview, setImagePreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const location = useLocation();
    const fileInputRef = useRef(null);
    const searchTimerRef = useRef(null);

    // Classic instant filter for immediate results
    useEffect(() => {
        if (search.trim().length > 0) {
            const filtered = products.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            ).slice(0, 5);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
            setAiResults([]);
        }
    }, [search, products]);

    // AI Semantic Search with debounce
    useEffect(() => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        if (search.trim().length >= 3) {
            searchTimerRef.current = setTimeout(async () => {
                setIsAiSearching(true);
                try {
                    const response = await fetch(backendUrl + '/api/ai/semantic-search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: search.trim() })
                    });
                    const data = await response.json();
                    if (data.success && data.products) {
                        // Filter out products already in instant results
                        const instantIds = filteredProducts.map(p => p._id);
                        const uniqueAiResults = data.products.filter(p => !instantIds.includes(p._id));
                        setAiResults(uniqueAiResults.slice(0, 6));
                    }
                } catch (err) {
                    console.error('AI search error:', err);
                } finally {
                    setIsAiSearching(false);
                }
            }, 600); // 600ms debounce
        } else {
            setAiResults([]);
        }

        return () => {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, [search]);

    // Close search bar on location change
    useEffect(() => {
        setShowSearch(false);
        setSearch('');
        setAiResults([]);
        setImagePreview(null);
    }, [location]);

    // Image Search handler
    const handleImageSearch = async (file) => {
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);

        setIsAiSearching(true);
        setFilteredProducts([]);
        setAiResults([]);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(backendUrl + '/api/ai/image-search', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success && data.products) {
                setAiResults(data.products);
            }
        } catch (err) {
            console.error('Image search error:', err);
        } finally {
            setIsAiSearching(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageSearch(e.target.files[0]);
        }
    };

    // Drag and Drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageSearch(e.dataTransfer.files[0]);
        }
    };

    const clearImageSearch = () => {
        setImagePreview(null);
        setAiResults([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!showSearch) return null;

    return (
        <div 
            className="search-overlay" 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
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
                paddingTop: '8vh',
                animation: 'fadeIn 0.3s ease',
                overflowY: 'auto'
            }}>
            {/* Drag Overlay */}
            {dragActive && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(181, 152, 90, 0.08)',
                    border: '3px dashed #b5985a',
                    borderRadius: '0',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}>
                    <div style={{ textAlign: 'center', color: '#b5985a' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '12px' }}>Drop your image here to search</p>
                    </div>
                </div>
            )}

            {/* Close Button */}
            <button 
                onClick={() => setShowSearch(false)}
                style={{
                    position: 'absolute', top: '30px', right: '30px',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a1a'
                }}
            >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div style={{ width: '100%', maxWidth: '700px', padding: '0 20px' }}>
                {/* AI Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                    <span style={{ 
                        fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold', color: '#888' 
                    }}>WHAT ARE YOU LOOKING FOR?</span>
                    <span style={{ 
                        fontSize: '9px', padding: '3px 8px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #343d39, #4a5a52)', color: '#d4b76a',
                        fontWeight: '600', letterSpacing: '1px'
                    }}>AI POWERED</span>
                </div>
                
                {/* Search Input Field */}
                <div style={{ position: 'relative', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                        autoFocus
                        value={search} 
                        onChange={(e) => { setSearch(e.target.value); setImagePreview(null); }} 
                        type="text" 
                        placeholder="Try 'wedding outfit' or 'casual summer wear'..." 
                        style={{ 
                            width: '100%', border: 'none', background: 'none',
                            fontSize: '28px', letterSpacing: '0.5px', outline: 'none',
                            fontWeight: '300', fontFamily: 'inherit'
                        }} 
                    />
                    
                    {/* Image Search Button */}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        title="Search by Image"
                        style={{
                            background: 'none', border: '1.5px solid #ddd', cursor: 'pointer',
                            color: '#888', padding: '8px', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s', flexShrink: 0
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#b5985a'; e.currentTarget.style.color = '#b5985a'; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#888'; }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                    </button>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1a1a1a', flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                    <div style={{ 
                        marginTop: '20px', display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '14px', background: '#f9f8f6', borderRadius: '12px', border: '1px solid #eee'
                    }}>
                        <img src={imagePreview} alt="Search" style={{ 
                            width: '70px', height: '90px', objectFit: 'cover', borderRadius: '8px',
                            border: '1px solid #e5e5e1'
                        }} />
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#343d39', margin: 0 }}>
                                📸 Image Search Active
                            </p>
                            <p style={{ fontSize: '11px', color: '#888', margin: '4px 0 0 0' }}>
                                AI is matching your image to our catalog
                            </p>
                        </div>
                        <button 
                            onClick={clearImageSearch}
                            style={{ 
                                marginLeft: 'auto', background: 'none', border: '1px solid #ddd', 
                                cursor: 'pointer', padding: '6px 12px', borderRadius: '6px',
                                fontSize: '11px', color: '#888'
                            }}
                        >Clear</button>
                    </div>
                )}

                {/* AI Loading Animation */}
                {isAiSearching && (
                    <div style={{ 
                        marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[0,1,2].map(i => (
                                <span key={i} style={{
                                    width: '6px', height: '6px', borderRadius: '50%', background: '#b5985a',
                                    animation: `aiDotBounce 1.2s ease-in-out ${i * 0.15}s infinite`
                                }}></span>
                            ))}
                        </div>
                        <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>
                            AI is finding the best matches...
                        </span>
                    </div>
                )}

                {/* Instant Results */}
                {search.trim().length > 0 && filteredProducts.length > 0 && !imagePreview && (
                    <div style={{ marginTop: '30px', width: '100%' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            INSTANT MATCHES
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredProducts.map((item) => (
                                <ProductResultItem key={item._id} item={item} backendUrl={backendUrl} />
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Semantic Results */}
                {aiResults.length > 0 && (
                    <div style={{ marginTop: '30px', width: '100%' }}>
                        <p style={{ 
                            fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', 
                            borderBottom: '1px solid #eee', paddingBottom: '10px',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <span style={{ 
                                fontSize: '9px', padding: '2px 6px', borderRadius: '6px',
                                background: 'linear-gradient(135deg, #343d39, #4a5a52)', color: '#d4b76a',
                                fontWeight: '600'
                            }}>AI</span>
                            {imagePreview ? 'VISUALLY SIMILAR PRODUCTS' : 'AI RECOMMENDED'}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {aiResults.map((item) => (
                                <ProductResultItem key={item._id} item={item} backendUrl={backendUrl} />
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {search.trim().length > 2 && filteredProducts.length === 0 && aiResults.length === 0 && !isAiSearching && !imagePreview && (
                    <div style={{ marginTop: '40px', textAlign: 'center', color: '#999' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: '#ddd', marginBottom: '12px' }}>
                            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <p style={{ fontSize: '14px', fontWeight: '500' }}>No matches found</p>
                        <p style={{ fontSize: '12px', color: '#aaa' }}>Try different keywords or upload an image</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes aiDotBounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-6px); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

// Reusable Product Result Item
const ProductResultItem = ({ item, backendUrl }) => {
    const discountedPrice = Math.round(item.price - (item.price * item.discount / 100));
    
    return (
        <Link 
            to={`/product/${item._id}`}
            style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', 
                color: 'inherit', padding: '10px', transition: 'all 0.2s', borderRadius: '10px'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#f9f8f6'; e.currentTarget.style.transform = 'translateX(4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
        >
            <img 
                src={item.image[0].startsWith('http') ? item.image[0] : `${backendUrl}/uploads/${item.image[0]}`} 
                alt={item.name} 
                style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '6px' }} 
            />
            <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', margin: 0 }}>{item.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#343d39' }}>Rs.{discountedPrice}</span>
                    {item.discount > 0 && (
                        <>
                            <span style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through' }}>Rs.{item.price}</span>
                            <span style={{ fontSize: '10px', color: '#b5985a', fontWeight: '600' }}>-{item.discount}%</span>
                        </>
                    )}
                </div>
                <p style={{ fontSize: '10px', color: '#999', margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.category} • {item.subCategory}
                </p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>
    );
};

export default SearchBar;
