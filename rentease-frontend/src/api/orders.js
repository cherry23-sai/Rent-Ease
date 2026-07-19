import client from './client';

export const createOrder = (payload) =>
  client.post('/orders', payload).then((res) => res.data);

export const getMyOrders = () =>
  client.get('/orders/my').then((res) => res.data);

export const getIncomingOrders = () =>
  client.get('/orders/incoming').then((res) => res.data);

export const approveOrder = (id) =>
  client.post(`/orders/${id}/approve`).then((res) => res.data);

export const rejectOrder = (id) =>
  client.post(`/orders/${id}/reject`).then((res) => res.data);

export const cancelOrder = (id) =>
  client.post(`/orders/${id}/cancel`).then((res) => res.data);
