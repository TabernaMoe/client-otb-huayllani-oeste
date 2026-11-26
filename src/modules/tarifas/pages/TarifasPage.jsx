import { useCallback, useMemo, useState } from 'react';
import { BanknotesIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
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
import { formatCurrency } from '../../../utils/formatters';
import {
  ESTADO_FILTER_OPTIONS_FEM,
  withBooleanEstado,
} from '../../../core/constants/catalogFilters';
import TarifaModal from '../components/TarifaModal';
import { TarifasServices } from '../services/tarifas.services';

const fetchTarifas = withBooleanEstado(TarifasServices.getAll);

export default function TarifasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmTarifa, setConfirmTarifa] = useState(null);

  const list = usePaginatedList(fetchTarifas, {
    initialLimit: 5,
    initialFilters: { estado: '' },
    errorMessage: 'No se pudieron cargar las tarifas',
  });
  const { submitting, run } = useAsyncSubmit();

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = useCallback(async (id) => {
    try {
      const response = await TarifasServices.getById(id);
      if (!response.data) {
        toast.error('Error: No se encontró la tarifa');
        return;
      }
      setSelected(response.data);
      setModalOpen(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo cargar la tarifa'));
    }
  }, []);

  const handleToggleEstado = async () => {
    if (!confirmTarifa) return;
    await run(() => TarifasServices.changeEstado(confirmTarifa.id), {
      successMessage: (res) => res?.message || 'Estado actualizado',
      errorMessage: 'No se pudo cambiar el estado de la tarifa',
      onSuccess: async () => {
        setConfirmTarifa(null);
        await list.reload();
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_tarifa',
        header: 'Tarifa',
        cell: ({ row }) => {
          const rangos = row.original.rangosTarifa ?? [];
          return (
            <div className="flex min-w-52 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <BanknotesIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">
                  {row.original.nombre_tarifa}
                </p>
                <p className="text-xs text-slate-500">{rangos.length} rangos</p>
              </div>
            </div>
          );
        },
      },
      {
        id: 'rangos',
        header: 'Rangos de consumo',
        cell: ({ row }) => (
          <div className="flex min-w-80 flex-wrap gap-1.5">
            {(row.original.rangosTarifa ?? []).map((rango, index) => (
              <span
                key={index}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {rango.consumo_minimo}–{rango.consumo_maximo ?? '∞'} m³ ·{' '}
                {formatCurrency(rango.precio)}
              </span>
            ))}
          </div>
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
            onEdit={() => openEdit(row.original.id)}
            onToggleStatus={() => setConfirmTarifa(row.original)}
            editTitle="Editar tarifa"
            toggleTitle="Cambiar estado"
          />
        ),
      },
    ],
    [openEdit],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Tarifas de agua"
        description="Administra las tarifas y sus rangos de consumo."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" /> Nueva tarifa
          </button>
        }
      />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar tarifa..."
      >
        <SelectComponent
          label="Estado"
          name="estado"
          value={list.filters.estado}
          options={ESTADO_FILTER_OPTIONS_FEM}
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

      <TarifaModal
        open={modalOpen}
        tarifa={selected}
        onClose={() => setModalOpen(false)}
        onSuccess={list.reload}
      />

      <ConfirmModal
        open={Boolean(confirmTarifa)}
        title={confirmTarifa?.estado ? 'Deshabilitar tarifa' : 'Habilitar tarifa'}
        message={`¿Deseas ${confirmTarifa?.estado ? 'deshabilitar' : 'habilitar'} la tarifa ${confirmTarifa?.nombre_tarifa || ''}?`}
        confirmText="Confirmar"
        loading={submitting}
        onConfirm={handleToggleEstado}
        onClose={() => setConfirmTarifa(null)}
      />
    </section>
  );
}
