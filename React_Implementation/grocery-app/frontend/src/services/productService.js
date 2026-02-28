import api, { firstSuccess } from './api';

export const productService = {
  getAllProducts: async () => (await firstSuccess([
    () => api.get('/api/products'),
    () => api.get('/products'),
  ])).data,
  getProductById: async (id) => (await firstSuccess([
    () => api.get(`/api/products/${id}`),
    () => api.get(`/products/${id}`),
  ])).data,
  createProduct: async (product) => (await firstSuccess([
    () => api.post('/api/products', product),
    () => api.post('/products', product),
  ])).data,
  updateProduct: async (id, product) => (await firstSuccess([
    () => api.put(`/api/products/${id}`, product),
    () => api.put(`/products/${id}`, product),
  ])).data,
  deleteProduct: async (id) => (await firstSuccess([
    () => api.delete(`/api/products/${id}`),
    () => api.delete(`/products/${id}`),
  ])).data,
  searchByName: async (name) => {
    const encoded = encodeURIComponent(name);
    return (await firstSuccess([
      () => api.get(`/api/products/search/${encoded}`),
      () => api.get(`/api/products/search?name=${encoded}`),
      () => api.get(`/products/search/${encoded}`),
    ])).data;
  },
};
