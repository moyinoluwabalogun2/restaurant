import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { currentUser, userData } = useAuth();
  const { createOrder, loading } = useOrders();
  const navigate = useNavigate();

  // ✅ Pre-fill delivery info with user's saved data (if available)
  const [formData, setFormData] = useState({
    deliveryAddress: userData?.address || '',
    city: userData?.city || '',
    postalCode: userData?.postalCode || '',
    deliveryInstructions: '',
    paymentMethod: 'card',
    deliveryOption: 'standard',
  });

  const [deliveryAddressSame, setDeliveryAddressSame] = useState(true);

  useEffect(() => {
    // Redirect if not logged in or cart empty
    if (!currentUser) {
      navigate('/login');
    } else if (cart.length === 0) {
      navigate('/menu');
    }
  }, [currentUser, cart, navigate]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateDeliveryTime = () => {
    const times = {
      standard: '30-45 minutes',
      express: '15-25 minutes',
      scheduled: 'At selected time',
    };
    return times[formData.deliveryOption] || '30-45 minutes';
  };

  const calculateDeliveryFee = () => {
    const fees = {
      standard: 2.99,
      express: 5.99,
      scheduled: 2.99,
    };
    return fees[formData.deliveryOption] || 2.99;
  };

  const calculateTotal = () => {
    const subtotal = getCartTotal();
    const deliveryFee = calculateDeliveryFee();
    const tax = subtotal * 0.08;
    return subtotal + deliveryFee + tax;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        ...formData,
        deliveryFee: calculateDeliveryFee(),
        estimatedDelivery: calculateDeliveryTime(),
        items: cart,
        subtotal: getCartTotal(),
        tax: getCartTotal() * 0.08,
        total: calculateTotal(),
        userId: currentUser?.uid,
        customerName: userData?.name || 'Guest',
      };

      const orderId = await createOrder(orderData);

      // ✅ Clear the cart after successful order
      clearCart();

      // ✅ Redirect to confirmation page
      navigate('/order-confirmation', { state: { orderId } });
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = calculateDeliveryFee();
  const tax = subtotal * 0.08;
  const total = calculateTotal();

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>
            Complete your order below
            {userData?.name && (
              <span style={{ fontWeight: 600 }}> — Welcome back, {userData.name}!</span>
            )}
          </p>
        </div>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Delivery Information */}
            <section className="checkout-section">
              <h2>Delivery Information</h2>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={deliveryAddressSame}
                    onChange={(e) => setDeliveryAddressSame(e.target.checked)}
                  />
                  Use my saved account address
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryAddress">Delivery Address *</label>
                  <input
                    type="text"
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Your city"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="Postal code"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="deliveryInstructions">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="deliveryInstructions"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Gate code, building instructions, etc."
                />
              </div>
            </section>

            {/* Delivery Options */}
            <section className="checkout-section">
              <h2>Delivery Options</h2>
              <div className="delivery-options">
                {['standard', 'express', 'scheduled'].map((option) => (
                  <label key={option} className="delivery-option">
                    <input
                      type="radio"
                      name="deliveryOption"
                      value={option}
                      checked={formData.deliveryOption === option}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <span className="option-title">
                        {option.charAt(0).toUpperCase() + option.slice(1)} Delivery
                      </span>
                      <span className="option-time">
                        {option === 'standard'
                          ? '30-45 minutes'
                          : option === 'express'
                          ? '15-25 minutes'
                          : 'Choose your time'}
                      </span>
                      <span className="option-price">
                        ${calculateDeliveryFee().toFixed(2)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section className="checkout-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {['card', 'cash', 'digital'].map((method) => (
                  <label key={method} className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                    />
                    <span>
                      {method === 'card'
                        ? 'Credit/Debit Card'
                        : method === 'cash'
                        ? 'Cash on Delivery'
                        : 'Digital Wallet'}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <button
              type="submit"
              className="btn btn-primary checkout-btn"
              disabled={loading}
            >
              {loading
                ? 'Placing Order...'
                : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="delivery-info">
              <h4>Delivery Information</h4>
              <p>
                <strong>Estimated delivery:</strong> {calculateDeliveryTime()}
              </p>
              <p>
                <strong>Payment method:</strong>{' '}
                {formData.paymentMethod === 'card'
                  ? 'Credit/Debit Card'
                  : formData.paymentMethod === 'cash'
                  ? 'Cash on Delivery'
                  : 'Digital Wallet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;