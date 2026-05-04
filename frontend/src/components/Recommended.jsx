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
      // Show up to 8 products for a better swiper experience
      setRecommended(filtered.slice(0, 8));
    }
  }, [products, category]);

  return (
    <section className="recommended-section">
      <div className="section-header">
        <span className="tag">COMPLETE THE LOOK</span>
        <h3>CURATED FOR YOU</h3>
      </div>
      
      <div className="recommended-swiper-wrapper">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1.2}
          navigation={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }}
          className="recommended-swiper"
        >
          {recommended.map(item => (
            <SwiperSlide key={item._id}>
              <Link to={`/product/${item._id}`} className="recommended-product-card">
                <div className="recommended-product-img">
                  <img 
                    src={item.image[0].startsWith('http') ? item.image[0] : backendUrl + "/uploads/" + item.image[0]} 
                    alt={item.name} 
                  />
                </div>
                <div className="recommended-product-info">
                   <h4>{item.name}</h4>
                   <p>{currency}{item.price}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        {recommended.length === 0 && <p className="empty-message">Searching for complementary pieces...</p>}
      </div>
    </section>
  );
};

export default Recommended;
