import {
  BoltIcon,
  CheckCircleIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

export default function AccionSelector({
  acciones = [],
  value,
  onChange,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          Cargando acciones...
        </div>
      </div>
    );
  }

  if (acciones.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="font-semibold text-slate-700">
          No tienes acciones registradas
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Cuando tengas una acción asociada aparecerá aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {acciones.map((accion) => {
        const selected = accion.id === value;

        return (
          <button
            key={accion.id}
            type="button"
            onClick={() => onChange?.(accion.id)}
            className={[
              'group rounded-2xl border p-4 text-left transition',
              selected
                ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-100'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={[
                    'text-xs font-bold uppercase tracking-wide',
                    selected ? 'text-emerald-700' : 'text-slate-400',
                  ].join(' ')}
                >
                  Acción
                </p>

                <p className="mt-1 text-lg font-black text-slate-900">
                  {accion.codigo_interno ?? 'Sin código'}
                </p>
              </div>

              {selected && (
                <CheckCircleIcon className="h-6 w-6 shrink-0 text-emerald-600" />
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <TagIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {accion.tipo || 'Sin tipo'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <BoltIcon className="h-4 w-4 shrink-0" />
                <span>
                  {accion.nro_medidor || 'Sin medidor'}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
