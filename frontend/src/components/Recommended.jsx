import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './Recommended.css';
import { ShopContext } from '../context/ShopContext';

const Recommended = ({ category }) => {
  const { products, currency, backendUrl } = useContext(ShopContext);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let filtered = products;
      if (category) {
        filtered = products.filter(item => item.category === category);
      }
      // Show up to 6 products
      setRecommended(filtered.slice(0, 6));
    }
  }, [products, category]);

  return (
    <section className="recommended-section" style={{ padding: '80px 0' }}>
      <div className="section-header-left" style={{ marginBottom: '40px' }}>
        <span className="tag">COMPLETE THE LOOK</span>
        <h3 style={{ fontSize: '24px', marginTop: '10px', letterSpacing: '1px' }}>CURATED FOR YOU</h3>
      </div>
      
      <div className="recommended-swiper-wrapper">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 }
          }}
          className="recommended-swiper"
        >
          {recommended.map(item => (
            <SwiperSlide key={item._id}>
              <Link to={`/product/${item._id}`} className="product-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="product-image" style={{ height: '400px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                  <img 
                    src={item.image[0].startsWith('http') ? item.image[0] : backendUrl + "/uploads/" + item.image[0]} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="product-details-row" style={{ marginTop: '15px' }}>
                  <div className="details-text">
                    <h3 className="prod-title-small" style={{ textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>{item.name}</h3>
                    <p className="prod-price-small" style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>{currency}{item.price}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {recommended.length === 0 && <p style={{ padding: '40px 0', color: '#888', textAlign: 'center' }}>Searching for complementary pieces...</p>}
      </div>
    </section>
  );
};

export default Recommended;
