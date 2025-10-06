// Browser-based notifications only (no external APIs)
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showOrderNotification = (orderData, isAdmin = false) => {
  if (Notification.permission === 'granted') {
    let notification; // ✅ define once here

    if (isAdmin) {
      // Admin notification for new orders
      notification = new Notification('🍽️ New Order Received!', {
        body: `Order #${orderData.id.slice(-8)} from ${orderData.customerName} - $${orderData.total?.toFixed(2)}`,
        icon: '/vite.svg',
        tag: 'new-order',
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/admin/orders';
        notification.close();
      };
    } else {
      // Customer notification for order updates
      notification = new Notification('📦 Order Update', {
        body: `Your order #${orderData.id.slice(-8)} is now ${getStatusText(orderData.status)}`,
        icon: '/vite.svg',
        tag: 'order-update',
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/dashboard';
        notification.close();
      };
    }

    // ✅ Notification is always defined now, so no "not defined" error
    setTimeout(() => {
      notification.close();
    }, 8000);
  }
};

// Browser-based sound notification using Web Audio API
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {
    // ✅ Removed unused `error` variable
    console.log('\u0007'); // ASCII bell character fallback
  }
};

const getStatusText = (status) => {
  const statusMap = {
    pending: 'received',
    confirmed: 'confirmed',
    preparing: 'being prepared',
    out_for_delivery: 'out for delivery',
    delivered: 'delivered',
  };
  return statusMap[status] || status;
};
