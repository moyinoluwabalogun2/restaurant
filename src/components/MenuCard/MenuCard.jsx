// src/components/MenuCard/MenuCard.jsx
import React from 'react';
import { useCart } from '../../context/useCart';
import './MenuCard.css';

const MenuCard = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <div className="menu-card">
      <div className="card-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        <div className="card-overlay">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="card-content">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-description">{item.description}</p>
        <div className="card-footer">
          <span className="item-price">${item.price}</span>
          {item.isVegetarian && <span className="veg-badge">🌱 Veg</span>}
          {item.isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;