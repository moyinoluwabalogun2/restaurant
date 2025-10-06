import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../context/OrderContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './AdminDashboard.css';
import { initializeMenuItems } from '../../utils/initializeDatabase';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const { orders } = useOrders();
  const [recentOrders, setRecentOrders] = useState([]);
  const [unreadOrders, setUnreadOrders] = useState(0);
  const [menuItems] = useState([]); // <-- fixed: only need menuItems, not the setter

  // Real-time notifications for new orders
  useEffect(() => {
    if (!userData || userData.role !== 'admin') return;

    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentOrders(newOrders.slice(0, 5));
      setUnreadOrders(newOrders.length);
    });

    return unsubscribe;
  }, [userData]);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const deliveryOrders = orders.filter(order => order.status === 'out_for_delivery');

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome, {userData?.name}. Manage your restaurant efficiently.</p>
            </div>
            {unreadOrders > 0 && (
              <div className="notification-badge">
                {unreadOrders} New Order{unreadOrders > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {/* Quick Stats */}
          <div className="admin-stats">
            <div className="stat-card">
              <h3>New Orders</h3>
              <div className="stat-number" style={{ color: '#f59e0b' }}>
                {pendingOrders.length}
              </div>
              <p>Require attention</p>
            </div>
            <div className="stat-card">
              <h3>Preparing</h3>
              <div className="stat-number" style={{ color: '#8b5cf6' }}>
                {preparingOrders.length}
              </div>
              <p>In kitchen</p>
            </div>
            <div className="stat-card">
              <h3>Out for Delivery</h3>
              <div className="stat-number" style={{ color: '#f97316' }}>
                {deliveryOrders.length}
              </div>
              <p>On the way</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <div className="stat-number" style={{ color: '#10b981' }}>
                ${orders.reduce((total, order) => total + (order.total || 0), 0).toFixed(2)}
              </div>
              <p>This month</p>
            </div>
          </div>

          {/* Recent Orders Alert */}
          {recentOrders.length > 0 && (
            <div className="orders-alert">
              <div className="alert-header">
                <h3>🆕 New Orders Require Attention</h3>
                <span className="alert-count">{recentOrders.length} new</span>
              </div>
              <div className="alert-orders">
                {recentOrders.map(order => (
                  <div key={order.id} className="alert-order">
                    <div className="order-info">
                      <strong>Order #{order.id.slice(-8)}</strong>
                      <span>{order.customerName}</span>
                      <span>${order.total?.toFixed(2)}</span>
                    </div>
                    <div className="order-time">
                      {order.createdAt?.toDate().toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="admin-actions">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <button className="action-card" onClick={() => window.location.href = '/admin/orders'}>
                <div className="action-icon">📦</div>
                <span>Manage Orders</span>
                {pendingOrders.length > 0 && (
                  <span className="action-badge">{pendingOrders.length}</span>
                )}
              </button>

              <button 
                className="action-card" 
                onClick={() => window.location.href = '/admin/menu'}
              >
                <div className="action-icon">🍽️</div>
                <span>Manage Menu</span>
                <span className="action-badge">{menuItems.length}</span>
              </button>

              <button className="action-card" onClick={() => window.location.href = '/admin/analytics'}>
                <div className="action-icon">📊</div>
                <span>Analytics</span>
              </button>

              <button className="action-card" onClick={() => window.location.href = '/admin/settings'}>
                <div className="action-icon">⚙️</div>
                <span>Settings</span>
              </button>

              <button 
                onClick={initializeMenuItems}
                className="btn btn-secondary"
              >
                Initialize Sample Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
