import { useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  ClockIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import HistorialLecturasModal from '../components/HistorialLecturasModal';
import LecturaModal from '../components/LecturaModal';
import { LecturasServices } from '../services/lecturas.services';

export default function LecturasPage() {
  const {
    items: acciones,
    loading,
    page,
    limit,
    total,
    totalPages,
    search,
    setPage,
    setLimit,
    setSearch,
    submitSearch,
    reload,
  } = usePaginatedList(LecturasServices.getAll);

  const [modal, setModal] = useState({
    open: false,
    mode: 'create',
    accion: null,
  });
  const [historial, setHistorial] = useState({
    open: false,
    accionId: null,
    accion: null,
  });

  const openModal = (mode, accion) => setModal({ open: true, mode, accion });
  const closeModal = () =>
    setModal({ open: false, mode: 'create', accion: null });

  const columns = useMemo(
    () => [
      {
        header: 'Acción',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">
              #{row.original.codigo_interno}
            </p>
            <p className="text-xs text-slate-500">{row.original.estado}</p>
          </div>
        ),
      },
      {
        accessorKey: 'nombre_completo',
        header: 'Socio',
      },
      {
        accessorKey: 'nro_medidor',
        header: 'Medidor',
      },
      {
        accessorKey: 'nombre_calle',
        header: 'Calle',
      },
      {
        accessorKey: 'nombre_tarifa',
        header: 'Tarifa',
      },
      {
        header: 'Última lectura',
        cell: ({ row }) => {
          const lectura = row.original.lecturas?.[0];
          return lectura ? `${lectura.lectura_actual}` : 'Pendiente';
        },
      },
      {
        header: 'Consumo',
        cell: ({ row }) => {
          const lectura = row.original.lecturas?.[0];
          return lectura ? `${lectura.consumo_m3} m³` : '-';
        },
      },
      {
        header: 'Acciones',
        cell: ({ row }) => {
          const accion = row.original;
          const tieneLectura = (accion.lecturas?.length ?? 0) > 0;

          return (
            <div className="flex items-center gap-2">
              <ActionButton
                title="Registrar lectura"
                onClick={() => openModal('create', accion)}
              >
                <PlusIcon className="h-4 w-4" />
              </ActionButton>

              <ActionButton
                title="Historial"
                onClick={() =>
                  setHistorial({
                    open: true,
                    accionId: accion.id,
                    accion,
                  })
                }
              >
                <ClockIcon className="h-4 w-4" />
              </ActionButton>

              {tieneLectura && (
                <ActionButton
                  title="Editar lectura"
                  onClick={() => openModal('edit', accion)}
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </ActionButton>
              )}

              <ActionButton
                title="Cambio de medidor"
                onClick={() => openModal('cambio', accion)}
              >
                <ArrowPathIcon className="h-4 w-4" />
              </ActionButton>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Lecturas de agua"
        description="Registra lecturas, consulta el historial y gestiona cambios de medidor."
        action={
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </button>
        }
      />

      <SearchFilterBar
        value={search}
        onChange={setSearch}
        onSubmit={submitSearch}
        placeholder="Buscar socio, medidor o acción"
      />

      <DataTable
        data={acciones}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />

      <LecturaModal {...modal} onClose={closeModal} onSaved={reload} />

      <HistorialLecturasModal
        open={historial.open}
        accion_id={historial.accionId}
        accion={historial.accion}
        onClose={() =>
          setHistorial({ open: false, accionId: null, accion: null })
        }
      />
    </section>
  );
}

function ActionButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
    >
      {children}
    </button>
  );
}
