import { useMemo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import AlcantarilladoModal from '../components/AlcantarilladoModal';
import { AlcantarilladoServices } from '../services/alcantarillado.services';

const formatMoney = (value) => `Bs ${Number(value).toFixed(2)}`;

export default function AlcantarilladoPage() {
  const [modal, setModal] = useState({ open: false, item: null });
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const list = usePaginatedList(AlcantarilladoServices.getAll, {
    initialLimit: 10,
    extract: (response) => {
      const items = Array.isArray(response?.data) ? response.data : [];
      return {
        items,
        total: Number(response?.total ?? items.length),
        totalPages: Math.max(1, Number(response?.totalPages ?? 1)),
      };
    },
    errorMessage: 'No se pudieron cargar los detalles de alcantarillado',
  });
  const { submitting, run } = useAsyncSubmit();

  const handleToggleEstado = async () => {
    if (!confirm.item) return;
    await run(() => AlcantarilladoServices.changeEstado(confirm.item.id), {
      successMessage: (res) => res?.message || 'Estado actualizado',
      errorMessage: 'No se pudo cambiar el estado del detalle',
      onSuccess: async () => {
        setConfirm({ open: false, item: null });
        await list.reload();
      },
    });
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'nombre_accion', header: 'Detalle' },
      {
        accessorKey: 'precio_accion',
        header: 'Precio',
        cell: ({ row }) => formatMoney(row.original.precio_accion),
      },
      {
        accessorKey: 'tipo_cobro',
        header: 'Cobro',
        cell: ({ row }) => (
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
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
            onEdit={() => setModal({ open: true, item: row.original })}
            onToggleStatus={() => setConfirm({ open: true, item: row.original })}
            editTitle="Editar detalle"
            toggleTitle="Cambiar estado"
          />
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title="Alcantarillado"
        description="Administra los conceptos y precios asociados al alcantarillado."
        action={
          <button
            type="button"
            onClick={() => setModal({ open: true, item: null })}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo detalle
          </button>
        }
      />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar detalle..."
      />

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

      <AlcantarilladoModal
        open={modal.open}
        item={modal.item}
        onClose={() => setModal({ open: false, item: null })}
        onSaved={list.reload}
      />

      <ConfirmModal
        open={confirm.open}
        title="Cambiar estado"
        message={`¿Deseas cambiar el estado de ${confirm.item?.nombre_accion || ''}?`}
        confirmText="Confirmar"
        loading={submitting}
        onConfirm={handleToggleEstado}
        onClose={() => setConfirm({ open: false, item: null })}
      />
    </section>
  );
}
