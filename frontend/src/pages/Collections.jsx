import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import "./Collections.css";
import { ShopContext } from "../context/ShopContext";

const Collections = () => {
  const { collections, products, currency, backendUrl, search } = useContext(ShopContext);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);

  useEffect(() => {
    let filtered = products;

    // Filter by Collection
    if (selectedCollection) {
      filtered = filtered.filter(item => 
        item.collection && item.collection.trim().toLowerCase() === selectedCollection.name.trim().toLowerCase()
      );
    }

    // Filter by Search Query
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setCollectionProducts(filtered);
  }, [selectedCollection, products, search]);

  return (
    <div className="collections-page">
      <div className="container">
        {/* Collections Header */}
        <header className="collections-header">
          <div className="header-content-centered">
            <span className="tag">EXPLORE</span>
            <h1>{selectedCollection ? selectedCollection.name : "Our Collections"}</h1>
            <p className="subtitle-desc">
              {selectedCollection 
                ? selectedCollection.description 
                : "Each collection is a chapter in our story of craftsmanship, defined by quality and timeless design."}
            </p>
            {selectedCollection && (
              <button className="btn-outline-dark mt-6" onClick={() => setSelectedCollection(null)}>
                BACK TO ALL COLLECTIONS
              </button>
            )}
          </div>
        </header>

        {/* Collections Grid - Show when no collection is selected */}
        {!selectedCollection && (
          <div className="collections-grid-layout">
            {collections.map((collection, index) => (
              <div
                key={collection._id}
                className={`collection-card ${index % 3 === 0 ? "large" : ""}`}
                onClick={() => setSelectedCollection(collection)}
                style={{ cursor: 'pointer' }}
              >
                <div className="collection-img-wrapper">
                  <img src={collection.image ? backendUrl + "/uploads/" + collection.image : assets.collection_1} alt={collection.name} />
                  <div className="collection-overlay">
                    <div className="overlay-content">
                      <span className="overlay-tag">ARCHIVE</span>
                      <h2 className="overlay-title">{collection.name}</h2>
                      <p className="overlay-desc">{collection.description}</p>
                      <button className="btn-explore-collection">
                        VIEW COLLECTION
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {collections.length === 0 && <p style={{ textAlign: 'center', width: '100%', padding: '80px', color: '#888' }}>Our seasonal archives are currently being curated.</p>}
          </div>
        )}

        {/* Collection Products Grid - Show when a collection is selected */}
        {selectedCollection && (
          <div className="product-grid-main" style={{ marginTop: '60px' }}>
             <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                {collectionProducts.map((product, index) => (
                  <Link to={`/product/${product._id}`} key={index} className="product-card-link">
                    <div className="product-card">
                      <div className="product-image">
                        <img src={backendUrl + "/uploads/" + product.image[0]} alt={product.name} />
                        {product.bestseller && <span className="product-tag">BESTSELLER</span>}
                        {product.discount > 0 && <span className="discount-tag-float" style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '4px 8px', fontSize: '10px', fontWeight: 'bold' }}>{product.discount}% OFF</span>}
                      </div>
                      <div className="product-details">
                        <span className="prod-cat">{product.category}</span>
                        <h3 className="prod-title">{product.name}</h3>
                        <div className="price-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <p className="prod-price">{currency}{product.price - (product.price * product.discount / 100)}</p>
                          {product.discount > 0 && (
                            <>
                              <p className="old-price" style={{ textDecoration: 'line-through', color: '#888', fontSize: '13px' }}>{currency}{product.price}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {collectionProducts.length === 0 && (
                  <div style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1', padding: '100px 0' }}>
                    <p style={{ color: '#888', fontSize: '18px' }}>This collection currently has no items.</p>
                    <button className="btn-outline-dark mt-6" onClick={() => setSelectedCollection(null)}>
                      EXPLORE OTHER COLLECTIONS
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {!selectedCollection && (
        <div className="container">
          {/* Seasonal Feature Section */}
          <section className="seasonal-feature">
            <div className="feature-container">
              <div className="feature-text">
                <span className="tag">SEASONAL EDIT</span>
                <h2>The Summer Archive 2026</h2>
                <p>
                  Lightweight fabrics meet structured forms in our latest
                  exploration of summer tailoring. Discover the limited release
                  now.
                </p>
                <Link to="/new-arrivals" className="btn-outline-dark">
                  SHOP THE EDIT
                </Link>
              </div>
              <div className="feature-image">
                <img src={assets.about_us} alt="Seasonal Feature" />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Collections;
