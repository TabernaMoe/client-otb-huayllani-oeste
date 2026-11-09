import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReciboServices } from '../services';
import DataTableLocal from '../../../../components/DataTableLocal';
import { toast } from 'react-toastify';
import {
  NoSymbolIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { imprimirRecibo } from '../../../cobros/reciboPdf/generarReciboHTML';

export default function ReciboPage() {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener todos los recibos
  const dataLoad = useCallback(async () => {
    try {
      setLoading(true);

      const response = await ReciboServices.getAll();

      if (!response.ok) {
        throw new Error(response.message || 'No se pudo obtener los datos');
      }

      setFilas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setFilas([]);

      toast.error(
        error instanceof Error
          ? error.message
          : 'Algo salió mal, inténtelo más tarde',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dataLoad();
  }, [dataLoad]);

  // Visualizar recibo
  const handleRecibo = useCallback((row) => {
    imprimirRecibo(row);
  }, []);

  // Anular recibo (pendiente de implementar)
  const handleAnularRecibo = useCallback((row) => {
    toast.info(
      `La anulación del recibo ${row.numero_recibo} aún no está implementada`,
    );
  }, []);

  // Columnas de la tabla
  const columns = useMemo(
    () => [
      {
        accessorKey: 'numero_recibo',
        header: 'N° RECIBO',
        cell: ({ getValue }) => (
          <span className="font-semibold text-slate-800">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'socio',
        header: 'NOMBRE DEL SOCIO',
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-700">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'fecha_emision',
        header: 'FECHA DE EMISIÓN',
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-600">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'ESTADO',
        cell: ({ row }) => {
          const activo = row.original.estado === true;

          return (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                activo
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                  : 'bg-rose-50 text-rose-700 ring-rose-200'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  activo ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              {activo ? 'Activo' : 'Inactivo'}
            </span>
          );
        },
      },
      {
        id: 'acciones',
        header: 'ACCIONES',
        cell: ({ row }) => {
          const recibo = row.original;
          const activo = recibo.estado === true;

          return (
            <div className="flex flex-wrap items-center gap-2">
              {/* Ver recibo */}
              <button
                type="button"
                onClick={() => handleRecibo(recibo)}
                title="Ver recibo"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:scale-95"
              >
                <EyeIcon className="h-4 w-4" />
                Ver recibo
              </button>

              {/* Anular recibo */}
              <button
                type="button"
                onClick={() => handleAnularRecibo(recibo)}
                disabled={!activo}
                title={activo ? 'Anular recibo' : 'El recibo ya está inactivo'}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-all duration-200 hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-rose-50"
              >
                <NoSymbolIcon className="h-4 w-4" />
                Anular
              </button>
            </div>
          );
        },
      },
    ],
    [handleRecibo, handleAnularRecibo],
  );

  return (
    <section className="mx-auto max-w-7xl space-y-6 pb-8">
      {/* ENCABEZADO */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-6 shadow-lg sm:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Gestión de recibos
              </h1>

              <p className="mt-1 text-sm text-slate-300">
                Consulta, visualiza y administra los recibos emitidos.
              </p>
            </div>
          </div>

          {/* Actualizar */}
          <button
            type="button"
            onClick={dataLoad}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        <div className="pointer-events-none absolute -right-12 -top-20 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl" />
      </header>

      {/* TABLA DE RECIBOS */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Encabezado de tabla */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5">
              <ClipboardDocumentListIcon className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Listado de recibos
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Consulta y administra todos los recibos registrados.
              </p>
            </div>
          </div>
        </div>

        {/* Contenido de tabla */}
        <div className="min-w-0 p-4">
          <DataTableLocal columns={columns} data={filas} loading={loading} />
        </div>
      </div>
    </section>
  );
}
