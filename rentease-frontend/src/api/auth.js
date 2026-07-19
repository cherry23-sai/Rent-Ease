import client from './client';

export const login = (email, password) =>
  client.post('/auth/login', { email, password }).then((res) => res.data);

export const registerUser = (payload) =>
  client.post('/auth/register/user', payload).then((res) => res.data);

export const registerClient = (payload) =>
  client.post('/auth/register/client', payload).then((res) => res.data);
