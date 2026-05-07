import React from 'react';
import { assets } from '../assets/assets';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-page">
      <div className="container">
        {/* Header Section */}
        <section className="contact-header">
          <div className="contact-logo-box">
            <img src={assets.logo} alt="Vogue Echo" />
          </div>
          <div className="contact-title-area">
            <h1>Connect with us</h1>
            <p>
              An invitation to dialogue. Our concierge team is available to assist you with 
              bespoke requests and private consultations.
            </p>
          </div>
        </section>

        {/* Main Content: Info + Form */}
        <section className="contact-main">
          <div className="contact-grid">
            {/* Left: Info */}
            <div className="contact-info">
              <div className="info-section">
                <span className="tag-small">THE FLAGSHIP</span>
                <address>
                  24 Rue du Faubourg Saint-Honoré<br />
                  75008 Paris, France
                </address>
                <p className="open-hours">
                  Open Monday — Saturday<br />
                  10:00 AM — 7:00 PM
                </p>
              </div>

              <div className="info-section">
                <span className="tag-small">DIRECT ENQUIRIES</span>
                <p className="contact-link">concierge@vogueecho.com</p>
                <a href="https://wa.me/923187371071" target="_blank" rel="noopener noreferrer" className="contact-link whatsapp-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  +92 318 7371071
                </a>
              </div>

              <div className="info-section">
                <span className="tag-small">FOLLOW THE ECHO</span>
                <div className="social-links">
                  <a href="https://www.facebook.com/share/1AuERFCUEb/" target="_blank" rel="noopener noreferrer"><span>FACEBOOK</span></a>
                  <a href="https://www.instagram.com/vougueecho?igsh=MXNqbmhyM3FxczNsMw==" target="_blank" rel="noopener noreferrer"><span>INSTAGRAM</span></a>
                  <a href="https://www.tiktok.com/@vougueecho4?_r=1&_t=ZS-969g6x6iM2J" target="_blank" rel="noopener noreferrer"><span>TIKTOK</span></a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <label>FULL NAME</label>
                  <input type="text" placeholder="Enter your name" />
                </div>
                
                <div className="input-group">
                  <label>EMAIL ADDRESS</label>
                  <input type="email" placeholder="email@address.com" />
                </div>

                <div className="input-group">
                  <label>SUBJECT</label>
                  <input type="text" placeholder="General Inquiry" />
                </div>

                <div className="input-group">
                  <label>MESSAGE</label>
                  <textarea placeholder="How may we assist you?" rows="5"></textarea>
                </div>

                <button type="submit" className="btn-send-message">SEND MESSAGE</button>
              </form>
            </div>
          </div>
        </section>

        {/* Bottom Architectural Image */}
        <section className="contact-bottom-image">
          <img src={assets.contact_bottom} alt="Flagship Architecture" />
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
