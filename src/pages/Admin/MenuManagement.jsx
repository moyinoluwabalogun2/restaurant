import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import './MenuManagement.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'mains',
    image: '',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true
  });

  // Fetch menu items in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
    });

    return unsubscribe;
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || getDefaultImage(formData.category),
        isVegetarian: formData.isVegetarian,
        isSpicy: formData.isSpicy,
        isAvailable: formData.isAvailable,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingItem) {
        // Update existing item
        await updateDoc(doc(db, 'menuItems', editingItem.id), itemData);
        toast.success('Menu item updated successfully!');
      } else {
        // Add new item
        await addDoc(collection(db, 'menuItems'), itemData);
        toast.success('Menu item added successfully!');
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      isVegetarian: item.isVegetarian || false,
      isSpicy: item.isSpicy || false,
      isAvailable: item.isAvailable !== false // Default to true
    });
  };

  const handleDelete = async (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await deleteDoc(doc(db, 'menuItems', itemId));
        toast.success('Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'mains',
      image: '',
      isVegetarian: false,
      isSpicy: false,
      isAvailable: true
    });
    setEditingItem(null);
  };

  const getDefaultImage = (category) => {
    const defaultImages = {
      starters: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&auto=format&fit=crop&q=80',
      mains: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&auto=format&fit=crop&q=80',
      desserts: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&auto=format&fit=crop&q=80',
      drinks: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&auto=format&fit=crop&q=80'
    };
    return defaultImages[category] || defaultImages.mains;
  };

  const getCategoryCount = (category) => {
    return menuItems.filter(item => item.category === category).length;
  };

  if (userData?.role !== 'admin') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-management-page">
      <div className="container">
        <div className="page-header">
          <h1>Menu Management</h1>
          <p>Add, edit, or remove items from your restaurant menu</p>
        </div>

        <div className="management-layout">
          {/* Add/Edit Form */}
          <div className="form-section">
            <div className="form-card">
              <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Item Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Describe the item... e.g., Classic pizza with fresh tomatoes, mozzarella, and basil"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="14.99"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="starters">Starters</option>
                      <option value="mains">Main Courses</option>
                      <option value="desserts">Desserts</option>
                      <option value="drinks">Drinks</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <small className="help-text">
                    Leave empty to use a default image, or paste a direct image URL from Unsplash
                  </small>
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Vegetarian 🌱
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isSpicy"
                      checked={formData.isSpicy}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Spicy 🌶️
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Available for Order
                  </label>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                  </button>
                  
                  {editingItem && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="list-section">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Items</h3>
                <div className="stat-number">{menuItems.length}</div>
              </div>
              <div className="stat-card">
                <h3>Main Courses</h3>
                <div className="stat-number">{getCategoryCount('mains')}</div>
              </div>
              <div className="stat-card">
                <h3>Starters</h3>
                <div className="stat-number">{getCategoryCount('starters')}</div>
              </div>
              <div className="stat-card">
                <h3>Desserts</h3>
                <div className="stat-number">{getCategoryCount('desserts')}</div>
              </div>
            </div>

            <div className="menu-items-list">
              <h3>Current Menu Items ({menuItems.length})</h3>
              
              {menuItems.length === 0 ? (
                <div className="empty-state">
                  <p>No menu items yet. Add your first item using the form!</p>
                </div>
              ) : (
                <div className="items-grid">
                  {menuItems.map(item => (
                    <div key={item.id} className="menu-item-card">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                        {!item.isAvailable && (
                          <div className="unavailable-badge">Unavailable</div>
                        )}
                      </div>
                      
                      <div className="item-content">
                        <div className="item-header">
                          <h4>{item.name}</h4>
                          <span className="item-price">${item.price}</span>
                        </div>
                        
                        <p className="item-description">{item.description}</p>
                        
                        <div className="item-meta">
                          <span className={`category-badge ${item.category}`}>
                            {item.category}
                          </span>
                          {item.isVegetarian && <span className="veg-badge">🌱 Veg</span>}
                          {item.isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
                        </div>
                        
                        <div className="item-actions">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, item.name)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;