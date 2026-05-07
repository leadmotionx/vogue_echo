import React from "react";
import { assets } from "../assets/assets";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="vogue-footer">
      <div className="footer-content">
        <div className="footer-col brand-info">
          <img src={assets.logo} alt="VOGUE ECHO" className="footer-logo" />
          <p className="footer-desc">
            A DIGITAL FLAGSHIP DEDICATED TO THE ART OF MINIMALIST TAILORING AND
            EDITORIAL CURATION.
          </p>
        </div>

        <div className="footer-col info-links">
          <h4>INFORMATION</h4>
          <ul>
            <li>
              <a href="#newsletter">NEWSLETTER</a>
            </li>
            <li>
              <a href="#shipping">SHIPPING</a>
            </li>
            <li>
              <a href="#returns">RETURNS</a>
            </li>
            <li>
              <a href="#privacy">PRIVACY POLICY</a>
            </li>
            <li>
              <a href="#contact">CONTACT</a>
            </li>
          </ul>
        </div>

        <div className="footer-col ">
          <h4>FOLLOW US</h4>
          <div className="social-icons">
            {/* Facebook */}
            <a href="https://www.facebook.com/share/1AuERFCUEb/" target="_blank" rel="noopener noreferrer" title="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/vougueecho?igsh=MXNqbmhyM3FxczNsMw==" target="_blank" rel="noopener noreferrer" title="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* TikTok */}
            <a href="https://www.tiktok.com/@vougueecho4?_r=1&_t=ZS-969g6x6iM2J" target="_blank" rel="noopener noreferrer" title="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/923187371071" target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
          </div>
          <p className="copyright">© 2025 VOGUE ECHO. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
