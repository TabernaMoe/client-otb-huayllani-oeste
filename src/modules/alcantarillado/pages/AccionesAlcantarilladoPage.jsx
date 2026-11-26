import { useMemo } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import TableActionButtons from '../../../components/TableActionButtons';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import AccionAlcantarilladoModal from '../components/AccionAlcantarilladoModal';
import { AccionesAlcantarilladoServices } from '../services/accionesAlcantarillado.services';

export default function AccionesAlcantarilladoPage() {
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  const list = usePaginatedList(AccionesAlcantarilladoServices.getAll, {
    initialLimit: 5,
    errorMessage: 'No se pudieron cargar las acciones de alcantarillado',
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo_interno',
        header: 'Código',
        cell: ({ row }) => (
          <p className="font-semibold text-slate-800">
            {row.original.codigo_interno}
          </p>
        ),
      },
      {
        accessorKey: 'ci_socio',
        header: 'Cédula de identidad',
        cell: ({ row }) => (
          <p className="font-medium text-slate-800">{row.original.ci_socio}</p>
        ),
      },
      {
        accessorKey: 'nombre_socio',
        header: 'Socio',
        cell: ({ row }) => (
          <p className="font-medium text-slate-800">
            {row.original.nombre_socio}
          </p>
        ),
      },
      { accessorKey: 'nombre_calle', header: 'Calle' },
      { accessorKey: 'direccion', header: 'Dirección' },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => openModal(MODALS.EDIT, row.original.id)}
            editTitle="Editar acción de alcantarillado"
          />
        ),
      },
    ],
    [openModal],
  );

  return (
    <>
      <section className="space-y-5">
        <PageHeader
          title="Acciones de alcantarillado"
          description="Consulta, registra y edita las acciones de alcantarillado."
          action={
            <button
              type="button"
              onClick={() => openModal(MODALS.CREATE)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <PlusIcon className="h-5 w-5" />
              Nueva acción
            </button>
          }
        />

        <SearchFilterBar
          search={list.search}
          onSearchChange={list.setSearch}
          placeholder="Buscar por socio, CI, código o dirección..."
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
      </section>

      <AccionAlcantarilladoModal
        onClose={closeModal}
        onCreated={list.reload}
        open={isModalOpen(MODALS.CREATE)}
      />
      <AccionAlcantarilladoModal
        onClose={closeModal}
        onCreated={list.reload}
        open={isModalOpen(MODALS.EDIT)}
        id={modalState.data}
      />
    </>
  );
}
