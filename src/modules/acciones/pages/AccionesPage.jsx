import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PowerIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

import DataTable from '../../../components/DataTable';
import SelectComponent from '../../../components/Select';
import AccionModal from '../components/AccionModal';
import { AccionesServices as Servs } from '../services/acciones.services';

const estadoOptions = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'PASIVO', label: 'Pasivo' },
  { value: 'ANULADO', label: 'Anulado' },
];

const badgeClasses = {
  ACTIVO: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  PASIVO: 'border-amber-200 bg-amber-50 text-amber-700',
  ANULADO: 'border-red-200 bg-red-50 text-red-700',
};

function StatCard({ label, value, icon: Icon, className }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className={`rounded-2xl p-3 ${className}`}><Icon className="h-6 w-6" /></span>
      </div>
    </div>
  );
}

export default function AccionesPage() {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 5, totalItems: 0, totalPages: 1 });

  const cargarAcciones = useCallback(async () => {
    setLoading(true);

    const respuesta = await Servs.getAll({
      page: pagination.page,
      limit: pagination.limit,
      search,
      estado: estado || undefined,
    });

    if (respuesta.ok) {
      setAcciones(respuesta.data);
      setPagination((prev) => ({
        ...prev,
        page: respuesta.page,
        limit: respuesta.limit,
        totalItems: respuesta.total,
        totalPages: respuesta.totalPages,
      }));
    }

    setLoading(false);
  }, [pagination.page, pagination.limit, search, estado]);

  useEffect(() => {
    cargarAcciones();
  }, [cargarAcciones]);

  const handleBuscar = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearch(searchInput.trim());
  };

  const handleCreated = async () => {
    if (pagination.page === 1) await cargarAcciones();
    else setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'codigo_interno',
      header: 'Código',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-800">{row.original.codigo_interno}</p>
          <p className="text-xs text-slate-400">ID: {row.original.id}</p>
        </div>
      ),
    },
    {
      accessorKey: 'nombre_completo',
      header: 'Socio',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-800">{row.original.nombre_completo}</p>
          <p className="text-xs text-slate-400">Medidor: {row.original.nro_medidor}</p>
        </div>
      ),
    },
    { accessorKey: 'nombre_calle', header: 'Calle' },
    { accessorKey: 'nombre_tarifa', header: 'Tarifa' },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses[row.original.estado]}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {row.original.estado}
        </span>
      ),
    },
  ], []);

  const activas = acciones.filter((item) => item.estado === 'ACTIVO').length;
  const pasivas = acciones.filter((item) => item.estado === 'PASIVO').length;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Administración</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Acciones registradas</h1>
          <p className="mt-1 text-sm text-slate-500">Consulta y registra las acciones de los socios.</p>
        </div>

        <button type="button" onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
          <PlusIcon className="h-5 w-5" />
          Nueva acción
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de acciones" value={pagination.totalItems} icon={RectangleStackIcon} className="bg-slate-100 text-slate-600" />
        <StatCard label="Activas en página" value={activas} icon={CheckCircleIcon} className="bg-emerald-50 text-emerald-600" />
        <StatCard label="Pasivas en página" value={pasivas} icon={PowerIcon} className="bg-amber-50 text-amber-600" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_260px_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Buscar acción</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                placeholder="Socio, código o medidor..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <SelectComponent
            label="Estado"
            placeholder="Todos"
            name="estado"
            options={estadoOptions}
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value || '');
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />

          <div className="flex gap-2">
            <button type="button" onClick={handleBuscar} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Buscar
            </button>
            <button type="button" onClick={cargarAcciones} disabled={loading} className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={acciones}
        columns={columns}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) => setPagination((prev) => ({ ...prev, page: 1, limit }))}
      />

      <AccionModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </section>
  );
}
