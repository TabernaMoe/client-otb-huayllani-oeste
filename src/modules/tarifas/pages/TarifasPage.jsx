import { useEffect, useMemo, useState } from 'react';
import {
  BanknotesIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import SelectComponent from '../../../components/Select';
import ConfirmModal from '../../../components/ConfirmModal';
import PageHeader from '../../../components/PageHeader';
import TarifaModal from '../components/TarifaModal';
import { TarifasServices } from '../services/tarifas.services';

const estados = [
  { value: '', label: 'Todas' },
  { value: 'true', label: 'Activas' },
  { value: 'false', label: 'Inactivas' },
];

const money = (value) => `Bs ${Number(value).toFixed(2)}`;

export default function TarifasPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmTarifa, setConfirmTarifa] = useState(null);
  const [changing, setChanging] = useState(false);

  const fetchTarifas = async () => {
    try {
      setLoading(true);
      const params = { page, limit, search };
      if (estado !== '') params.estado = estado === 'true';

      const response = await TarifasServices.getAll(params);
      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudieron cargar las tarifas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifas();
  }, [page, limit, search, estado]);

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = async (id) => {
    try {
      const response = await TarifasServices.getById(id);
      setSelected(response.dato);
      setModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo cargar la tarifa');
    }
  };

  const changeEstado = async () => {
    try {
      setChanging(true);
      const response = await TarifasServices.changeEstado(confirmTarifa.id);
      toast.success(response.message);
      setConfirmTarifa(null);
      fetchTarifas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo cambiar el estado');
    } finally {
      setChanging(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'nombre_tarifa',
      header: 'Tarifa',
      cell: ({ row }) => (
        <div className="flex min-w-52 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <BanknotesIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-slate-900">{row.original.nombre_tarifa}</p>
            <p className="text-xs text-slate-500">{row.original.rangosTarifa.length} rangos</p>
          </div>
        </div>
      ),
    },
    {
      id: 'rangos',
      header: 'Rangos de consumo',
      cell: ({ row }) => (
        <div className="flex min-w-80 flex-wrap gap-1.5">
          {row.original.rangosTarifa.map((rango, index) => (
            <span key={index} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {rango.consumo_minimo}–{rango.consumo_maximo ?? '∞'} m³ · {money(rango.precio)}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getValue() ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
          {getValue() ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(row.original.id)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Editar">
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button onClick={() => setConfirmTarifa(row.original)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50" title="Cambiar estado">
            <PowerIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Tarifas de agua"
        description="Administra las tarifas y sus rangos de consumo."
        action={(
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <PlusIcon className="h-5 w-5" /> Nueva tarifa
          </button>
        )}
      />

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar tarifa..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
        <SelectComponent
          label="Estado"
          name="estado"
          value={estado}
          options={estados}
          onChange={(e) => { setEstado(e.target.value ?? ''); setPage(1); }}
        />
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(value) => { setLimit(value); setPage(1); }}
      />

      <TarifaModal
        open={modalOpen}
        tarifa={selected}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchTarifas}
      />

      <ConfirmModal
        open={Boolean(confirmTarifa)}
        title={confirmTarifa?.estado ? 'Deshabilitar tarifa' : 'Habilitar tarifa'}
        message={`¿Deseas ${confirmTarifa?.estado ? 'deshabilitar' : 'habilitar'} la tarifa ${confirmTarifa?.nombre_tarifa || ''}?`}
        confirmText="Confirmar"
        loading={changing}
        onConfirm={changeEstado}
        onClose={() => setConfirmTarifa(null)}
      />
    </section>
  );
}
