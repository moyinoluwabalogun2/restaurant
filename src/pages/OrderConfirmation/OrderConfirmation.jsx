import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId } = location.state || {};

  if (!orderId) {
    return (
      <div className="order-confirmation">
        <div className="container">
          <div className="confirmation-error">
            <h2>Order Not Found</h2>
            <p>We couldn't find your order details. Please check your order history.</p>
            <Link to="/dashboard" className="btn btn-primary">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="confirmation-content">
          <div className="confirmation-header">
            <div className="success-icon">✅</div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order. We're preparing your food with care.</p>
          </div>

          <div className="order-details">
            <div className="detail-card">
              <h3>Order Information</h3>
              <div className="detail-row">
                <span>Order ID:</span>
                <span className="order-id">{orderId}</span>
              </div>
              <div className="detail-row">
                <span>Estimated Delivery:</span>
                <span>30-45 minutes</span>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <span className="status pending">Being Prepared</span>
              </div>
            </div>

            <div className="tracking-steps">
              <h3>Order Tracking</h3>
              <div className="steps">
                <div className="step active">
                  <div className="step-number">1</div>
                  <div className="step-info">
                    <span className="step-title">Order Received</span>
                    <span className="step-time">Just now</span>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-info">
                    <span className="step-title">Preparing</span>
                    <span className="step-time">Up next</span>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-info">
                    <span className="step-title">Out for Delivery</span>
                    <span className="step-time">Coming soon</span>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-info">
                    <span className="step-title">Delivered</span>
                    <span className="step-time">Almost there!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Track Your Order
            </Link>
            <Link to="/menu" className="btn btn-secondary">
              Order More Food
            </Link>
          </div>

          <div className="support-info">
            <p>Need help with your order?</p>
            <div className="support-contacts">
              <span>📞 Call: +1 (555) 123-4567</span>
              <span>✉️ Email: support@epicurean.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;