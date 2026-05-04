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
    window.scrollTo(0,0);
  }, [productId, products]);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  if (!productData) {
      return <div className="loading-container">EXPLORING THE ARCHIVE...</div>
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="product-main-layout">
          
          {/* Gallery Section */}
          <div className="gallery-section">
            <div className="main-image-container">
              <img src={image.startsWith('http') ? image : backendUrl + "/uploads/" + image} alt={productData.name} />
            </div>
            <div className="thumbnails-wrapper">
              <div className="thumbnails-scroll">
                {productData.image.map((item, index) => (
                  <div 
                    key={index} 
                    className={`thumb-item ${image === item ? 'active' : ''}`}
                    onClick={() => setImage(item)}
                  >
                    <img src={item.startsWith('http') ? item : backendUrl + "/uploads/" + item} alt="" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            <div className="details-sticky-content">
              {productData.isNewArrival && <span className="product-badge">NEW ARRIVAL</span>}
              <h1 className="product-name">{productData.name}</h1>
              
              <div className="product-pricing">
                <span className="current-price">{currency}{productData.price - (productData.price * productData.discount / 100)}</span>
                {productData.discount > 0 && (
                  <>
                    <span className="original-price">{currency}{productData.price}</span>
                    <span className="discount-percent">{productData.discount}% OFF</span>
                  </>
                )}
              </div>

              <p className="product-summary">{productData.description}</p>

              <div className="size-selector-container">
                <div className="size-selector-header">
                  <label>SELECT SIZE</label>
                  <button className="guide-link">SIZE GUIDE</button>
                </div>
                <div className="size-options-grid">
                  {productData.sizes.map((size, index) => (
                    <button 
                      key={index} 
                      className={`size-option-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="purchase-actions">
                <button onClick={() => addToCart(productData._id, selectedSize)} className="add-to-cart-btn">
                  ADD TO SHOPPING BAG
                </button>
                <button className="wishlist-btn-outline">
                  SAVE TO WISHLIST
                </button>
              </div>

              <div className="product-info-accordions">
                <div className="info-accordion-item">
                  <div className="info-header" onClick={() => toggleAccordion('details')}>
                    <span>DESCRIPTION & FIT</span>
                    <span className="plus-minus">{activeAccordion === 'details' ? '−' : '+'}</span>
                  </div>
                  <div className={`info-body ${activeAccordion === 'details' ? 'open' : ''}`}>
                    <div className="info-content">
                      <p>A masterfully crafted piece from our {productData.collection || 'Editorial'} collection. Designed for a timeless silhouette with premium attention to detail.</p>
                      <ul>
                        <li>Premium Materials</li>
                        <li>Signature Vogue Echo Fit</li>
                        <li>Artisanal Craftsmanship</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="info-accordion-item">
                  <div className="info-header" onClick={() => toggleAccordion('shipping')}>
                    <span>SHIPPING & RETURNS</span>
                    <span className="plus-minus">{activeAccordion === 'shipping' ? '−' : '+'}</span>
                  </div>
                  <div className={`info-body ${activeAccordion === 'shipping' ? 'open' : ''}`}>
                    <div className="info-content">
                      <p>Complimentary standard shipping on all orders. Returns are accepted within 30 days of purchase in original condition.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Recommended category={productData.category} />
      </div>
    </div>
  );
};

export default ProductDetails;
