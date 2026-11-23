import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTableLocal from '../../../components/DataTableLocal';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import { LecturasServices } from '../services/lecturas.services';
import ModificarMoraHistorialModal from './ModificarMoraHistorialModal';

export default function ModificarMora() {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  const dataLoad = useCallback(async () => {
    try {
      setLoading(true);
      const response = await LecturasServices.getAcionesWithMora();

      if (!response.ok) {
        toast.error(response.message || 'No se pudo cargar las acciones con mora');
        return;
      }
      setFilas(Array.isArray(response.data) ? response.data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dataLoad();
  }, [dataLoad]);

  const filasFiltradas = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return filas;
    return filas.filter((row) =>
      [
        row.codigo_interno,
        row.nombre_completo,
        row.nro_medidor,
        row.nombre_calle,
      ]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(term)),
    );
  }, [filas, query]);

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
        accessorKey: 'mora_total',
        header: 'Mora total',
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-700"
            onClick={() => openModal(MODALS.VIEW, row.original)}
          >
            <ClockIcon className="h-4 w-4" />
            Historial de lecturas
          </button>
        ),
      },
    ],
    [openModal],
  );

  return (
    <>
      <section className="space-y-5">
        <PageHeader
          title="Gestión de mora"
          description="Consulta las acciones con mora acumulada y ajusta la mora por periodo."
          action={
            <button
              type="button"
              onClick={dataLoad}
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
          onSubmit={() => setQuery(search.trim())}
          placeholder="Buscar socio, medidor, calle o acción"
        />

        <DataTableLocal
          data={filasFiltradas}
          columns={columns}
          loading={loading}
        />
      </section>

      <ModificarMoraHistorialModal
        open={isModalOpen(MODALS.VIEW)}
        accion={modalState.data}
        onClose={() => {
          closeModal();
          dataLoad();
        }}
      />
    </>
  );
}
