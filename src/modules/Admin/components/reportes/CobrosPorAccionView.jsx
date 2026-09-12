import { useEffect, useMemo, useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';
import { ReportesServices } from '../../services/reportes.services';
import HistorialAccionModal from './HistorialAccionModal';
import ReportSearch from './ReportSearch';

export default function CobrosPorAccionView() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const columns = useMemo(
    () => [
      { accessorKey: 'codigo_interno', header: 'Acción' },
      { accessorKey: 'nombre_completo', header: 'Socio' },
      { accessorKey: 'nro_medidor', header: 'Medidor' },
      { accessorKey: 'nombre_calle', header: 'Calle' },
      { accessorKey: 'nombre_tarifa', header: 'Tarifa' },
      { accessorKey: 'estado', header: 'Estado' },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => setSelected(row.original)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <EyeIcon className="h-4 w-4" />
            Ver historial
          </button>
        ),
      },
    ],
    [],
  );

  const load = async () => {
    try {
      setLoading(true);
      const response = await ReportesServices.getAcciones({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setData(response.data);
      setPagination((prev) => ({
        ...prev,
        page: response.page,
        total: response.total,
        totalPages: response.totalPages,
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [pagination.page, pagination.limit, search]);

  const changeSearch = (value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ReportSearch
            value={search}
            onChange={changeSearch}
            placeholder="Buscar por socio, medidor o acción..."
          />
        </div>

        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          page={pagination.page}
          limit={pagination.limit}
          totalItems={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) => setPagination((prev) => ({ ...prev, page: 1, limit }))}
        />
      </div>

      {selected && (
        <HistorialAccionModal
          action={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
