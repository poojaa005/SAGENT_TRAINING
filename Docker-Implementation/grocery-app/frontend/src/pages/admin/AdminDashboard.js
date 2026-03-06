import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import {
  getContactNumber,
  getOrderId,
  getProductId,
  getProductName,
  getProductPrice,
  getStockQuantity,
  getUserId,
  getUserName,
  normalizeList,
  pickFirst,
  toNumber,
} from '../../utils/entityAdapters';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [paymentFilters, setPaymentFilters] = useState({
    status: 'ALL',
    method: 'ALL',
    from: '',
    to: '',
  });
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    stockQuantity: '',
    category: '',
    productOffer: 0,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [p, u, o, pay] = await Promise.all([
        productService.getAllProducts(),
        userService.getAllUsers(),
        orderService.getAllOrders(),
        paymentService.getAllPayments(),
      ]);
      setProducts(normalizeList(p));
      setUsers(normalizeList(u));
      setOrders(normalizeList(o));
      setPayments(normalizeList(pay));
    } catch {
      setProducts([]);
      setUsers([]);
      setOrders([]);
      setPayments([]);
    }
  };

  const handleProductSubmit = async () => {
    try {
      if (editingProduct) {
        await productService.updateProduct(getProductId(editingProduct), productForm);
        toast.success('Product updated');
      } else {
        await productService.createProduct(productForm);
        toast.success('Product added');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ productName: '', productDescription: '', productPrice: '', stockQuantity: '', category: '', productOffer: 0 });
      await loadAll();
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted');
      await loadAll();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setProductForm({
      productName: pickFirst(p.productName, p.product_name, p.name, ''),
      productDescription: pickFirst(p.productDescription, p.product_description, p.description, ''),
      productPrice: getProductPrice(p),
      stockQuantity: getStockQuantity(p),
      category: pickFirst(p.category, ''),
      productOffer: toNumber(pickFirst(p.productOffer, p.product_offer, p.offer, 0)),
    });
    setShowProductForm(true);
  };

  const revenue = orders
    .reduce((sum, o) => sum + toNumber(pickFirst(o.totalAmount, o.total_amount, 0)), 0);

  const filteredPayments = payments.filter((p) => {
    const status = String(pickFirst(p.paymentStatus, 'PENDING')).toUpperCase();
    const method = String(pickFirst(p.paymentMethod, p.method, 'UNKNOWN')).toUpperCase();
    const paymentDateRaw = pickFirst(p.paymentDate, p.createdAt);
    const paymentDate = paymentDateRaw ? new Date(paymentDateRaw) : null;
    const fromDate = paymentFilters.from ? new Date(`${paymentFilters.from}T00:00:00`) : null;
    const toDate = paymentFilters.to ? new Date(`${paymentFilters.to}T23:59:59`) : null;

    if (paymentFilters.status !== 'ALL' && status !== paymentFilters.status) return false;
    if (paymentFilters.method !== 'ALL' && method !== paymentFilters.method) return false;
    if (fromDate && (!paymentDate || paymentDate < fromDate)) return false;
    if (toDate && (!paymentDate || paymentDate > toDate)) return false;
    return true;
  });

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">Admin Panel</div>
        {['dashboard', 'products', 'users', 'orders', 'payments'].map((tab) => (
          <button key={tab} className={`admin-nav-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <span>{products.length}</span>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span>{users.length}</span>
                  <p>Registered Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span>{orders.length}</span>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card revenue">
                <div className="stat-info">
                  <span>Rs.{revenue.toFixed(0)}</span>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <span>{payments.length}</span>
                  <p>Total Payments</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-products">
            <div className="admin-section-header">
              <h1>Products ({products.length})</h1>
              <button
                className="btn-add"
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                }}
              >
                + Add Product
              </button>
            </div>
            {showProductForm && (
              <div className="product-form-card">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input value={productForm.productName} onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Price (Rs.)</label>
                    <input type="number" value={productForm.productPrice} onChange={(e) => setProductForm({ ...productForm, productPrice: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" value={productForm.stockQuantity} onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Offer (%)</label>
                    <input type="number" value={productForm.productOffer} onChange={(e) => setProductForm({ ...productForm, productOffer: e.target.value })} />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={productForm.productDescription}
                      onChange={(e) => setProductForm({ ...productForm, productDescription: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-save" onClick={handleProductSubmit}>
                    Save
                  </button>
                  <button className="btn-cancel" onClick={() => setShowProductForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Offer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={getProductId(p)}>
                    <td>{getProductName(p)}</td>
                    <td>
                      <span className="cat-tag">{pickFirst(p.category, '-')}</span>
                    </td>
                    <td>Rs.{getProductPrice(p).toFixed(2)}</td>
                    <td>{getStockQuantity(p)}</td>
                    <td>{toNumber(pickFirst(p.productOffer, p.product_offer, 0))}%</td>
                    <td>
                      <button className="btn-edit-sm" onClick={() => handleEdit(p)}>
                        Edit
                      </button>
                      <button className="btn-delete-sm" onClick={() => handleDeleteProduct(getProductId(p))}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users">
            <h1>Users ({users.length})</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={getUserId(u)}>
                    <td>{getUserName(u)}</td>
                    <td>{u.email}</td>
                    <td>{getContactNumber(u) || '-'}</td>
                    <td>
                      <span className={`role-tag ${pickFirst(u.role, 'USER').toLowerCase()}`}>{pickFirst(u.role, 'USER')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-orders">
            <h1>Orders ({orders.length})</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Delivery</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={getOrderId(o)}>
                    <td>#{getOrderId(o)}</td>
                    <td>User #{pickFirst(o.userId, o.user_id, o.user?.id, '-')}</td>
                    <td>Rs.{toNumber(pickFirst(o.totalAmount, o.total_amount, 0)).toFixed(2)}</td>
                    <td>
                      <span className="status-pill">{pickFirst(o.status, o.orderStatus, o.order_status, '-')}</span>
                    </td>
                    <td><span className="pay-status">N/A</span></td>
                    <td>{pickFirst(o.deliveryAddress, o.delivery_address, '-')}</td>
                    <td>{pickFirst(o.contactNumber, o.contact_number, o.phoneNo, o.phone_no, '-')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="admin-payments">
            <h1>Payments ({filteredPayments.length})</h1>
            <div className="admin-section-header" style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={paymentFilters.status}
                onChange={(e) => setPaymentFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="sort-select"
              >
                <option value="ALL">Status: All</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
              <select
                value={paymentFilters.method}
                onChange={(e) => setPaymentFilters((prev) => ({ ...prev, method: e.target.value }))}
                className="sort-select"
              >
                <option value="ALL">Method: All</option>
                <option value="COD">COD</option>
                <option value="UPI">UPI</option>
                <option value="CARD">CARD</option>
              </select>
              <input
                type="date"
                value={paymentFilters.from}
                onChange={(e) => setPaymentFilters((prev) => ({ ...prev, from: e.target.value }))}
              />
              <input
                type="date"
                value={paymentFilters.to}
                onChange={(e) => setPaymentFilters((prev) => ({ ...prev, to: e.target.value }))}
              />
              <button
                className="btn-cancel"
                onClick={() => setPaymentFilters({ status: 'ALL', method: 'ALL', from: '', to: '' })}
              >
                Clear
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={pickFirst(p.paymentId, p.id)}>
                    <td>#{pickFirst(p.paymentId, p.id, '-')}</td>
                    <td>#{pickFirst(p.order?.orderId, p.orderId, '-')}</td>
                    <td>Rs.{toNumber(pickFirst(p.amount, p.totalAmount, 0)).toFixed(2)}</td>
                    <td>{pickFirst(p.paymentMethod, p.method, '-')}</td>
                    <td>
                      <span className={`pay-status ${String(pickFirst(p.paymentStatus, 'PENDING')).toLowerCase()}`}>
                        {pickFirst(p.paymentStatus, 'PENDING')}
                      </span>
                    </td>
                    <td>{pickFirst(p.paymentDate, p.createdAt) ? new Date(pickFirst(p.paymentDate, p.createdAt)).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
