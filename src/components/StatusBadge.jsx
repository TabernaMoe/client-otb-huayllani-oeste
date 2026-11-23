const STATUS_STYLES = {
  ACTIVO: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  PAGADO: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  ASISTIO: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  INACTIVO: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  CERRADO: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  PASIVO: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  PENDIENTE: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  PARCIAL: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  BLOQUEADO: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  ANULADO: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  FALTA: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

const LABELS = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  PENDIENTE: 'Pendiente',
  CERRADO: 'Cerrado',
  BLOQUEADO: 'Bloqueado',
  PASIVO: 'Pasivo',
  PAGADO: 'Pagado',
  PARCIAL: 'Parcial',
  ANULADO: 'Anulado',
};

export default function StatusBadge({
  value,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}) {
  const isBoolean = typeof value === 'boolean';
  const key = isBoolean
    ? value
      ? 'ACTIVO'
      : 'INACTIVO'
    : String(value ?? '').toUpperCase();

  const label = isBoolean
    ? value
      ? activeLabel
      : inactiveLabel
    : LABELS[key] || String(value ?? '—');

  const style =
    STATUS_STYLES[key] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
