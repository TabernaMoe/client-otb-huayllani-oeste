import {
  ESTADOS_COBRO,
  ESTADOS_RECIBO,
  TIPOS_COBRO,
} from '../constants/reportes.constants';

export default function ReporteFiltrosBar({
  mode,
  filters,
  errors,
  onChange,
  onApply,
  onReset,
  loading,
}) {
  const estados = mode === 'cobros' ? ESTADOS_COBRO : ESTADOS_RECIBO;

  const handleField = (name, value) => {
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">
            Buscar socio / CI
          </label>
          <input
            type="text"
            value={filters.search}
            disabled={filters.usarFechas}
            onChange={(e) => handleField('search', e.target.value)}
            placeholder="Nombre o CI..."
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">
            Tipo de cobro
          </label>
          <select
            value={filters.tipo_cobro}
            onChange={(e) => handleField('tipo_cobro', e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          >
            {TIPOS_COBRO.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Estado</label>
          <select
            value={filters.estado}
            onChange={(e) => handleField('estado', e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          >
            {estados.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">
            Fecha inicio
          </label>
          <input
            type="date"
            value={filters.fecha_inicio}
            disabled={!filters.usarFechas}
            onChange={(e) => handleField('fecha_inicio', e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
          />
          {errors.fecha_inicio && (
            <span className="text-xs text-red-600">{errors.fecha_inicio}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">
            Fecha final
          </label>
          <input
            type="date"
            value={filters.fecha_final}
            disabled={!filters.usarFechas}
            onChange={(e) => handleField('fecha_final', e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
          />
          {errors.fecha_final && (
            <span className="text-xs text-red-600">{errors.fecha_final}</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={filters.usarFechas}
            onChange={(e) => handleField('usarFechas', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-700"
          />
          Filtrar por rango de fechas
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Limpiar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onApply}
            className="rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
          >
            {loading ? 'Consultando...' : 'Aplicar filtros'}
          </button>
        </div>
      </div>
    </div>
  );
}