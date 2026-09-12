const styles = {
  ASISTIO: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  FALTA: 'bg-red-50 text-red-700 ring-red-600/20',
  'SIN EFECTO': 'bg-slate-100 text-slate-700 ring-slate-500/20',
  RETRASO: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  PERMISO: 'bg-blue-50 text-blue-700 ring-blue-600/20',
};

const labels = {
  ASISTIO: 'Asistió',
  FALTA: 'Falta',
  'SIN EFECTO': 'Sin efecto',
  RETRASO: 'Retraso',
  PERMISO: 'Permiso',
};

export default function EstadoAsistenciaBadge({ estado }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[estado]}`}>
      {labels[estado]}
    </span>
  );
}
