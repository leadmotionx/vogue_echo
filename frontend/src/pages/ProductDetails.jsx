import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Recommended from '../components/Recommended';
import './ProductDetails.css';
import { ShopContext } from '../context/ShopContext';

const ProductDetails = () => {
  const { productId } = useParams();
  const { products, currency, backendUrl, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeAccordion, setActiveAccordion] = useState('details');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return productData ? (
    <div className="product-details-page">
      <div className="container">
        <div className="product-main-layout">
          {/* Left Side: Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={image.startsWith('http') ? image : backendUrl + "/uploads/" + image} alt={productData.name} />
            </div>
            <div className="secondary-images">
              <div className="gallery-row" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {productData.image.map((item, index) => (
                  <img 
                    onClick={() => setImage(item)} 
                    key={index} 
                    src={item.startsWith('http') ? item : backendUrl + "/uploads/" + item} 
                    alt="" 
                    style={{ width: '100px', cursor: 'pointer', border: image === item ? '1px solid black' : 'none' }} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="product-info-sticky">
            {productData.isNewArrival && <span className="tag-small">NEW ARRIVAL</span>}
            <h1 className="product-title-large" style={{ textTransform: 'uppercase' }}>{productData.name}</h1>
            <div className="price-wrapper" style={{ display: 'flex', gap: '20px', alignItems: 'baseline', marginBottom: '20px', flexWrap: 'wrap' }}>
              <p className="product-price-large" style={{ fontSize: '28px', fontWeight: '400' }}>{currency}{productData.price - (productData.price * productData.discount / 100)}</p>
              {productData.discount > 0 && (
                <>
                  <p className="old-price" style={{ textDecoration: 'line-through', color: '#888', fontSize: '18px' }}>{currency}{productData.price}</p>
                  <span className="discount-tag" style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold', background: '#fee2e2', padding: '4px 12px', borderRadius: '4px' }}>{productData.discount}% OFF</span>
                </>
              )}
            </div>
            
            <p className="product-description-short">
              {productData.description}
            </p>

            <div className="size-selection-area">
              <div className="size-header">
                <span>SELECT SIZE</span>
                <button className="size-guide-btn">SIZE GUIDE</button>
              </div>
              <div className="size-grid">
                {productData.sizes.map((size, index) => (
                  <button 
                    key={index} 
                    className={`size-box ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={() => addToCart(productData._id, selectedSize)} className="btn-add-to-bag">ADD TO BAG</button>
              <button className="btn-find-store">FIND IN STORE</button>
            </div>

            {/* Accordions */}
            <div className="product-accordions">
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('details')}>
                  PRODUCT DETAILS
                  <span className={`icon ${activeAccordion === 'details' ? 'open' : ''}`}>+</span>
                </button>
                {activeAccordion === 'details' && (
                  <div className="accordion-content">
                    <p>Designed with architectural precision and premium materials. Part of our {productData.collection || 'Essential'} collection.</p>
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('composition')}>
                  COMPOSITION & CARE
                  <span className={`icon ${activeAccordion === 'composition' ? 'open' : ''}`}>+</span>
                </button>
                {activeAccordion === 'composition' && (
                  <div className="accordion-content">
                    <p>100% Premium Quality materials. Please refer to label for specific care instructions.</p>
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('shipping')}>
                  SHIPPING & RETURNS
                  <span className={`icon ${activeAccordion === 'shipping' ? 'open' : ''}`}>+</span>
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="accordion-content">
                    <p>Complimentary shipping and returns on all editorial orders.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look / Recommended */}
        <Recommended category={productData.category} />
      </div>
    </div>
  ) : <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading product details...</div>;
};

export default ProductDetails;
