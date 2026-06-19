import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import { PeriodosServices } from '../services/periodos.services';

const MONTHS = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  setiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
};

const formatDateOnly = (value) => {
  if (!value || value === 'Sin fecha') return '-';

  const match = String(value)
    .toLowerCase()
    .match(/(\d{1,2}) de ([a-záéíóúñ]+) de (\d{4})/);

  if (!match) return value;

  const day = match[1].padStart(2, '0');
  const month = MONTHS[match[2]];
  const year = match[3];

  if (!month) return value;

  return `${day}/${month}/${year}`;
};

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState([]);
  const [periodosSelect, setPeriodosSelect] = useState([]);

  const [loading, setLoading] = useState(false);
  const [closingId, setClosingId] = useState(null);

  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPeriodos = async () => {
    try {
      setLoading(true);

      const res = await PeriodosServices.getAll(page, limit);

      if (!res.ok) {
        toast.error(res.message || 'Error al cargar periodos');
        return;
      }

      setPeriodos(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      toast.error('Error inesperado al cargar periodos');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodosSelect = async () => {
    try {
      const res = await PeriodosServices.getSelect();

      if (!res.ok) {
        toast.error(res.message || 'Error al cargar select de periodos');
        return;
      }

      setPeriodosSelect(res.data || []);
    } catch (error) {
      toast.error('Error inesperado al cargar select');
    }
  };

  useEffect(() => {
    fetchPeriodosSelect();
  }, []);

  useEffect(() => {
    fetchPeriodos();
  }, [page]);

  const periodosFiltrados = useMemo(() => {
    if (!selectedPeriodo) return periodos;

    return periodos.filter(
      (periodo) => String(periodo.id) === String(selectedPeriodo),
    );
  }, [periodos, selectedPeriodo]);

  const handleCerrarPeriodo = async (periodo) => {
    const ok = window.confirm(`¿Seguro que deseas cerrar ${periodo.mes}?`);

    if (!ok) return;

    try {
      setClosingId(periodo.id);

      const res = await PeriodosServices.cerrar(periodo.id);

      if (!res.ok) {
        toast.error(res.message || 'Error al cerrar periodo');
        return;
      }

      toast.success(res.message || 'Periodo cerrado correctamente');
      fetchPeriodos();
    } catch (error) {
      toast.error('Error inesperado al cerrar periodo');
    } finally {
      setClosingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
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
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <select
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-sky-700"
            >
              <option value="">Todos los periodos</option>

              {periodosSelect.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Mes</th>
                <th className="px-4 py-3 font-semibold">Inicio</th>
                <th className="px-4 py-3 font-semibold">Fin</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    Cargando periodos...
                  </td>
                </tr>
              ) : periodosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    No hay periodos registrados
                  </td>
                </tr>
              ) : (
                periodosFiltrados.map((periodo) => {
                  const cerrado = periodo.estado === 'CERRADO';
                  const activo = periodo.estado === 'ACTIVO';

                  return (
                    <tr
                      key={periodo.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {periodo.id}
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-800">
                        {periodo.mes}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDateOnly(periodo.fecha_inicio)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDateOnly(periodo.fecha_fin)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            cerrado
                              ? 'bg-slate-100 text-slate-600'
                              : activo
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
                            className="inline-flex items-center gap-2 rounded-xl bg-sky-800 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-300"
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

        <div className="mt-5 flex items-center justify-between text-sm">
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