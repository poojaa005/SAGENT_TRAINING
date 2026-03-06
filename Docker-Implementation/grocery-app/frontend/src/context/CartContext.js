import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import { cartItemService } from '../services/cartItemService';
import {
  getCartId,
  getCartItemId,
  getItemQuantity,
  getProductId,
  getProductName,
  getProductPrice,
  getUserId,
  normalizeList,
  pickFirst,
} from '../utils/entityAdapters';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) loadCart();
    else {
      setCart(null);
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const normalizeCartItems = (items) => {
    const clean = normalizeList(items).filter((item) => getProductId(item) && item?.product);
    const map = new Map();
    for (const item of clean) {
      const key = String(getProductId(item));
      const qty = getItemQuantity(item);
      if (!map.has(key)) {
        map.set(key, { ...item, quantity: qty });
      } else {
        const prev = map.get(key);
        map.set(key, {
          ...prev,
          quantity: getItemQuantity(prev) + qty,
          cartItemId: getCartItemId(prev) || getCartItemId(item),
        });
      }
    }
    return Array.from(map.values());
  };

  const loadCart = async () => {
    try {
      const userId = Number(getUserId(user));
      if (!userId) return false;

      let cartResponse;
      try {
        cartResponse = await cartService.getCartByUserId(userId);
      } catch {
        const allCarts = normalizeList(await cartService.getAllCarts());
        cartResponse = allCarts.find((c) => String(pickFirst(c?.user?.userId, c?.userId)) === String(userId)) || null;
      }

      const resolvedCart = Array.isArray(cartResponse) ? cartResponse[0] : (normalizeList(cartResponse)[0] || cartResponse);
      const resolvedCartId = getCartId(resolvedCart);
      if (!resolvedCartId) {
        setCart(null);
        setCartItems([]);
        setCartCount(0);
        return false;
      }

      const itemsResponse = await cartItemService.getItemsByCartId(resolvedCartId);
      const items = normalizeCartItems(itemsResponse);

      setCart(resolvedCart);
      setCartItems(items);
      setCartCount(items.length);
      return true;
    } catch {
      setCart(null);
      setCartItems([]);
      setCartCount(0);
      return false;
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      toast.error('Please login to add items');
      return;
    }

    try {
      const userId = Number(getUserId(user));
      if (!userId) throw new Error('Invalid user');

      let activeCart = cart;
      let activeCartId = getCartId(activeCart);

      if (!activeCartId) {
        activeCart = await cartService.createCart({
          totalAmount: 0,
          discount: 0,
          user: { userId },
        });
        activeCartId = getCartId(activeCart);
      }

      if (!activeCartId) throw new Error('Cart create failed');

      const productId = Number(getProductId(product));
      if (!productId) throw new Error('Invalid product');

      const existing = cartItems.find((item) => String(getProductId(item)) === String(productId));

      if (existing) {
        const itemId = getCartItemId(existing);
        if (!itemId) throw new Error('Invalid cart item');
        await cartItemService.updateCartItem(itemId, {
          quantity: getItemQuantity(existing) + 1,
          price: getProductPrice(product),
          cart: { cartId: Number(activeCartId) },
          product: { productId },
        });
      } else {
        await cartItemService.addCartItem({
          quantity: 1,
          price: getProductPrice(product),
          cart: { cartId: Number(activeCartId) },
          product: { productId },
        });
      }

      const synced = await loadCart();
      if (!synced) throw new Error('Cart sync failed');
      toast.success(`${getProductName(product)} added to cart`);
    } catch {
      toast.error('Failed to add item to backend cart');
    }
  };

  const removeFromCart = async (cartItemId) => {
    const targetItem = cartItems.find((item) => String(getCartItemId(item)) === String(cartItemId));
    const targetProductId = targetItem ? getProductId(targetItem) : null;
    const activeCartId = getCartId(cart);

    try {
      await cartItemService.removeCartItem(cartItemId);
      const synced = await loadCart();
      if (!synced) throw new Error('Cart sync failed');
      toast.success('Item removed');
    } catch {
      try {
        if (activeCartId && targetProductId) {
          const latest = normalizeList(await cartItemService.getItemsByCartId(activeCartId));
          const rows = latest.filter((row) => String(getProductId(row)) === String(targetProductId));
          await Promise.allSettled(rows.map((row) => cartItemService.removeCartItem(getCartItemId(row))));
          const synced = await loadCart();
          if (synced) {
            toast.success('Item removed');
            return;
          }
        }
      } catch {
        // fallback failed; show final error below
      }
      toast.error('Failed to remove item from backend cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartItems, cartCount, addToCart, removeFromCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};
