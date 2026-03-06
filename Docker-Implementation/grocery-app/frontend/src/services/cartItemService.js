import api, { firstSuccess } from './api';

const pick = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');
const toNum = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const cartItemService = {
  getItemsByCartId: async (cartId) => (await firstSuccess([
    () => api.get(`/cart-items/cart/${cartId}`),
    () => api.get(`/api/cart-items/cart/${cartId}`),
    () => api.get(`/api/cart-items?cartId=${cartId}`),
    () => api.get(`/api/carts/${cartId}/items`),
  ])).data,
  addCartItem: async (item) => {
    const cartId = pick(item?.cartId, item?.cart_id, item?.cart?.cartId, item?.cart?.id);
    const productId = pick(item?.productId, item?.product_id, item?.product?.productId, item?.product?.id);
    const quantity = toNum(pick(item?.quantity, item?.qty, 1), 1);
    const price = toNum(pick(item?.price, item?.unitPrice, 0), 0);

    return (await firstSuccess([
      () => api.post('/cart-items', { quantity, price, cart: { cartId }, product: { productId } }),
      () => api.post('/api/cart-items', { cartId, productId, quantity, price }),
      () => api.post('/api/cart-items', { cartId, productId, qty: quantity, unitPrice: price }),
      () => api.post('/api/cart-items', { cart_id: cartId, product_id: productId, qty: quantity, unit_price: price }),
      () => api.post(`/api/cart-items/cart/${cartId}/product/${productId}`, { quantity }),
      () => api.post(`/api/cart-items/add`, { cartId, productId, quantity }),
    ])).data;
  },
  updateCartItem: async (id, item) => {
    const cartId = pick(item?.cartId, item?.cart_id, item?.cart?.cartId, item?.cart?.id);
    const productId = pick(item?.productId, item?.product_id, item?.product?.productId, item?.product?.id);
    const quantity = toNum(pick(item?.quantity, item?.qty, 1), 1);
    const price = toNum(pick(item?.price, item?.unitPrice, 0), 0);
    return (await firstSuccess([
      () => api.put(`/cart-items/${id}`, { quantity, price, cart: { cartId }, product: { productId } }),
      () => api.put(`/api/cart-items/${id}`, item),
    () => api.patch(`/api/cart-items/${id}`, item),
    () => api.put(`/api/cart-items/${id}`, { quantity: pick(item?.quantity, item?.qty, 1) }),
    () => api.put(`/api/cart-items/${id}`, { qty: pick(item?.qty, item?.quantity, 1) }),
    ])).data;
  },
  removeCartItem: async (id) => {
    if (String(id).startsWith('local-')) return { success: true, local: true };
    return (await firstSuccess([
      () => api.delete(`/cart-items/${id}`),
      () => api.delete(`/api/cart-items/${id}`),
      () => api.delete(`/api/cart-items/delete/${id}`),
      () => api.delete(`/api/cart-items`, { data: { id } }),
    ])).data;
  },
};
