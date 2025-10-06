import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../context/OrderContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { userData } = useAuth();
  const { orders, getOrderStatusColor, getOrderStatusText } = useOrders();

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {userData?.name}!</h1>
          <p>Here's your dining experience at a glance</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Orders</h3>
                <Link to="/orders" className="view-all">View All</Link>
              </div>
              {recentOrders.length > 0 ? (
                <div className="orders-list">
                  {recentOrders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <span className="order-id">#{order.id.slice(-8)}</span>
                        <span className="order-date">
                          {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getOrderStatusColor(order.status) }}
                        >
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                      <div className="order-total">${order.total?.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No recent orders</p>
                  <Link to="/menu" className="btn btn-primary">Order Now</Link>
                </div>
              )}
            </div>
            
            <div className="dashboard-card">
              <h3>Favorite Items</h3>
              <div className="empty-state">
                <p>No favorites yet</p>
                <button className="btn btn-secondary">Browse Menu</button>
              </div>
            </div>
            
            <div className="dashboard-card">
              <h3>Account Details</h3>
              <div className="account-info">
                <div className="info-row">
                  <span>Name:</span>
                  <span>{userData?.name}</span>
                </div>
                <div className="info-row">
                  <span>Email:</span>
                  <span>{userData?.email}</span>
                </div>
                <div className="info-row">
                  <span>Phone:</span>
                  <span>{userData?.phone || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span>Member since:</span>
                  <span>{new Date(userData?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;