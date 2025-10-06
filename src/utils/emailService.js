import emailjs from '@emailjs/browser';

// Initialize EmailJS (you'll get these from emailjs.com)
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendOrderNotification = async (orderData) => {
  try {
    const templateParams = {
      order_id: orderData.id,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      order_total: `$${orderData.total?.toFixed(2)}`,
      order_items: orderData.items.map(item => 
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n'),
      delivery_address: orderData.deliveryAddress,
      delivery_city: orderData.city,
      delivery_instructions: orderData.deliveryInstructions || 'None',
      payment_method: orderData.paymentMethod === 'card' ? 'Credit Card' : 
                     orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Digital Wallet',
      estimated_delivery: orderData.estimatedDelivery,
      order_time: new Date().toLocaleString(),
      restaurant_name: 'Epicurean Restaurant',
      restaurant_phone: '+1 (555) 123-4567'
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('Order notification email sent successfully');
  } catch (error) {
    console.error('Failed to send order notification email:', error);
  }
};

export const sendSMSNotification = async (orderData) => {
  // This would integrate with Twilio or similar service
  console.log('SMS notification for order:', orderData.id);
  // Implementation for Twilio would go here
};