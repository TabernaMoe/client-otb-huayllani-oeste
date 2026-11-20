import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import PageHeader from '../../../components/PageHeader';
import DataTable from '../../../components/DataTable';
import ReporteFiltrosBar from '../components/ReporteFiltrosBar';
import ReporteResumenCards from '../components/ReporteResumenCards';
import { cobrosColumns, recibosColumns } from '../components/reportes.columns';
import {
  filtroFechasCobroSchema,
  filtroFechasReciboSchema,
} from '../schemas/reportes.schema';
import { ReportesApiService } from '../services/reportes.services';

const todayIso = () => new Date().toISOString().slice(0, 10);

const buildInitialFilters = (mode) => ({
  search: '',
  tipo_cobro: 'TODOS',
  estado: mode === 'cobros' ? 'TODOS' : 'true',
  usarFechas: false,
  fecha_inicio: todayIso(),
  fecha_final: todayIso(),
});

function exportToCsv(rows, filename) {
  if (!rows.length) return toast.info('No hay datos para exportar');
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','),
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${todayIso()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportesHubPage() {
  const [mode, setMode] = useState('cobros');
  const [filters, setFilters] = useState(() => buildInitialFilters('cobros'));
  const [errors, setErrors] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchReport = useCallback(
    async (nextMode, activeFilters, page = 1, limit = 10) => {
      setErrors({});

      if (activeFilters.usarFechas) {
        const schema =
          nextMode === 'cobros'
            ? filtroFechasCobroSchema
            : filtroFechasReciboSchema;

        const parsed = schema.safeParse({
          fecha_inicio: activeFilters.fecha_inicio,
          fecha_final: activeFilters.fecha_final,
          estado: activeFilters.estado,
          tipo_cobro: activeFilters.tipo_cobro,
        });

        if (!parsed.success) {
          const fieldErrors = {};
          for (const issue of parsed.error.issues) {
            fieldErrors[issue.path[0]] = issue.message;
          }
          setErrors(fieldErrors);
          return;
        }

        setLoading(true);
        const res =
          nextMode === 'cobros'
            ? await ReportesApiService.getCobrosPorFecha(parsed.data)
            : await ReportesApiService.getRecibosPorFecha(parsed.data);
        setLoading(false);

        if (!res?.ok) return toast.error(res?.message || 'Error al consultar reporte');
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setRows(list);
        setPagination({ page: 1, limit: list.length || 10, total: list.length, totalPages: 1 });
        return;
      }

      setLoading(true);
      const query = {
        page,
        limit,
        search: activeFilters.search,
        tipo_cobro: activeFilters.tipo_cobro,
        estado: activeFilters.estado,
      };
      const res =
        nextMode === 'cobros'
          ? await ReportesApiService.getCobros(query)
          : await ReportesApiService.getRecibos(query);
      setLoading(false);

      if (!res?.ok) return toast.error(res?.message || 'Error al consultar reporte');
      const payload = res.data || {};
      setRows(payload.data || []);
      setPagination({
        page: payload.pagination?.page || page,
        limit: payload.pagination?.limit || limit,
        total: payload.pagination?.total || 0,
        totalPages: payload.pagination?.totalPages || 1,
      });
    },
    [],
  );

  useEffect(() => {
    fetchReport(mode, filters, 1, pagination.limit);
  }, [mode]);

  const handleModeChange = (nextMode) => {
    const reset = buildInitialFilters(nextMode);
    setMode(nextMode);
    setFilters(reset);
    setErrors({});
  };

  const handleReset = () => {
    const reset = buildInitialFilters(mode);
    setFilters(reset);
    setErrors({});
    fetchReport(mode, reset, 1, pagination.limit);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Centro de Reportes"
        description="Consulta reportes de cobros y recibos con filtros por tipo, estado o rango de fechas."
        action={
          <button
            type="button"
            onClick={() => exportToCsv(rows, `reporte-${mode}`)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Exportar CSV
          </button>
        }
      />

      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        {[
          { id: 'cobros', label: 'Reporte de Cobros' },
          { id: 'recibos', label: 'Reporte de Recibos' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleModeChange(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              mode === tab.id
                ? 'bg-blue-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ReporteResumenCards
        rows={rows}
        mode={mode}
        totalItems={pagination.total}
      />

      <ReporteFiltrosBar
        mode={mode}
        filters={filters}
        errors={errors}
        loading={loading}
        onChange={setFilters}
        onApply={() => fetchReport(mode, filters, 1, pagination.limit)}
        onReset={handleReset}
      />

      <DataTable
        data={rows}
        columns={mode === 'cobros' ? cobrosColumns : recibosColumns}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        onPageChange={(nextPage) =>
          fetchReport(mode, filters, nextPage, pagination.limit)
        }
        onLimitChange={(nextLimit) => fetchReport(mode, filters, 1, nextLimit)}
      />
    </div>
  );
}