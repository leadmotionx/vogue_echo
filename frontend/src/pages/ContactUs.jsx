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
                <p className="contact-link">+33 (0) 1 45 67 89 00</p>
              </div>

              <div className="info-section">
                <span className="tag-small">FOLLOW THE ECHO</span>
                <div className="social-links">
                  <span>INSTAGRAM</span>
                  <span>PINTEREST</span>
                  <span>TIKTOK</span>
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
