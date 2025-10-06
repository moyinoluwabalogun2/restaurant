import React from 'react';
import { useOrders } from '../../context/OrderContext';
import './OrderTracking.css';

const OrderTracking = ({ orderId }) => {
  const { orders, getOrderStatusColor, getOrderStatusText } = useOrders();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return <div>Order not found</div>;
  }

  const steps = [
    { key: 'pending', label: 'Order Received' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === order.status);

  return (
    <div className="order-tracking">
      <h3>Order Status</h3>
      <div className="tracking-progress">
        {steps.map((step, index) => (
          <div 
            key={step.key}
            className={`progress-step ${index <= currentStepIndex ? 'completed' : ''} ${index === currentStepIndex ? 'current' : ''}`}
          >
            <div className="step-indicator">
              {index < currentStepIndex ? '✓' : index + 1}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>
      <div className="current-status">
        <strong>Current Status:</strong> 
        <span style={{ color: getOrderStatusColor(order.status) }}>
          {getOrderStatusText(order.status)}
        </span>
      </div>
      {order.estimatedDelivery && (
        <div className="delivery-estimate">
          <strong>Estimated Delivery:</strong> {order.estimatedDelivery}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;