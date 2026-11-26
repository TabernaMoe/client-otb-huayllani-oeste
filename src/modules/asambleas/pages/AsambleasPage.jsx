import { useCallback, useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { getApiErrorMessage } from '../../../services/error';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import AsambleaModal from '../components/AsambleaModal';
import AsistenciaModal from '../components/AsistenciaModal';
import AsistenciasPanel from '../components/AsistenciasPanel';
import { AsambleasServices } from '../services/asambleas.services';

const formatAsambleaDate = (value) =>
  formatDate(value && !String(value).includes('T') ? `${value}T00:00:00` : value);

export default function AsambleasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [loadingAsistencias, setLoadingAsistencias] = useState(false);
  const [editingAsistencia, setEditingAsistencia] = useState(null);

  const list = usePaginatedList(AsambleasServices.getAll, {
    initialLimit: 5,
    errorMessage: 'No se pudieron cargar las asambleas',
  });
  const { submitting, run } = useAsyncSubmit();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = useCallback((asamblea) => {
    setEditing(asamblea);
    setModalOpen(true);
  }, []);

  const saveAsamblea = async (payload) => {
    const isEdit = Boolean(editing?.id);
    await run(
      () =>
        isEdit
          ? AsambleasServices.update(editing.id, payload)
          : AsambleasServices.create(payload),
      {
        successMessage: (res) =>
          res?.message || (isEdit ? 'Asamblea actualizada' : 'Asamblea creada'),
        errorMessage: 'No se pudo guardar la asamblea',
        onSuccess: async () => {
          setModalOpen(false);
          await list.reload();
        },
      },
    );
  };

  const openAsistencias = useCallback(async (asamblea) => {
    setSelected(asamblea);
    setLoadingAsistencias(true);
    try {
      const response = await AsambleasServices.getAcciones(asamblea.id);
      if (!response.ok) {
        toast.error(getApiErrorMessage(response, 'No se pudo cargar la asistencia'));
        return;
      }
      setAsistencias(response.data ?? []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo cargar la asistencia'));
    } finally {
      setLoadingAsistencias(false);
    }
  }, []);

  const saveAsistencia = async (payload) => {
    if (!editingAsistencia) return;
    await run(
      () => AsambleasServices.updateAsistencia(editingAsistencia.id, payload),
      {
        successMessage: (res) => res?.message || 'Asistencia actualizada',
        errorMessage: 'No se pudo actualizar la asistencia',
        onSuccess: async () => {
          setEditingAsistencia(null);
          if (selected) await openAsistencias(selected);
        },
      },
    );
  };

  const handlePdfReporte = useCallback(async (id) => {
    try {
      const pdfBlob = await AsambleasServices.getReporte(id);
      const url = URL.createObjectURL(
        new Blob([pdfBlob], { type: 'application/pdf' }),
      );
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo generar el reporte PDF'));
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'titulo',
        header: 'Asamblea',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">{row.original.titulo}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPinIcon className="h-3.5 w-3.5" /> {row.original.lugar}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => (
          <div className="space-y-1 text-slate-600">
            <div className="flex items-center gap-1.5">
              <CalendarDaysIcon className="h-4 w-4" />
              {formatAsambleaDate(row.original.fecha)}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <ClockIcon className="h-4 w-4" /> {row.original.hora_inicio}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'monto_multa',
        header: 'Multa falta',
        cell: ({ row }) => (
          <span className="font-semibold text-slate-700">
            {formatCurrency(row.original.monto_multa)}
          </span>
        ),
      },
      {
        accessorKey: 'monto_retraso',
        header: 'Multa retraso',
        cell: ({ row }) => (
          <span className="font-semibold text-amber-700">
            {formatCurrency(row.original.monto_retraso)}
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
            onEdit={() => openEdit(row.original)}
            editTitle="Editar asamblea"
            extra={
              <>
                <button
                  type="button"
                  onClick={() => openAsistencias(row.original)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <UserGroupIcon className="h-4 w-4" /> Asistencia
                </button>
                <button
                  type="button"
                  onClick={() => handlePdfReporte(row.original.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  title="Obtener reporte PDF"
                >
                  <DocumentTextIcon className="h-4 w-4" /> Reporte
                </button>
              </>
            }
          />
        ),
      },
    ],
    [openEdit, openAsistencias, handlePdfReporte],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Asambleas"
        description="Crea reuniones y registra asistencia, faltas, retrasos y permisos."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" /> Nueva asamblea
          </button>
        }
      />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar asamblea por título o lugar..."
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

      <AsistenciasPanel
        asamblea={selected}
        data={asistencias}
        loading={loadingAsistencias}
        onClose={() => {
          setSelected(null);
          setAsistencias([]);
        }}
        onEdit={setEditingAsistencia}
      />

      <AsambleaModal
        open={modalOpen}
        asamblea={editing}
        loading={submitting}
        onClose={() => setModalOpen(false)}
        onSave={saveAsamblea}
      />

      <AsistenciaModal
        asistencia={editingAsistencia}
        loading={submitting}
        onClose={() => setEditingAsistencia(null)}
        onSave={saveAsistencia}
      />
    </section>
  );
}
