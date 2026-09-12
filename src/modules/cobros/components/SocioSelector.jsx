import {
  IdentificationIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { getSocioInitials } from '../utils/cobros.utils';

export default function SocioSelector({
  socios,
  selectedSocio,
  loading,
  search,
  onSearchChange,
  onSelect,
}) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <h3 className="font-bold text-slate-900">1. Seleccionar socio</h3>
        <div className="relative mt-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar nombre o CI"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[560px] space-y-2 overflow-y-auto p-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">Cargando socios...</div>
        ) : socios.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            <UserGroupIcon className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            No se encontraron socios.
          </div>
        ) : (
          socios.map((socio) => {
            const active = selectedSocio?.id === socio.id;

            return (
              <button
                key={socio.id}
                type="button"
                onClick={() => onSelect(socio)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                    {getSocioInitials(socio.nombre_completo)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{socio.nombre_completo}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <IdentificationIcon className="h-3.5 w-3.5" />
                      CI: {socio.ci}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{socio.acciones.length} acciones</p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
