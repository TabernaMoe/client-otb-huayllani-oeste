import { useEffect, useMemo, useState } from 'react';
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import SelectComponent from '../../../components/Select';
import ConfirmModal from '../../../components/ConfirmModal';
import PageHeader from '../../../components/PageHeader';
import SocioModal from '../components/SocioModal';
import SocioDetalleModal from '../components/SocioDetalleModal';
import { SocioServices } from '../services/socio.services';

const estados = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

const nombreCompleto = (socio) => [socio.nombres, socio.primer_apellido, socio.segundo_apellido].filter(Boolean).join(' ');

export default function SocioPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [formSocio, setFormSocio] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detalleId, setDetalleId] = useState(null);
  const [confirmSocio, setConfirmSocio] = useState(null);
  const [changing, setChanging] = useState(false);

  const fetchSocios = async () => {
    try {
      setLoading(true);
      const params = { page, limit, search };
      if (estado !== '') params.estado = estado === 'true';

      const response = await SocioServices.getAll(params);
      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudieron cargar los socios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocios();
  }, [page, limit, search, estado]);

  const changeEstado = async () => {
    try {
      setChanging(true);
      const response = await SocioServices.changeEstado(confirmSocio.id);
      toast.success(response.message);
      setConfirmSocio(null);
      fetchSocios();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo cambiar el estado');
    } finally {
      setChanging(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'ci_socio',
      header: 'Socio',
      cell: ({ row }) => (
        <div className="flex min-w-56 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <UserIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-slate-900">{nombreCompleto(row.original)}</p>
            <p className="text-xs text-slate-500">CI {row.original.ci_socio} {row.original.ci_expedido}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'numero_celular', header: 'Celular' },
    { accessorKey: 'direccion', header: 'Dirección' },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getValue() ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
          {getValue() ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setDetalleId(row.original.id)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Ver detalle"><EyeIcon className="h-5 w-5" /></button>
          <button onClick={() => { setFormSocio(row.original); setFormOpen(true); }} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Editar"><PencilSquareIcon className="h-5 w-5" /></button>
          <button onClick={() => setConfirmSocio(row.original)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50" title="Cambiar estado"><PowerIcon className="h-5 w-5" /></button>
        </div>
      ),
    },
  ], []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Socios"
        description="Administra la información, estado y acciones de los socios registrados."
        action={(
          <button onClick={() => { setFormSocio(null); setFormOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <PlusIcon className="h-5 w-5" /> Nuevo socio
          </button>
        )}
      />

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por CI o nombre..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
        <SelectComponent label="Estado" name="estado" value={estado} options={estados} onChange={(e) => { setEstado(e.target.value ?? ''); setPage(1); }} />
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

      <SocioModal open={formOpen} socio={formSocio} onClose={() => setFormOpen(false)} onSuccess={fetchSocios} />
      <SocioDetalleModal open={Boolean(detalleId)} socioId={detalleId} onClose={() => setDetalleId(null)} />

      <ConfirmModal
        open={Boolean(confirmSocio)}
        title={confirmSocio?.estado ? 'Deshabilitar socio' : 'Habilitar socio'}
        message={`¿Deseas ${confirmSocio?.estado ? 'deshabilitar' : 'habilitar'} a ${confirmSocio ? nombreCompleto(confirmSocio) : ''}?`}
        confirmText="Confirmar"
        loading={changing}
        onConfirm={changeEstado}
        onClose={() => setConfirmSocio(null)}
      />
    </section>
  );
}
