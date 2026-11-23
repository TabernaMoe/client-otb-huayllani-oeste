import { useMemo, useState } from 'react';
import { PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import SelectComponent from '../../../components/Select';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import SocioDetalleModal from '../components/SocioDetalleModal';
import SocioModal from '../components/SocioModal';
import { SocioServices } from '../services/socio.services';

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

const formatNombreCompleto = (socio) =>
  [socio.nombres, socio.primer_apellido, socio.segundo_apellido]
    .filter(Boolean)
    .join(' ');

export default function SocioPage() {
  const [formSocio, setFormSocio] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detalleId, setDetalleId] = useState(null);
  const [confirmSocio, setConfirmSocio] = useState(null);

  const list = usePaginatedList(
    (params) => {
      const query = { ...params };
      if (query.estado !== undefined) query.estado = query.estado === 'true';
      return SocioServices.getAll(query);
    },
    {
      initialLimit: 5,
      initialFilters: { estado: '' },
      errorMessage: 'No se pudieron cargar los socios',
    },
  );
  const { submitting, run } = useAsyncSubmit();

  const handleToggleEstado = async () => {
    if (!confirmSocio) return;
    await run(() => SocioServices.changeEstado(confirmSocio.id), {
      successMessage: (res) => res?.message || 'Estado actualizado',
      errorMessage: 'No se pudo cambiar el estado',
      onSuccess: async () => {
        setConfirmSocio(null);
        await list.reload();
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'Socio',
        cell: ({ row }) => (
          <div className="flex min-w-56 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <UserIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-slate-900">
                {formatNombreCompleto(row.original)}
              </p>
              <p className="text-xs text-slate-500">
                CI {row.original.ci_socio} {row.original.ci_expedido}
              </p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'numero_celular', header: 'Celular' },
      { accessorKey: 'direccion', header: 'Dirección' },
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
            onView={() => setDetalleId(row.original.id)}
            onEdit={() => {
              setFormSocio(row.original);
              setFormOpen(true);
            }}
            onToggleStatus={() => setConfirmSocio(row.original)}
            viewTitle="Ver detalle"
            editTitle="Editar socio"
            toggleTitle="Cambiar estado"
          />
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Socios"
        description="Administra la información, estado y acciones de los socios registrados."
        action={
          <button
            type="button"
            onClick={() => {
              setFormSocio(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" /> Nuevo socio
          </button>
        }
      />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar por CI o nombre..."
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

      <SocioModal
        open={formOpen}
        socio={formSocio}
        onClose={() => setFormOpen(false)}
        onSuccess={list.reload}
      />

      <SocioDetalleModal
        open={Boolean(detalleId)}
        socioId={detalleId}
        onClose={() => setDetalleId(null)}
      />

      <ConfirmModal
        open={Boolean(confirmSocio)}
        title={confirmSocio?.estado ? 'Deshabilitar socio' : 'Habilitar socio'}
        message={`¿Deseas ${confirmSocio?.estado ? 'deshabilitar' : 'habilitar'} a ${
          confirmSocio ? formatNombreCompleto(confirmSocio) : ''
        }?`}
        confirmText="Confirmar"
        loading={submitting}
        onConfirm={handleToggleEstado}
        onClose={() => setConfirmSocio(null)}
      />
    </section>
  );
}
