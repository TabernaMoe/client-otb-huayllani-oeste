import { api } from '../../../services/api';

const mapAdminItem = (item = {}) => ({
  ...item,
  cedula_identidad: item.cedula_identidad ?? item.cedula_indentidad ?? '',
});

export class AdminServices {
  static async getRoles() {
    const { data } = await api.get('/admin/persona-admin/rol');
    return {
      ...data,
      data: Array.isArray(data?.data) ? data.data : [],
    };
  }

  static async getAll(params = {}) {
    const { data } = await api.get('/admin/persona-admin/', { params });
    const inner = data?.data ?? {};
    const rows = Array.isArray(inner?.data) ? inner.data.map(mapAdminItem) : [];

    return {
      ...data,
      data: {
        ...inner,
        data: rows,
      },
    };
  }

  static async getById(id) {
    const { data } = await api.get(`/admin/persona-admin/${id}`);
    const admin = data?.data ? mapAdminItem({ id, ...data.data }) : null;
    return {
      ...data,
      data: admin,
    };
  }

  static async create(payload) {
    const { data } = await api.post('/admin/persona-admin', payload);
    return data;
  }

  static async update(id, payload) {
    const { data } = await api.patch(`/admin/persona-admin/${id}`, payload);
    return data;
  }

  static async toggleStatus(id) {
    const { data } = await api.patch(`/admin/persona-admin/cambiar-estado/${id}`);
    return data;
  }
}
