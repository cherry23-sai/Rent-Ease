import client from './client';

export const getPendingUsers = () =>
  client.get('/admin/pending').then((res) => res.data);

export const approveUserById = (id) =>
  client.post(`/admin/approve/${id}`).then((res) => res.data);

export const rejectUserById = (id) =>
  client.post(`/admin/reject/${id}`).then((res) => res.data);

export const getAuditLogs = () =>
  client.get('/reports/audit-logs').then((res) => res.data);
