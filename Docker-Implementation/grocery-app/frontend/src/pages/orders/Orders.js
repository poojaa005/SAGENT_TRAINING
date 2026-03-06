import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { notificationService } from '../../services/notificationService';
import { paymentService } from '../../services/paymentService';
import {
  getOrderId,
  getUserId,
  normalizeList,
  pickFirst,
  toNumber,
} from '../../utils/entityAdapters';
import './Orders.css';

const toDisplayBoolean = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'yes', 'enabled', '1'].includes(normalized)) return true;
    if (['false', 'no', 'disabled', '0'].includes(normalized)) return false;
  }
  return undefined;
};

const STATUS_CONFIG = {
  PLACED: { color: '#f59e0b', bg: '#fef3c7', icon: 'PLACED' },
  PROCESSING: { color: '#3b82f6', bg: '#dbeafe', icon: 'PROCESSING' },
  SHIPPED: { color: '#8b5cf6', bg: '#ede9fe', icon: 'SHIPPED' },
  DELIVERED: { color: '#10b981', bg: '#d1fae5', icon: 'DELIVERED' },
  CANCELLED: { color: '#ef4444', bg: '#fee2e2', icon: 'CANCELLED' },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [orderMeta, setOrderMeta] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [paymentMap, setPaymentMap] = useState({});
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userId = getUserId(user);
      const [data, userNotifications] = await Promise.all([
        orderService.getOrdersByUserId(userId),
        notificationService.getByUserId(userId).catch(() => []),
      ]);
      setOrders(normalizeList(data));
      setNotifications(normalizeList(userNotifications));
      setOrderMeta(JSON.parse(localStorage.getItem(`freshmart_order_meta_${userId}`) || '{}'));
      const ordersList = normalizeList(data);
      const paymentPairs = await Promise.all(
        ordersList.map(async (o) => {
          const id = getOrderId(o);
          const payments = await paymentService.getPaymentsByOrderId(id).catch(() => []);
          const last = normalizeList(payments).slice(-1)[0];
          return [String(id), last || null];
        })
      );
      setPaymentMap(Object.fromEntries(paymentPairs));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (order) => {
    const orderId = getOrderId(order);
    if (!orderId || !window.confirm(`Cancel order #${orderId}?`)) return;
    try {
      setCancellingId(orderId);
      const payload = {
        userId: pickFirst(order.userId, getUserId(user)),
        totalAmount: toNumber(pickFirst(order.totalAmount, order.total_amount, 0)),
        status: 'CANCELLED',
      };
      await orderService.updateOrder(orderId, payload);

      const payments = normalizeList(await paymentService.getPaymentsByOrderId(orderId).catch(() => []));
      await Promise.allSettled(
        payments.map((p) =>
          paymentService.updatePayment(p.paymentId, {
            amount: toNumber(p.amount, payload.totalAmount),
            paymentMethod: pickFirst(p.paymentMethod, 'COD'),
            paymentStatus: pickFirst(p.paymentMethod, '').toUpperCase() === 'COD' ? 'FAILED' : 'REFUNDED',
            order: { orderId },
          })
        )
      );

      await notificationService.createNotification({
        userId: getUserId(user),
        title: 'Order cancelled',
        message: `Order #${orderId} has been cancelled.`,
        isRead: false,
      }).catch(() => null);

      toast.success(`Order #${orderId} cancelled`);
      await loadOrders();
    } catch {
      toast.error('Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1>My Orders</h1>
        </div>
        <div className="orders-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="order-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">Orders</div>
          <h2>No orders yet</h2>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const orderId = getOrderId(order);
            const status = pickFirst(order.status, order.orderStatus, order.order_status, 'PLACED');
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PLACED;
            const isExp = expanded === orderId;
            const canCancel = status === 'PLACED' || status === 'PROCESSING';
            const amount = toNumber(pickFirst(order.totalAmount, order.total_amount, order.amount, 0));
            const orderDate = pickFirst(order.orderDate, order.order_date, order.createdAt, order.created_at);
            const meta = orderMeta[String(orderId)] || orderMeta.latest || {};
            const relatedNotification = notifications.find((n) => `${n?.message || ''}`.includes(`Order #${orderId}`));
            const paymentRecord = paymentMap[String(orderId)];
            const deliveryAddress = pickFirst(
              order.deliveryAddress,
              order.delivery_address,
              order.address,
              order.shippingAddress,
              order.shipping_address,
              order.user?.address,
              meta.deliveryAddress,
              user?.address,
              'N/A'
            );
            const contact = pickFirst(
              order.contactNumber,
              order.contact_number,
              order.phoneNo,
              order.phone_no,
              order.contactNo,
              order.mobile,
              order.user?.phoneNo,
              order.user?.contactNumber,
              meta.contactNumber,
              user?.phoneNo,
              user?.phone_no,
              'N/A'
            );
            const payment = pickFirst(
              paymentRecord?.paymentStatus,
              order.paymentStatus,
              order.payment_status,
              meta.paymentStatus,
              'PENDING'
            );
            const paymentMethod = pickFirst(paymentRecord?.paymentMethod, meta.paymentMethod, 'N/A');
            const notifyRaw = pickFirst(
              order.notificationsEnabled,
              order.notificationEnabled,
              order.notifyCustomer,
              order.notification_status,
              order.notificationStatus,
              relatedNotification ? !relatedNotification.isRead : undefined,
              meta.notificationsEnabled
            );
            const notify = toDisplayBoolean(notifyRaw);

            return (
              <div key={orderId} className={`order-card ${isExp ? 'expanded' : ''}`}>
                <div className="order-card-header" onClick={() => setExpanded(isExp ? null : orderId)}>
                  <div className="order-meta">
                    <span className="order-id">Order #{orderId}</span>
                    <span className="order-date">
                      {orderDate ? new Date(orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="order-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                      {cfg.icon}
                    </span>
                    <span className="order-total">Rs.{amount.toFixed(2)}</span>
                    <span className="expand-icon">{isExp ? '▲' : '▼'}</span>
                  </div>
                </div>
                {isExp && (
                  <div className="order-details">
                    {canCancel && (
                      <div className="order-actions">
                        <button
                          className="cancel-order-btn"
                          onClick={() => handleCancelOrder(order)}
                          disabled={cancellingId === orderId}
                        >
                          {cancellingId === orderId ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      </div>
                    )}
                    <div className="order-info-grid">
                      <div className="order-info-item">
                        <span>Delivery Address</span>
                        <p>{deliveryAddress}</p>
                      </div>
                      <div className="order-info-item">
                        <span>Payment Status</span>
                        <p className={payment === 'PAID' ? 'paid' : 'pending'}>{payment}</p>
                      </div>
                      <div className="order-info-item">
                        <span>Payment Method</span>
                        <p>{paymentMethod}</p>
                      </div>
                      <div className="order-info-item">
                        <span>Contact</span>
                        <p>{contact}</p>
                      </div>
                      <div className="order-info-item">
                        <span>Notifications</span>
                        <p>{notify === undefined ? 'N/A' : notify ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
