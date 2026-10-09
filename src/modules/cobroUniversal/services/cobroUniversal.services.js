import { api } from '../../../services/api';

const unwrap = (response) => response?.data ?? response;

export const CobroUniversalServices = {
  async getAll(params = {}) {
    const { data } = await api.get('/admin/cobro-universal', { params });
    return unwrap(data);
  },

  async getById(id) {
    const { data } = await api.get(`/admin/cobro-universal/${id}`);
    return unwrap(data);
  },

  async getAcciones(params = {}) {
    const { data } = await api.get('/admin/cobro/acciones', { params });
    return unwrap(data);
  },

  async create(payload) {
    const { data } = await api.post('/admin/cobro-universal', payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await api.patch(`/admin/cobro-universal/${id}`, payload);
    return unwrap(data);
  },
};
