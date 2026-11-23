import { useMemo, useState } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import SearchFilterBar from '../../../components/SearchFilterBar';
import SelectComponent from '../../../components/Select';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { MultasServices } from '../services/multas.services';
import MultaModal from './MultaModal';

const ESTADO_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'true', label: 'Activas' },
  { value: 'false', label: 'Inactivas' },
];

export default function ListarMultasView() {
  const [selectedMulta, setSelectedMulta] = useState(null);
  const [confirmMulta, setConfirmMulta] = useState(null);

  const list = usePaginatedList(
    (params) => {
      const query = { ...params };
      if (query.estado !== undefined) query.estado = query.estado === 'true';
      return MultasServices.getAll(query);
    },
    {
      initialLimit: 5,
      initialFilters: { estado: '' },
      errorMessage: 'No se pudieron cargar las multas',
    },
  );
  const { submitting, run } = useAsyncSubmit();

  const handleToggleEstado = async () => {
    if (!confirmMulta) return;
    await run(() => MultasServices.cambiarEstado(confirmMulta.id), {
      successMessage: (res) => res?.message || 'Estado de multa actualizado',
      errorMessage: 'No se pudo cambiar el estado de la multa',
      onSuccess: async () => {
        setConfirmMulta(null);
        await list.reload();
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_multa',
        header: 'Multa',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-800">
              {row.original.nombre_multa}
            </p>
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
        cell: ({ getValue }) => (
          <StatusBadge
            value={Boolean(getValue())}
            activeLabel="Activa"
            inactiveLabel="Inactiva"
          />
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => setSelectedMulta(row.original)}
            onToggleStatus={() => setConfirmMulta(row.original)}
            editTitle="Editar multa"
            toggleTitle="Cambiar estado"
          />
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Multas registradas</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Consulta, edita y cambia el estado de las multas.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          {list.total} multas
        </span>
      </div>

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar por nombre de multa..."
      >
        <SelectComponent
          label="Estado"
          name="estado"
          options={ESTADO_OPTIONS}
          value={list.filters.estado}
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

      <MultaModal
        open={Boolean(selectedMulta)}
        multa={selectedMulta}
        onClose={() => setSelectedMulta(null)}
        onSaved={list.reload}
      />

      <ConfirmModal
        open={Boolean(confirmMulta)}
        title={confirmMulta?.estado ? 'Deshabilitar multa' : 'Habilitar multa'}
        message={`¿Deseas ${confirmMulta?.estado ? 'deshabilitar' : 'habilitar'} la multa “${confirmMulta?.nombre_multa || ''}”?`}
        confirmText="Confirmar"
        loading={submitting}
        onConfirm={handleToggleEstado}
        onClose={() => setConfirmMulta(null)}
      />
    </div>
  );
}
