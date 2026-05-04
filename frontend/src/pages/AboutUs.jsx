import React from 'react';
import { assets } from '../assets/assets';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Section 1: Hero */}
        <section className="about-hero">
          <div className="hero-text">
            <h1>Refining the<br />Modern Canvas</h1>
            <p>
              Vogue Echo was founded on the belief that luxury is not about 
              excess, but about the surgical removal of the unnecessary. We curate 
              experiences for those who find beauty in silence.
            </p>
          </div>
          <div className="hero-image">
            <img src={assets.about_us} alt="About Vogue Echo" />
          </div>
        </section>

        {/* Section 2: Philosophy */}
        <section className="about-philosophy">
          <div className="philosophy-header">
            <div className="title-area">
              <span className="tag">OUR FOUNDATION</span>
              <h2>The Vogue Echo Philosophy</h2>
            </div>
            <div className="desc-area">
              <p>
                Luxury is an editorial choice. In a world of constant noise, we choose the 
                resonance of an echo—pure, intentional, and lasting. Our commitment to 
                'Minimalist Luxury' is reflected in every seam, every pixel, and every silence. 
                We do not just design; we refine until only the essence remains.
              </p>
            </div>
          </div>

          <div className="philosophy-grid">
            <div className="philosophy-item">
              <span className="number">01</span>
              <h3>Intentional Curation</h3>
              <p>Selecting only that which elevates the spirit and serves the function.</p>
            </div>
            <div className="philosophy-item">
              <span className="number">02</span>
              <h3>Architectural Integrity</h3>
              <p>Design built on the principles of structure, proportion, and balance.</p>
            </div>
            <div className="philosophy-item">
              <span className="number">03</span>
              <h3>Timeless Resonance</h3>
              <p>Creating objects that exist beyond the transience of seasonal trends.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Quote & Texture */}
        <section className="about-quote">
          <div className="quote-layout">
            <div className="texture-side">
              <div className="texture-img-box">
                <img src={assets.aboutus_2} alt="Editorial Sophistication" />
              </div>
              <span className="tag-small">EDITORIAL SOPHISTICATION</span>
              <p className="texture-desc">Every texture is a narrative of quality and heritage.</p>
            </div>
            <div className="quote-side">
              <blockquote>
                "Simplicity is the ultimate sophistication, but silence is the ultimate luxury."
              </blockquote>
              <cite>— THE ECHO MANIFESTO</cite>
            </div>
          </div>
        </section>

        {/* Section 4: Newsletter */}
        <section className="about-newsletter">
          <div className="newsletter-box">
            <h2>Join the Inner Circle</h2>
            <p>Receive curated updates on new collections and editorial stories from the world of Vogue Echo.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="EMAIL ADDRESS" />
              <button type="submit">SUBSCRIBE</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
