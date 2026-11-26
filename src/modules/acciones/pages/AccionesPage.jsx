import { useMemo } from 'react';
import {
  CheckCircleIcon,
  PlusIcon,
  PowerIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import DashboardStatCard from '../../../components/DashboardStatCard';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import SelectComponent from '../../../components/Select';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import { ESTADO_ACCION_OPTIONS } from '../../../core/constants/catalogFilters';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import AccionModal from '../components/AccionModal';
import { AccionesServices } from '../services/acciones.services';

export default function AccionesPage() {
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  const list = usePaginatedList(AccionesServices.getAll, {
    initialLimit: 5,
    initialFilters: { estado: '' },
    errorMessage: 'No se pudieron cargar las acciones de agua',
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo_interno',
        header: 'Código',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-800">
              {row.original.codigo_interno}
            </p>
            <p className="text-xs text-slate-400">ID: {row.original.id}</p>
          </div>
        ),
      },
      {
        accessorKey: 'nombre_socio',
        header: 'Socio',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-800">
              {row.original.nombre_socio}
            </p>
            <p className="text-xs text-slate-400">
              Medidor: {row.original.nro_medidor || 'S/N'}
            </p>
          </div>
        ),
      },
      { accessorKey: 'nombre_calle', header: 'Calle' },
      { accessorKey: 'nombre_tarifa', header: 'Tarifa' },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge value={getValue()} />,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => openModal(MODALS.EDIT, row.original.id)}
            editTitle="Editar acción"
          />
        ),
      },
    ],
    [openModal],
  );

  const activas = list.items.filter((item) => item.estado === 'ACTIVO').length;
  const pasivas = list.items.filter((item) => item.estado === 'PASIVO').length;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Acciones registradas"
        description="Consulta y registra las acciones de agua de los socios."
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

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardStatCard
          title="Total de acciones"
          value={list.total}
          icon={RectangleStackIcon}
          iconClass="bg-slate-100 text-slate-600"
        />
        <DashboardStatCard
          title="Activas en página"
          value={activas}
          icon={CheckCircleIcon}
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <DashboardStatCard
          title="Pasivas en página"
          value={pasivas}
          icon={PowerIcon}
          iconClass="bg-amber-50 text-amber-600"
        />
      </div>

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar por socio, código o medidor..."
      >
        <SelectComponent
          label="Estado"
          name="estado"
          options={ESTADO_ACCION_OPTIONS}
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

      <AccionModal
        open={isModalOpen(MODALS.CREATE)}
        onClose={closeModal}
        onCreated={list.reload}
      />

      <AccionModal
        open={isModalOpen(MODALS.EDIT)}
        onClose={closeModal}
        accionId={modalState.data}
        onCreated={list.reload}
      />
    </section>
  );
}
