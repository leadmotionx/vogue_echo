import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import Recommended from '../components/Recommended';
import './NewArrivals.css';
import { ShopContext } from '../context/ShopContext';

const NewArrivals = () => {
  const { products, currency, backendUrl, search } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let result = products.filter(item => item.isNewArrival);
    
    if (category !== "All") {
      result = result.filter(item => item.category === category);
    }

    if (search) {
      result = result.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    setFilterProducts(result);
  }, [products, category, search]);

  return (
    <div className="new-arrivals-page">
      <div className="container">
        {/* Header Section */}
        <header className="arrivals-header">
          <div className="header-left-text">
            <span className="tag">CURATED SELECTION</span>
            <h1>{category === "All" ? "New Arrivals" : category + "'s Collection"}</h1>
          </div>
          <div className="header-right-desc">
            <p>
              Premium quality {category === "All" ? "curated items" : category + "'s pieces"}, designed for comfort and the modern minimalist aesthetic.
            </p>
          </div>
        </header>

        <div className="arrivals-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-group">
              <h4>CATEGORY</h4>
              <ul>
                <li className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>
                  <span>All Products</span> 
                  <span className="count">{products.filter(i => i.isNewArrival).length}</span>
                </li>
                <li className={category === "Men" ? "active" : ""} onClick={() => setCategory("Men")}>
                  <span>Men</span> 
                  <span className="count">{products.filter(i => i.isNewArrival && i.category === "Men").length}</span>
                </li>
                <li className={category === "Women" ? "active" : ""} onClick={() => setCategory("Women")}>
                  <span>Women</span> 
                  <span className="count">{products.filter(i => i.isNewArrival && i.category === "Women").length}</span>
                </li>
                <li className={category === "Kids" ? "active" : ""} onClick={() => setCategory("Kids")}>
                  <span>Kids</span> 
                  <span className="count">{products.filter(i => i.isNewArrival && i.category === "Kids").length}</span>
                </li>
              </ul>
            </div>

            <div className="filter-group">
              <h4>SIZE</h4>
              <div className="size-options">
                <button>XS</button>
                <button className="active">S</button>
                <button>M</button>
                <button>L</button>
                <button>XL</button>
              </div>
            </div>

            <div className="filter-group">
              <h4>COLOR</h4>
              <div className="color-swatches">
                <button className="swatch black active"></button>
                <button className="swatch white"></button>
                <button className="swatch grey"></button>
                <button className="swatch tan"></button>
                <button className="swatch light-grey"></button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="product-grid-main">
            <div className="grid-container">
              {filterProducts.map((product, index) => (
                <Link to={`/product/${product._id}`} key={index} className="product-card-link">
                  <div className="product-card">
                    <div className="product-image">
                      <img src={backendUrl + "/uploads/" + product.image[0]} alt={product.name} />
                      {product.bestseller && <span className="product-tag">BESTSELLER</span>}
                    </div>
                    <div className="product-details">
                      <span className="prod-cat">{product.category}</span>
                      <h3 className="prod-title">{product.name}</h3>
                      <div className="price-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <p className="prod-price">{currency}{product.price - (product.price * product.discount / 100)}</p>
                        {product.discount > 0 && (
                          <>
                            <p className="old-price" style={{ textDecoration: 'line-through', color: '#888', fontSize: '12px' }}>{currency}{product.price}</p>
                            <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 'bold' }}>{product.discount}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {filterProducts.length === 0 && <p className="text-center py-20 w-full col-span-full">No arrivals found in this category.</p>}
            </div>
          </main>
        </div>

        {/* Recommended Section Component */}
        <Recommended />
      </div>
    </div>
  );
};

export default NewArrivals;



