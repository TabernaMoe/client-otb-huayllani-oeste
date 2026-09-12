import { useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import ElegantInput from '../../../components/ElegantInput';
import SelectComponent from '../../../components/Select';
import { MultasServices } from '../services/multas.services';
import MultaModal from './MultaModal';

const estadoOptions = [
  { value: true, label: 'Activas' },
  { value: false, label: 'Inactivas' },
];

export default function ListarMultasView() {
  const [multas, setMultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });
  const [selectedMulta, setSelectedMulta] = useState(null);

  const cargarMultas = async () => {
    setLoading(true);

    const response = await MultasServices.getAll({
      page: pagination.page,
      limit: pagination.limit,
      search,
      ...(estado !== null && { estado }),
    });

    setMultas(response.data);
    setPagination((prev) => ({
      ...prev,
      page: response.page,
      limit: response.limit,
      totalItems: response.total,
      totalPages: response.totalPages,
    }));
    setLoading(false);
  };

  useEffect(() => {
    cargarMultas();
  }, [pagination.page, pagination.limit, search, estado]);

  const buscar = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearch(searchInput.trim());
  };

  const cambiarEstado = async (multa) => {
    if (!window.confirm(`¿Cambiar el estado de "${multa.nombre_multa}"?`)) return;
    await MultasServices.cambiarEstado(multa.id);
    cargarMultas();
  };

  const columns = [
    {
      accessorKey: 'nombre_multa',
      header: 'Multa',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-800">{row.original.nombre_multa}</p>
          <p className="text-xs text-slate-400">ID: {row.original.id}</p>
        </div>
      ),
    },
    {
      accessorKey: 'precio',
      header: 'Precio',
      cell: ({ row }) => (
        <span className="font-semibold text-slate-700">
          Bs {Number(row.original.precio).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            row.original.estado
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {row.original.estado ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedMulta(row.original)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => cambiarEstado(row.original)}
            className="rounded-lg border border-amber-300 p-2 text-amber-600 hover:bg-amber-50"
            title="Cambiar estado"
          >
            <PowerIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Multas registradas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Consulta, edita y cambia el estado de las multas.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {pagination.totalItems} multas
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_240px_auto] md:items-end">
          <ElegantInput
            label="Buscar"
            name="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Nombre de la multa"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />

          <SelectComponent
            label="Estado"
            name="estado"
            options={estadoOptions}
            value={estado}
            onChange={(event) => {
              setEstado(event.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Todas"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={buscar}
              className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={cargarMultas}
              disabled={loading}
              className="rounded-xl border border-slate-300 p-3 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              title="Actualizar"
            >
              <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={multas}
        columns={columns}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) =>
          setPagination((prev) => ({ ...prev, page: 1, limit }))
        }
      />

      <MultaModal
        open={Boolean(selectedMulta)}
        multa={selectedMulta}
        onClose={() => setSelectedMulta(null)}
        onSaved={cargarMultas}
      />
    </div>
  );
}
