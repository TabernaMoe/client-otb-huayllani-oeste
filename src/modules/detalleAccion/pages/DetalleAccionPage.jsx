import { useCallback, useMemo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import AccionCatalogTabs from '../../../components/AccionCatalogTabs';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import SelectComponent from '../../../components/Select';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { getApiErrorMessage } from '../../../services/error';
import DetalleAccionModal from '../components/DetalleAccionModal';
import { DetalleAccionServices } from '../services/detalleAccion.services';

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

export default function DetalleAccionPage() {
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const list = usePaginatedList(
    (params) => {
      const query = { ...params };
      if (query.estado !== undefined) query.estado = query.estado === 'true';
      return DetalleAccionServices.getAll(query);
    },
    {
      initialLimit: 5,
      initialFilters: { estado: '' },
      extract: (response) => {
        const items = Array.isArray(response?.data) ? response.data : [];
        return {
          items,
          total: Number(response?.total ?? items.length),
          totalPages: Math.max(1, Number(response?.totalPages ?? 1)),
        };
      },
      errorMessage: 'No se pudieron cargar los detalles de acción',
    },
  );
  const { submitting, run } = useAsyncSubmit();

  const handleEdit = useCallback(async (id) => {
    try {
      const response = await DetalleAccionServices.getById(id);
      if (!response.data) {
        toast.error('Error: No se encontró el detalle de acción');
        return;
      }
      setModal(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo cargar el detalle'));
    }
  }, []);

  const handleChangeEstado = async () => {
    if (!confirm) return;
    await run(() => DetalleAccionServices.changeEstado(confirm.id), {
      successMessage: (res) => res?.message || 'Estado actualizado',
      errorMessage: 'No se pudo cambiar el estado del detalle',
      onSuccess: async () => {
        setConfirm(null);
        await list.reload();
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_accion',
        header: 'Detalle',
        cell: ({ row }) => (
          <span className="font-semibold text-slate-800">
            {row.original.nombre_accion}
          </span>
        ),
      },
      { accessorKey: 'nombre_tipo_accion', header: 'Tipo de acción' },
      {
        accessorKey: 'precio_accion',
        header: 'Precio',
        cell: ({ row }) => (
          <span>Bs {Number(row.original.precio_accion).toFixed(2)}</span>
        ),
      },
      {
        accessorKey: 'tipo_cobro',
        header: 'Cobro',
        cell: ({ row }) => (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {row.original.tipo_cobro}
          </span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge value={Boolean(getValue())} />,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => handleEdit(row.original.id)}
            onToggleStatus={() => setConfirm(row.original)}
            editTitle="Editar detalle"
            toggleTitle="Cambiar estado"
          />
        ),
      },
    ],
    [handleEdit],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Catálogo de acciones"
        description="Administra los tipos y conceptos que pueden asignarse a una acción."
        action={
          <button
            type="button"
            onClick={() => setModal({})}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo detalle
          </button>
        }
      />

      <AccionCatalogTabs />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar detalle de acción..."
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

      <DetalleAccionModal
        open={modal !== null}
        data={modal?.id ? modal : null}
        onClose={() => setModal(null)}
        onSuccess={async () => {
          setModal(null);
          await list.reload();
        }}
      />

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.estado ? 'Deshabilitar detalle' : 'Habilitar detalle'}
        message={`¿Deseas ${confirm?.estado ? 'deshabilitar' : 'habilitar'} “${confirm?.nombre_accion || ''}”?`}
        confirmText="Confirmar"
        loading={submitting}
        onConfirm={handleChangeEstado}
        onClose={() => setConfirm(null)}
      />
    </section>
  );
}
