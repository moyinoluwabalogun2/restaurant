import React, { createContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

// 🧩 Reducer logic
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        toast.success(`Increased ${action.payload.name} quantity`);
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      toast.success(`${action.payload.name} added to cart`);
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case 'REMOVE_FROM_CART': {
      toast.success('Item removed from cart');
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};

// 🧩 Load saved cart safely
const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    const parsed = savedCart ? JSON.parse(savedCart) : { items: [] };
    if (!parsed.items || !Array.isArray(parsed.items)) {
      return { items: [] };
    }
    return parsed;
  } catch {
    return { items: [] };
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, getInitialCart());

  // 🧩 Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 🧩 Actions
  const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (itemId) => dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    }
  };
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  // 🧩 Safe utilities
  const getCartTotal = () =>
    (cart?.items ?? []).reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemsCount = () =>
    (cart?.items ?? []).reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart: cart?.items ?? [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
