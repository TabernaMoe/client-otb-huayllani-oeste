import { useCallback, useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTableLocal from '../../../components/DataTableLocal';

import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import { LecturasServices } from '../services/lecturas.services';

import ModificarMoraHistorialModal from './ModificarMoraHistorialModal';

export default function ModificarMora() {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  const dataLoad = useCallback(async () => {
    try {
      setLoading(true);
      const response = await LecturasServices.getAcionesWithMora();

      if (!response.ok) {
        throw new Error('No se pudo cargar la tabla');
      }
      setFilas(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dataLoad();
  }, []);

  const columns = [
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
      header: 'Mora total ',
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <button
              className="bg-slate-200 p-2 rounded-2xl hover:bg-slate-300"
              onClick={() => {
                openModal(MODALS.VIEW, row.original);
              }}
            >
              Hitorial de lecturas
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              GESTION DE MORA
            </h1>
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setQuery(search.trim());
          }}
          className="flex max-w-xl gap-2"
        >
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar socio, medidor o acción"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Buscar
          </button>
        </form>
        <DataTableLocal data={filas} columns={columns} loading={loading} />
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
