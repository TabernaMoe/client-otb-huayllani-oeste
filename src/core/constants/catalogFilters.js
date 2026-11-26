export const ESTADO_FILTER_OPTIONS_FEM = [
  { value: '', label: 'Todas' },
  { value: 'true', label: 'Activas' },
  { value: 'false', label: 'Inactivas' },
];

export const ESTADO_FILTER_OPTIONS_MASC = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

export const PERIODO_ESTADO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'CERRADO', label: 'Cerrado' },
  { value: 'PENDIENTE', label: 'Pendiente' },
];

export const ESTADO_ACCION_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'PASIVO', label: 'Pasivo' },
  { value: 'ANULADO', label: 'Anulado' },
];

export function withBooleanEstado(fetcher) {
  return (params = {}) => {
    const query = { ...params };
    if (query.estado !== undefined && query.estado !== '') {
      query.estado = query.estado === 'true' || query.estado === true;
    }
    return fetcher(query);
  };
}
