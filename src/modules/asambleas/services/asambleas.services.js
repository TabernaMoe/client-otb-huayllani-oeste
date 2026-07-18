export class AsambleasServices {
  static async getAll() {
    return {
      ok: true,
      data: [],
    };
  }

  static async getById(id) {
    return {
      ok: true,
      data: null,
    };
  }

  static async create(payload) {
    return {
      ok: true,
      message: 'Asamblea creada correctamente',
      data: payload,
    };
  }

  static async updateAsistencia(asambleaId, socioId, payload) {
    return {
      ok: true,
      message: 'Asistencia actualizada correctamente',
      data: {
        asambleaId,
        socioId,
        ...payload,
      },
    };
  }
}