import {
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function AccionesAguaList({
  acciones,
  selectedId,
  search,
  page,
  totalPages,
  loading,
  onSearch,
  onSelect,
  onPageChange,
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Socio, medidor o dirección..."
          className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-500">Cargando...</p>
        ) : (
          acciones.map((accion) => (
            <button
              key={accion.accion_id}
              type="button"
              onClick={() => onSelect(accion)}
              className={`flex w-full gap-3 rounded-xl border p-3 text-left transition ${
                selectedId === accion.accion_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                <UserIcon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {accion.nombre_completo}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Acción {accion.codigo_interno} · Medidor {accion.nro_medidor}
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">{accion.direccion}</p>
              </div>
            </button>
          ))
        )}

        {!loading && acciones.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">No hay resultados.</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={page === 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-xs text-slate-500">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page === totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </aside>
  );
}
