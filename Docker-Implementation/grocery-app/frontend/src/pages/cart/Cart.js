import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { orderItemService } from '../../services/orderItemService';
import { notificationService } from '../../services/notificationService';
import { paymentService } from '../../services/paymentService';
import {
  getCartItemId,
  getContactNumber,
  getDeliveryAddress,
  getItemQuantity,
  getOrderId,
  getProductCategory,
  getProductId,
  getProductName,
  getProductPrice,
  getUserId,
} from '../../utils/entityAdapters';
import './Cart.css';

const PRODUCT_IMAGES = {
  Grains: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&q=70',
  Dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&q=70',
  Fruits: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&q=70',
  default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=70',
};

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const subtotal = cartItems.reduce((sum, item) => sum + getProductPrice(item) * getItemQuantity(item), 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      const userId = getUserId(user);
      const deliveryAddress = getDeliveryAddress(user);
      const contactNumber = getContactNumber(user);

      const orderPayload = {
        userId,
        totalAmount: total,
        status: 'PLACED',
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      const orderId = getOrderId(createdOrder);
      if (orderId) {
        await Promise.allSettled(
          cartItems.map((item) =>
            orderItemService.createOrderItem({
              productId: getProductId(item),
              quantity: getItemQuantity(item),
              price: getProductPrice(item),
              order: { orderId },
            })
          )
        );
        await paymentService.createPayment({
          amount: total,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          order: { orderId },
        }).catch(() => null);
      }

      await notificationService.createNotification({
        userId,
        title: 'Order placed',
        message: `Order #${orderId || ''} placed. Delivery: ${deliveryAddress}. Contact: ${contactNumber}.`,
        isRead: false,
      }).catch(() => null);

      const metaKey = `freshmart_order_meta_${userId}`;
      const oldMeta = JSON.parse(localStorage.getItem(metaKey) || '{}');
      const saveKey = orderId ? String(orderId) : 'latest';
      oldMeta[saveKey] = {
        deliveryAddress,
        contactNumber,
        notificationsEnabled: true,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      };
      localStorage.setItem(metaKey, JSON.stringify(oldMeta));

      toast.success('Order placed successfully');
      navigate('/orders');
    } catch {
      toast.error('Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">Cart</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you have not added anything yet</p>
        <Link to="/products" className="btn-shop-now">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</p>
      </div>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map((item) => {
            const category = getProductCategory(item);
            return (
              <div key={getCartItemId(item)} className="cart-item-card">
                <img src={PRODUCT_IMAGES[category] || PRODUCT_IMAGES.default} alt="Product" className="item-img" />
                <div className="item-details">
                  <h3>{getProductName(item)}</h3>
                  <p className="item-price">Rs.{getProductPrice(item).toFixed(2)} each</p>
                </div>
                <div className="item-quantity">
                  <span className="qty-badge">x{getItemQuantity(item)}</span>
                </div>
                <div className="item-total">Rs.{(getProductPrice(item) * getItemQuantity(item)).toFixed(2)}</div>
                <button className="item-remove" onClick={() => removeFromCart(getCartItemId(item))}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs.{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'FREE' : `Rs.${shipping}`}</span>
          </div>
          {shipping > 0 && <div className="free-shipping-hint">Add Rs.{(499 - subtotal).toFixed(2)} more for free shipping</div>}
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>Rs.{total.toFixed(2)}</span>
          </div>
          <div className="payment-options">
            <p className="payment-title">Payment Method</p>
            <label className={`pay-option ${paymentMethod === 'COD' ? 'active' : ''}`}>
              <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Cash on Delivery</span>
            </label>
            <label className={`pay-option ${paymentMethod === 'UPI' ? 'active' : ''}`}>
              <input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>UPI</span>
            </label>
            <label className={`pay-option ${paymentMethod === 'CARD' ? 'active' : ''}`}>
              <input type="radio" name="paymentMethod" value="CARD" checked={paymentMethod === 'CARD'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>Card</span>
            </label>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Place Order
          </button>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
