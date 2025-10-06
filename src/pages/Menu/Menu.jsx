import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import MenuCard from '../../components/MenuCard/MenuCard';
import { sampleMenuItems } from '../../data/menuItems'; // Fallback data
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      
      if (querySnapshot.empty) {
        // If no data in Firestore, use fallback
        setMenuItems(sampleMenuItems);
        setFilteredItems(sampleMenuItems);
        setUsingFallback(true);
        
        // Extract categories from fallback data
        const cats = new Set(['all']);
        sampleMenuItems.forEach(item => cats.add(item.category));
        setCategories(Array.from(cats));
      } else {
        // Use data from Firestore
        const items = [];
        const cats = new Set(['all']);
        
        querySnapshot.forEach((doc) => {
          const item = { id: doc.id, ...doc.data() };
          items.push(item);
          cats.add(item.category);
        });
        
        setMenuItems(items);
        setFilteredItems(items);
        setCategories(Array.from(cats));
        setUsingFallback(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Use fallback data if Firestore fails
      setMenuItems(sampleMenuItems);
      setFilteredItems(sampleMenuItems);
      
      const cats = new Set(['all']);
      sampleMenuItems.forEach(item => cats.add(item.category));
      setCategories(Array.from(cats));
      setUsingFallback(true);
      setLoading(false);
    }
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === category));
    }
  };

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner"></div>
        <p>Loading delicious menu items...</p>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Discover our carefully crafted dishes made with passion and the finest ingredients</p>
          {usingFallback && (
            <div className="demo-notice">
              🚀 <strong>Demo Mode:</strong> Using sample menu data
            </div>
          )}
        </div>
      </div>

      <div className="menu-container">
        <div className="container">
          {/* Category Filters */}
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => filterByCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="menu-grid">
            {filteredItems.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="no-items">
              <h3>No items found in this category</h3>
              <p>Please try another category or check back later for new additions!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;