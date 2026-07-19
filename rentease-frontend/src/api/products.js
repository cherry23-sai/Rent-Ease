import client from './client';

export const browseProducts = (params = {}) =>
  client.get('/products', { params }).then((res) => res.data);

export const getProduct = (id) =>
  client.get(`/products/${id}`).then((res) => res.data);

export const getMyProducts = () =>
  client.get('/products/my').then((res) => res.data);

export const createProduct = (payload) =>
  client.post('/products', payload).then((res) => res.data);

export const updateProduct = (id, payload) =>
  client.put(`/products/${id}`, payload).then((res) => res.data);

export const deleteProduct = (id) =>
  client.delete(`/products/${id}`).then((res) => res.data);

export const setProductStatus = (id, status) =>
  client.patch(`/products/${id}/status`, { status }).then((res) => res.data);
