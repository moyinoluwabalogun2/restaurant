import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>Our Story</h1>
          <p>Passionate about creating unforgettable dining experiences</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Welcome to Epicurean</h2>
              <p>
                Founded in 2015, Epicurean has been serving exceptional cuisine crafted with 
                passion and the finest ingredients. Our journey began with a simple mission: 
                to create memorable dining experiences that celebrate both traditional flavors 
                and modern culinary innovation.
              </p>
              <p>
                Every dish tells a story, and our chefs pour their creativity and expertise 
                into each plate. We believe in sustainable sourcing, supporting local farmers, 
                and reducing our environmental footprint while delivering exceptional taste.
              </p>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" 
                alt="Restaurant interior" 
              />
            </div>
          </div>

          <div className="values-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h3>Sustainability</h3>
                <p>We source locally and practice sustainable methods to protect our planet.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">👨‍🍳</div>
                <h3>Quality</h3>
                <p>Only the finest ingredients make it to your plate, guaranteed.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">❤️</div>
                <h3>Passion</h3>
                <p>Every dish is prepared with love and attention to detail.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Community</h3>
                <p>We support and grow with our local community.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;