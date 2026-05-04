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
            <a href="#global">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </a>
            <a href="#instagram">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#youtube">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.42-5.58z"></path>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
          <p className="copyright">© 2024 VOGUE ECHO. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
