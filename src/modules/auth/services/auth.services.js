import { api } from '../../../services/api';

export const AuthService = {
  async login({ user, password }) {
    const { data } = await api.post('/auth/login', {
      user,       // id_socio
      password,   // carnet_id
    });

    return data;
  },

  saveSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },
};