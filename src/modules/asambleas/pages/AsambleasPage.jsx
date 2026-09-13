import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import AsambleaModal from '../components/AsambleaModal';
import AsistenciaModal from '../components/AsistenciaModal';
import AsistenciasPanel from '../components/AsistenciasPanel';
import { AsambleasServices } from '../services/asambleas.services';

const formatDate = (value) =>
  new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));

export default function AsambleasPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [loadingAsistencias, setLoadingAsistencias] = useState(false);
  const [editingAsistencia, setEditingAsistencia] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await AsambleasServices.getAll({ page, limit });
    setLoading(false);

    if (!response.ok) return setMessage(response.message);
    setData(response.data);
    setTotalPages(response.totalPages);
    setTotalItems(response.total);
  }, [page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (asamblea) => {
    setEditing(asamblea);
    setModalOpen(true);
  };

  const saveAsamblea = async (payload) => {
    setSaving(true);
    const response = editing
      ? await AsambleasServices.update(editing.id, payload)
      : await AsambleasServices.create(payload);
    setSaving(false);

    if (!response.ok) return setMessage(response.message);
    setModalOpen(false);
    setMessage(response.message);
    await load();
  };

  const openAsistencias = async (asamblea) => {
    setSelected(asamblea);
    setLoadingAsistencias(true);
    const response = await AsambleasServices.getAcciones(asamblea.id);
    setLoadingAsistencias(false);

    if (!response.ok) return setMessage(response.message);
    setAsistencias(response.data);
  };

  const saveAsistencia = async (payload) => {
    setSaving(true);
    const response = await AsambleasServices.updateAsistencia(
      editingAsistencia.id,
      payload,
    );
    setSaving(false);

    if (!response.ok) return setMessage(response.message);
    setEditingAsistencia(null);
    setMessage(response.message);
    await openAsistencias(selected);
  };

  const handlePdfRerporte = async (id) => {
    try {
      const pdfBlob = await AsambleasServices.getReporte(id);

      const url = URL.createObjectURL(
        new Blob([pdfBlob], {
          type: 'application/pdf',
        }),
      );

      window.open(url, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000);
    } catch (e) {
      toast.error(e.message || 'Algo salió mal');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'titulo',
        header: 'Multa',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">
              {row.original.titulo}
            </p>
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
              <CalendarDaysIcon className="h-4 w-4" />{' '}
              {formatDate(row.original.fecha)}
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
            Bs {Number(row.original.monto_multa).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'monto_retraso',
        header: 'Multa retraso',
        cell: ({ row }) => (
          <span className="font-semibold text-amber-700">
            Bs {Number(row.original.monto_retraso).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.original.estado ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
          >
            {row.original.estado ? 'Activa' : 'Inactiva'}
          </span>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => openAsistencias(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              <UserGroupIcon className="h-4 w-4" /> Asistencia
            </button>
            <button
              onClick={() => openEdit(row.original)}
              className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              title="Editar"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePdfRerporte(row.original.id)}
              className="rounded-lg bg-emerald-700 p-2 text-white hover:bg-emerald-800"
              title="Editar"
            >
              Obtener reporte
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 text-xs font-medium text-slate-400">
            Inicio / Multas
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Multas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Crea reuniones y registra asistencia, faltas, retrasos y permisos.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <PlusIcon className="h-5 w-5" /> Nuevo Registro
        </button>
      </header>

      {message && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <span>{message}</span>
          <button
            onClick={() => setMessage('')}
            className="font-semibold text-slate-400 hover:text-slate-700"
          >
            Cerrar
          </button>
        </div>
      )}

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
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
        loading={saving}
        onClose={() => setModalOpen(false)}
        onSave={saveAsamblea}
      />

      <AsistenciaModal
        asistencia={editingAsistencia}
        loading={saving}
        onClose={() => setEditingAsistencia(null)}
        onSave={saveAsistencia}
      />
    </section>
  );
}
