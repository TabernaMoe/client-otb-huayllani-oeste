import { useEffect, useMemo, useState } from 'react';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import CalleModal from '../components/CalleModal';
import { CallesServices } from '../services/calles.services';

export default function CallesPage() {
  const [calles, setCalles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);

  const fetchCalles = async () => {
    try {
      setLoading(true);

      const params = { page, limit, search };
      if (estado !== '') params.estado = estado === 'true';

      const response = await CallesServices.getAll(params);

      setCalles(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalles();
  }, [page, limit, search, estado]);

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = (calle) => {
    setSelected(calle);
    setModalOpen(true);
  };

  const handleToggleStatus = async () => {
    try {
      setChangingStatus(true);
      await CallesServices.toggleStatus(statusTarget.id);
      toast.success('Estado actualizado correctamente');
      setStatusTarget(null);
      fetchCalles();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setChangingStatus(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Calle',
        accessorKey: 'nombre_calle',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
              <MapPinIcon className="h-5 w-5" />
            </div>
            <span className="font-semibold text-slate-800">{row.original.nombre_calle}</span>
          </div>
        ),
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              row.original.estado
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {row.original.estado ? 'Activa' : 'Inactiva'}
          </span>
        ),
      },
      {
        header: 'Acciones',
        id: 'acciones',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => openEdit(row.original)}
              title="Editar"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setStatusTarget(row.original)}
              title={row.original.estado ? 'Deshabilitar' : 'Habilitar'}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <PowerIcon className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Calles"
        description="Administra las calles utilizadas en los registros de socios y acciones."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva calle
          </button>
        }
      />

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_190px]">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar calle..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={estado}
          onChange={(event) => {
            setEstado(event.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500"
        >
          <option value="">Todas</option>
          <option value="true">Activas</option>
          <option value="false">Inactivas</option>
        </select>
      </div>

      <DataTable
        data={calles}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />

      <CalleModal
        open={modalOpen}
        calle={selected}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchCalles();
        }}
      />

      <ConfirmModal
        open={Boolean(statusTarget)}
        title={statusTarget?.estado ? 'Deshabilitar calle' : 'Habilitar calle'}
        message={`¿Deseas ${statusTarget?.estado ? 'deshabilitar' : 'habilitar'} la calle “${statusTarget?.nombre_calle ?? ''}”?`}
        confirmText="Confirmar"
        loading={changingStatus}
        onConfirm={handleToggleStatus}
        onClose={() => setStatusTarget(null)}
      />
    </section>
  );
}
