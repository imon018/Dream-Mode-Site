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

  // helper: normalize ids to strings
  const toId = (id) => (id == null ? id : String(id));

  // Add product with quantity support. If product exists, increase quantity.
  const addToCart = (product, qty = 1) => {
    if (!product || product.id == null) return;

    const id = toId(product.id);

    setCart((prev) => {
      const idx = prev.findIndex((p) => toId(p.id) === id);
      if (idx >= 0) {
        return prev.map((p, i) =>
          i === idx ? { ...p, quantity: (p.quantity || 1) + qty } : p
        );
      }

      return [...prev, { ...product, id, quantity: qty }];
    });
  };

  // Remove quantity (or whole item if qty >= current). Default removes one unit.
  const removeFromCart = (id, qty = 1) => {
    if (id == null) return;

    const sid = toId(id);

    setCart((prev) => {
      const idx = prev.findIndex((p) => toId(p.id) === sid);
      if (idx === -1) return prev;

      const item = prev[idx];
      const currentQty = item.quantity || 1;
      if (qty >= currentQty) {
        return prev.filter((p) => toId(p.id) !== sid);
      }

      return prev.map((p) => (toId(p.id) === sid ? { ...p, quantity: currentQty - qty } : p));
    });
  };

  // Set exact quantity (if newQty <= 0 item is removed)
  const updateQuantity = (id, newQty) => {
    if (id == null) return;

    const sid = toId(id);

    setCart((prev) => {
      if (newQty <= 0) return prev.filter((p) => toId(p.id) !== sid);
      return prev.map((p) => (toId(p.id) === sid ? { ...p, quantity: newQty } : p));
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
