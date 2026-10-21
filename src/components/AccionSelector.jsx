// src/modules/socioPortal/components/AccionSelector.jsx

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
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        Cargando acciones...
      </div>
    );
  }

  if (acciones.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
        No tienes acciones registradas
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {acciones.map((accion) => {
        const selected =
          accion.id === value;

        return (
          <button
            key={accion.id}
            type="button"
            onClick={() =>
              onChange?.(accion.id)
            }
            className={[
              'rounded-2xl border p-4 text-left transition',
              selected
                ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                : 'border-slate-200 bg-white hover:border-emerald-300',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Acción
                </p>

                <p className="mt-1 text-lg font-black text-slate-900">
                  {accion.codigo_interno}
                </p>
              </div>

              {selected && (
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <TagIcon className="h-4 w-4" />

                {accion.tipo ||
                  'Sin tipo'}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BoltIcon className="h-4 w-4" />

                {accion.nro_medidor ||
                  'Sin medidor'}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}