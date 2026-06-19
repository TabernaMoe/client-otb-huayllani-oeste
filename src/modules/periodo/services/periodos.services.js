import { api } from '../../../services/api';
import { toServiceError } from '../../../services/error';

export class PeriodosServices {

  // =========================
  // GET LISTA
  // =========================
  static async getAll(page = 1, limit = 10) {
    try {
      const res = await api.get('/admin/gestion/periodo', {
        params: { page, limit },
      });

      return res.data;
    } catch (err) {
      return toServiceError(err);
    }
  }

  // =========================
  // SELECT (dropdown)
  // =========================
  static async getSelect() {
    try {
      const res = await api.get('/admin/gestion/periodo/select');
      return res.data;
    } catch (err) {
      return toServiceError(err);
    }
  }

  // =========================
  // CERRAR PERIODO
  // =========================
  static async cerrar(id) {
    try {
      const res = await api.patch(
        `/admin/gestion/periodo/cerrar/${id}`
      );

      return res.data;
    } catch (err) {
      return toServiceError(err);
    }
  }
}