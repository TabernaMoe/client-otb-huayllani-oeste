import { useMemo, useState } from 'react';
import { MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import SelectComponent from '../../../components/Select';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import CalleModal from '../components/CalleModal';
import { CallesServices } from '../services/calles.services';

const ESTADOS = [
  { value: '', label: 'Todas' },
  { value: 'true', label: 'Activas' },
  { value: 'false', label: 'Inactivas' },
];

export default function CallesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const list = usePaginatedList(
    (params) => {
      const query = { ...params };
      if (query.estado !== undefined) query.estado = query.estado === 'true';
      return CallesServices.getAll(query);
    },
    {
      initialLimit: 5,
      initialFilters: { estado: '' },
      errorMessage: 'No se pudieron cargar las calles',
    },
  );
  const { submitting, run } = useAsyncSubmit();

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = (calle) => {
    setSelected(calle);
    setModalOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!statusTarget) return;
    await run(() => CallesServices.toggleStatus(statusTarget.id), {
      successMessage: 'Estado actualizado correctamente',
      errorMessage: 'No se pudo cambiar el estado de la calle',
      onSuccess: async () => {
        setStatusTarget(null);
        await list.reload();
      },
    });
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
            <span className="font-semibold text-slate-800">
              {row.original.nombre_calle}
            </span>
          </div>
        ),
      },
      {
        header: 'Estado',
        accessorKey: 'estado',
        cell: ({ getValue }) => (
          <StatusBadge
            value={Boolean(getValue())}
            activeLabel="Activa"
            inactiveLabel="Inactiva"
          />
        ),
      },
      {
        header: 'Acciones',
        id: 'acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => openEdit(row.original)}
            onToggleStatus={() => setStatusTarget(row.original)}
            editTitle="Editar calle"
            toggleTitle={row.original.estado ? 'Deshabilitar' : 'Habilitar'}
          />
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

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar calle..."
      >
        <SelectComponent
          label="Estado"
          name="estado"
          value={list.filters.estado}
          options={ESTADOS}
          onChange={(e) => list.setFilter('estado', e.target.value ?? '')}
        />
      </SearchFilterBar>

      <DataTable
        data={list.items}
        columns={columns}
        loading={list.loading}
        page={list.page}
        limit={list.limit}
        totalPages={list.totalPages}
        totalItems={list.total}
        onPageChange={list.setPage}
        onLimitChange={list.setLimit}
      />

      <CalleModal
        open={modalOpen}
        calle={selected}
        onClose={() => setModalOpen(false)}
        onSuccess={async () => {
          setModalOpen(false);
          await list.reload();
        }}
      />

      <ConfirmModal
        open={Boolean(statusTarget)}
        title={statusTarget?.estado ? 'Deshabilitar calle' : 'Habilitar calle'}
        message={`¿Deseas ${statusTarget?.estado ? 'deshabilitar' : 'habilitar'} la calle “${statusTarget?.nombre_calle ?? ''}”?`}
        confirmText="Confirmar"
        loading={submitting}
        onConfirm={handleToggleStatus}
        onClose={() => setStatusTarget(null)}
      />
    </section>
  );
}
