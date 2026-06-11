import { useEffect, useState } from 'react';
import {
  CalendarDaysIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import { PeriodosServices } from '../services/periodos.services';

const formatDateOnly = (dateValue) => {
  if (!dateValue) return '-';

  const [year, month, day] = String(dateValue).slice(0, 10).split('-');

  return `${day}/${month}/${year}`;
};

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [closingId, setClosingId] = useState(null);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPeriodos = async () => {
    try {
      setLoading(true);

      const response = await PeriodosServices.getAll(page, limit, search);

      if (!response.ok) {
        toast.error(response.message || 'Error al cargar periodos');
        return;
      }

      setPeriodos(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodos();
  }, [page, search]);

  const handleSearch = (e) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const handleCerrarPeriodo = async (periodo) => {
    const confirm = window.confirm(
      `¿Seguro que deseas cerrar el periodo ${periodo.mes}?`,
    );

    if (!confirm) return;

    try {
      setClosingId(periodo.id);

      const response = await PeriodosServices.cerrar(periodo.id);

      if (!response.ok) {
        toast.error(response.message || 'Error al cerrar periodo');
        return;
      }

      toast.success(response.message || 'Periodo cerrado correctamente');
      fetchPeriodos();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setClosingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-sky-50 p-3 text-sky-800">
            <CalendarDaysIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Periodos</h1>
            <p className="mt-1 text-sm text-slate-500">
              Administra los periodos mensuales de la gestión.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5 max-w-md">
          
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Gestión</th>
                <th className="px-4 py-3 font-semibold">Mes</th>
                <th className="px-4 py-3 font-semibold">Fecha inicio</th>
                <th className="px-4 py-3 font-semibold">Fecha fin</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    Cargando periodos...
                  </td>
                </tr>
              ) : periodos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    No hay periodos registrados
                  </td>
                </tr>
              ) : (
                periodos.map((periodo) => {
                  const cerrado = periodo.estado === 'CERRADO';

                  return (
                    <tr
                      key={periodo.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">{periodo.id}</td>
                      <td className="px-4 py-3">{periodo.gestion_id}</td>
                      <td className="px-4 py-3 font-semibold">
                        {periodo.mes}
                      </td>
                      <td className="px-4 py-3">
                        {formatDateOnly(periodo.fecha_inicio)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDateOnly(periodo.fecha_fin)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            cerrado
                              ? 'bg-slate-100 text-slate-600'
                              : periodo.estado === 'ACTIVO'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {periodo.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={cerrado || closingId === periodo.id}
                            onClick={() => handleCerrarPeriodo(periodo)}
                            className="inline-flex items-center gap-2 rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            <LockClosedIcon className="h-4 w-4" />
                            {closingId === periodo.id
                              ? 'Cerrando...'
                              : cerrado
                                ? 'Cerrado'
                                : 'Cerrar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <span className="font-medium text-slate-500">
            Página {page} de {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}