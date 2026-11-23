import { useMemo, useState } from 'react';
import { PlusIcon, TagIcon } from '@heroicons/react/24/outline';
import AccionCatalogTabs from '../../../components/AccionCatalogTabs';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import TableActionButtons from '../../../components/TableActionButtons';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { TipoAccionServices } from '../services/tipoAccion.services';
import TipoAccionModal from './TipoAccionModal';

export default function TipoAccionPage() {
  const [modal, setModal] = useState(null);

  const list = usePaginatedList(TipoAccionServices.getAll, {
    initialLimit: 5,
    errorMessage: 'No se pudieron cargar los tipos de acción',
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_tipo_accion',
        header: 'Tipo de acción',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TagIcon className="h-5 w-5" />
            </span>
            <span className="font-semibold text-slate-800">
              {row.original.nombre_tipo_accion}
            </span>
          </div>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => setModal(row.original)}
            editTitle="Editar tipo de acción"
          />
        ),
      },
    ],
    [],
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
            Nuevo tipo
          </button>
        }
      />

      <AccionCatalogTabs />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar tipo de acción..."
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

      <TipoAccionModal
        open={modal !== null}
        data={modal?.id ? modal : null}
        onClose={() => setModal(null)}
        onSuccess={async () => {
          setModal(null);
          await list.reload();
        }}
      />
    </section>
  );
}
