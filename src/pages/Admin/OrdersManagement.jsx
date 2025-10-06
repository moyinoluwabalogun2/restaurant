import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import './OrdersManagement.css';

const OrdersManagement = () => {
  const { orders, updateOrderStatus, getOrderStatusColor, getOrderStatusText } = useOrders();
  const { userData } = useAuth();
  const [filter, setFilter] = useState('all');

  if (userData?.role !== 'admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#f59e0b' },
    { value: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
    { value: 'preparing', label: 'Preparing', color: '#8b5cf6' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: '#f97316' },
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444' }
  ];

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="orders-management-page">
      <div className="container">
        <div className="page-header">
          <h1>Orders Management</h1>
          <p>Manage and track all customer orders</p>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          {statusOptions.map(option => (
            <button
              key={option.value}
              className={`filter-btn ${filter === option.value ? 'active' : ''}`}
              onClick={() => setFilter(option.value)}
              style={{ 
                borderColor: filter === option.value ? option.color : 'transparent',
                color: filter === option.value ? option.color : 'var(--text-secondary)'
              }}
            >
              {option.label} ({orders.filter(o => o.status === option.value).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id.slice(-8)}</h3>
                  <span className="customer-name">{order.customerName}</span>
                  <span className="order-time">
                    {order.createdAt?.toDate().toLocaleString()}
                  </span>
                </div>
                <div className="order-total">${order.total?.toFixed(2)}</div>
              </div>

              <div className="order-details">
                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-meta">
                  <div className="meta-item">
                    <strong>Delivery:</strong>
                    <span>{order.deliveryAddress}, {order.city}</span>
                    {order.deliveryInstructions && (
                      <small>Instructions: {order.deliveryInstructions}</small>
                    )}
                  </div>
                  <div className="meta-item">
                    <strong>Contact:</strong>
                    <span>{order.customerPhone}</span>
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="meta-item">
                    <strong>Payment:</strong>
                    <span>{order.paymentMethod === 'card' ? 'Credit Card' : 
                           order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Digital Wallet'}</span>
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-actions">
                <div className="current-status">
                  <strong>Status:</strong>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getOrderStatusColor(order.status) }}
                  >
                    {getOrderStatusText(order.status)}
                  </span>
                </div>
                
                <div className="status-buttons">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      className={`status-btn ${order.status === option.value ? 'active' : ''}`}
                      onClick={() => handleStatusUpdate(order.id, option.value)}
                      disabled={order.status === option.value}
                      style={{
                        borderColor: option.color,
                        color: order.status === option.value ? 'white' : option.color,
                        backgroundColor: order.status === option.value ? option.color : 'transparent'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="no-orders">
              <h3>No orders found</h3>
              <p>There are no orders matching the current filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;