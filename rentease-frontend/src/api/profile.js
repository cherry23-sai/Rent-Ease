import client from './client';

export const getProfile = () =>
  client.get('/profile').then((res) => res.data);

export const updateProfile = (payload) =>
  client.put('/profile', payload).then((res) => res.data);

export const changePassword = (payload) =>
  client.put('/profile/password', payload).then((res) => res.data);
