import { useMemo, useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import EstadoAsistenciaBadge from './EstadoAsistenciaBadge';

export default function AsistenciasPanel({ asamblea, data, loading, onClose, onEdit }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return data;
    return data.filter((item) =>
      `${item.nombre_completo} ${item.ci_socio} ${item.codigo_interno}`.toLowerCase().includes(text),
    );
  }, [data, search]);

  if (!asamblea) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Asistencia</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{data.length} acciones</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{asamblea.titulo} · {asamblea.fecha} · {asamblea.hora_inicio}</p>
        </div>
        <button onClick={onClose} className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <XMarkIcon className="h-4 w-4" /> Cerrar
        </button>
      </div>

      <div className="p-5">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por socio, CI o acción" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50" />
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Socio</th>
                <th className="px-4 py-3">CI</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Celular</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Observación</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-10 text-center text-slate-500">Cargando asistencias...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-10 text-center text-slate-500">No hay registros</td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.nombre_completo}</td>
                  <td className="px-4 py-3 text-slate-600">{item.ci_socio}</td>
                  <td className="px-4 py-3 text-slate-600">{item.codigo_interno}</td>
                  <td className="px-4 py-3 text-slate-600">{item.numero_celular}</td>
                  <td className="px-4 py-3"><EstadoAsistenciaBadge estado={item.asistio} /></td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">{item.observacion || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onEdit(item)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
