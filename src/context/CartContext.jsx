import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const LOCAL_KEY = "dm_cart_v1";

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      try {
        localStorage.removeItem(LOCAL_KEY);
      } catch (_) {}
      return [];
    }
  });

  // persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
    } catch (e) {
      // ignore quota errors in browsers where storage is full
    }
  }, [cart]);

  // Add product with quantity support. If product exists, increase quantity.
  const addToCart = (product, qty = 1) => {
    if (!product || !product.id) return;

    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        return prev.map((p, i) =>
          i === idx ? { ...p, quantity: (p.quantity || 1) + qty } : p
        );
      }

      return [...prev, { ...product, quantity: qty }];
    });
  };

  // Remove quantity (or whole item if qty >= current). Default removes one unit.
  const removeFromCart = (id, qty = 1) => {
    if (!id) return;

    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;

      const item = prev[idx];
      const currentQty = item.quantity || 1;
      if (qty >= currentQty) {
        return prev.filter((p) => p.id !== id);
      }

      return prev.map((p) => (p.id === id ? { ...p, quantity: currentQty - qty } : p));
    });
  };

  // Set exact quantity (if newQty <= 0 item is removed)
  const updateQuantity = (id, newQty) => {
    if (!id) return;
    setCart((prev) => {
      if (newQty <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p));
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
