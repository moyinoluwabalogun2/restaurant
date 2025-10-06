// src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Savor Exceptional 
            <span className="highlight"> Culinary Delights</span>
          </h1>
          <p className="hero-subtitle">
            Experience the perfect blend of traditional flavors and modern culinary artistry. 
            Fresh ingredients, masterful preparation, and unforgettable dining experiences.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">
              Order Now
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Restaurant interior" 
            loading="eager"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Epicurean?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍳</div>
              <h3>Master Chefs</h3>
              <p>Our award-winning chefs create culinary masterpieces using the finest ingredients.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Hot, fresh meals delivered to your doorstep in under 30 minutes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Fresh Ingredients</h3>
              <p>We source locally and sustainably for the freshest flavors possible.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>5-Star Rated</h3>
              <p>Join thousands of satisfied customers who love our food and service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Experience Great Food?</h2>
          <p>Join our community of food lovers and discover your new favorite dishes.</p>
          {!currentUser && (
            <Link to="/signup" className="btn btn-primary">
              Create Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;