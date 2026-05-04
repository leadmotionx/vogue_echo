import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Home.css';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const { products, collections, backendUrl, currency } = useContext(ShopContext);
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/subscriber/add", { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Filter products for New Arrivals (e.g. first 4 items marked as isNewArrival)
  const latestProducts = products.filter(item => item.isNewArrival).slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section ... unchanged */}
      <section className="hero-swiper-section">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect={'fade'}
          speed={2000}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="mySwiper"
        >
          <SwiperSlide>
            <img src={assets.about_us} alt="" className="hero-slide-img" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={assets.archive_1} alt="" className="hero-slide-img" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={assets.arrival_1} alt="" className="hero-slide-img" />
          </SwiperSlide>
        </Swiper>
        
        <div className="hero-overlay">
          <div className="hero-main-content">
            <img src={assets.logo} alt="VOGUE ECHO" className="hero-large-logo" />
            <div className="hero-text">
              <span className="subtitle">SEASONAL CURATION</span>
              <h2 className="title">The Quiet Sophisticate</h2>
            </div>
            <div className="hero-actions">
              <Link to="/new-arrivals" className="btn-solid">SHOP COLLECTION</Link>
              <button className="btn-outline">EXPLORE ARCHIVE</button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section - Dynamic */}
      <section className="new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title-group">
              <span className="tag">NEW ARRIVALS</span>
              <h3>Essential Tailoring</h3>
            </div>
            <Link to="/new-arrivals" className="view-all-link">VIEW ALL</Link>
          </div>
          
          <div className="products-grid">
            {latestProducts.map((item, index) => (
              <Link to={`/product/${item._id}`} key={index} className="product-card">
                <div className="product-img-wrapper">
                  <img src={item.image[0].startsWith('http') ? item.image[0] : backendUrl + "/uploads/" + item.image[0]} alt={item.name} />
                </div>
                <div className="product-info">
                  <h4>{item.name}</h4>
                  <div className="price-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <p>{currency}{item.price - (item.price * item.discount / 100)}</p>
                    {item.discount > 0 && (
                      <>
                        <p className="old-price" style={{ textDecoration: 'line-through', color: '#888', fontSize: '11px' }}>{currency}{item.price}</p>
                        <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 'bold' }}>{item.discount}% OFF</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {latestProducts.length === 0 && <p style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#888' }}>Our curation is currently being archived.</p>}
          </div>
        </div>
      </section>

      {/* The Curation Section - Dynamic */}
      <section className="curation-section">
        <div className="container">
          <div className="section-center-header">
            <span className="tag">THE CURATION</span>
            <h3>Seasonal Collections</h3>
          </div>
          
          <div className="curation-grid">
            {collections.slice(0, 3).map((collection, index) => (
              <Link to="/collections" key={collection._id} className="curation-item" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                <div className="curation-img-wrapper">
                  <img src={collection.image ? (collection.image.startsWith('http') ? collection.image : backendUrl + "/uploads/" + collection.image) : assets.collection_1} alt={collection.name} />
                  <div className="item-label">
                    <span className="num">0{index + 1}</span>
                    <h4>{collection.name}</h4>
                  </div>
                </div>
              </Link>
            ))}
            {collections.length === 0 && <p style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#888' }}>Our seasonal archives are currently being curated.</p>}
          </div>
        </div>
      </section>

      {/* The Archive Section - Unchanged */}
      <section className="archive-section">
        <div className="container archive-container">
          <div className="archive-text-side">
            <span className="tag">THE ARCHIVE</span>
            <h3>Preserving Legacy Through Design.</h3>
            <p>
              Our archive represents a decade of intentional craftsmanship. Each piece is 
              re-released in limited quantities, honoring the original silhouettes that defined 
              the Vogue Echo aesthetic.
            </p>
            <button className="btn-outline-dark">DISCOVER THE HISTORY</button>
          </div>
          <div className="archive-image-side">
            <div className="image-collage">
              <div className="collage-left">
                <img src={assets.archive_1} alt="Archive 1" />
              </div>
              <div className="collage-right">
                <img src={assets.archive_2} alt="Archive 2" className="collage-top" />
                <img src={assets.archive_3} alt="Archive 3" className="collage-bottom" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journal / Newsletter Section - Dynamic */}
      <section className="journal-newsletter-section">
        <div className="container">
          <div className="journal-content">
            <span className="tag">JOURNAL</span>
            <h3>Echoes of the Aesthetic</h3>
            <p className="journal-desc">
              Join our inner circle for exclusive access to archival drops, private viewings, and editorial
              insights delivered monthly.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <button type="submit" className="btn-subscribe">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

