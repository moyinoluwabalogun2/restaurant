/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/useCart';
import {
  showOrderNotification,
  playNotificationSound,
  requestNotificationPermission
} from '../utils/notificationService';
import toast from 'react-hot-toast';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, userData } = useAuth();
  const { cart, clearCart, getCartTotal } = useCart();

  const previousOrdersRef = useRef([]); // 👈 this helps avoid re-renders in useEffect

  // 🧩 Request notification permission when admin logs in
  useEffect(() => {
    if (userData?.role === 'admin') {
      requestNotificationPermission();
    }
  }, [userData?.role]);

  // 🧩 Real-time order listener — no warnings, no infinite loop
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    const q =
      userData?.role === 'admin'
        ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
        : query(
            collection(db, 'orders'),
            where('customerId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
          );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 🔔 Notify admin about new orders (no dependency warnings)
      if (userData?.role === 'admin') {
        const oldOrders = previousOrdersRef.current;
        if (ordersData.length > oldOrders.length) {
          const newOrders = ordersData.filter(
            (newOrder) => !oldOrders.find((oldOrder) => oldOrder.id === newOrder.id)
          );

          newOrders.forEach((order) => {
            if (order.status === 'pending') {
              showOrderNotification(order, true);
              playNotificationSound();
              toast.success(
                `New order from ${order.customerName} - $${order.total?.toFixed(2)}`,
                {
                  duration: 6000,
                  position: 'top-right',
                }
              );
            }
          });
        }
        previousOrdersRef.current = ordersData;
      }

      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [currentUser, userData?.role]);

  // 🧩 Create a new order
  const createOrder = useCallback(
    async (orderData) => {
      setLoading(true);
      try {
        const order = {
          ...orderData,
          customerId: currentUser.uid,
          customerName: userData.name,
          customerEmail: userData.email,
          customerPhone: userData.phone,
          items: cart,
          subtotal: getCartTotal(),
          deliveryFee: orderData.deliveryFee || 2.99,
          tax: getCartTotal() * 0.08,
          total:
            getCartTotal() +
            (orderData.deliveryFee || 2.99) +
            getCartTotal() * 0.08,
          status: 'pending',
          paymentStatus: orderData.paymentMethod === 'card' ? 'paid' : 'pending',
          paymentMethod: orderData.paymentMethod,
          deliveryAddress: orderData.deliveryAddress,
          city: orderData.city,
          postalCode: orderData.postalCode,
          deliveryInstructions: orderData.deliveryInstructions || '',
          estimatedDelivery: orderData.estimatedDelivery || '30-45 minutes',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'orders'), order);
        clearCart();
        toast.success('Order placed successfully!');
        requestNotificationPermission();

        return docRef.id;
      } catch (error) {
        toast.error('Failed to place order. Please try again.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [cart, clearCart, currentUser?.uid, getCartTotal, userData]
  );

  // 🧩 Update order status
  const updateOrderStatus = useCallback(
    async (orderId, status) => {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status,
          updatedAt: serverTimestamp(),
        });

        const order = orders.find((o) => o.id === orderId);
        if (order && order.customerId === currentUser?.uid) {
          showOrderNotification(order, false);
        }

        toast.success(`Order status updated to ${getStatusText(status)}`);
      } catch (error) {
        toast.error('Failed to update order status');
        throw error;
      }
    },
    [orders, currentUser?.uid]
  );

  const getOrderStatusColor = (status) => {
    const statusColors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      preparing: '#8b5cf6',
      out_for_delivery: '#f97316',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return statusColors[status] || '#6b7280';
  };

  const getOrderStatusText = (status) => {
    const statusText = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return statusText[status] || status;
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

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    getOrderStatusColor,
    getOrderStatusText,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}