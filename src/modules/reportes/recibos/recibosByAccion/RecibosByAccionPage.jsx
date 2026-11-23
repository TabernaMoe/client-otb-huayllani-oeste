import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReciboServices } from '../services/services';
import DataTableLocal from '../../../../components/DataTableLocal';
import { toast } from 'react-toastify';
import {
  NoSymbolIcon,
  EyeIcon,
  DocumentTextIcon,
  FunnelIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { imprimirRecibo } from '../../../cobros/reciboPdf/generarReciboHTML';
import Select from '../../../../components/Select';

const hasSelection = (val) => val !== '' && val !== null && val !== undefined;

export default function ReciboPage() {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAcciones, setLoadingAcciones] = useState(false);

  const [tipoServicio, setTipoServicio] = useState('');
  const [acciones, setAcciones] = useState([]);
  const [accion, setAccion] = useState('');

  // Cargar acciones según el tipo de servicio
  useEffect(() => {
    if (!tipoServicio) {
      setAcciones([]);
      setLoadingAcciones(false);
      return;
    }

    let cancelado = false;

    const cargarAcciones = async () => {
      try {
        setLoadingAcciones(true);
        const response = await ReciboServices.getAccionesByServicio({
          tipo_servicio: tipoServicio,
        });

        if (!response.ok) {
          throw new Error(
            response.message || 'No se pudo obtener las acciones',
          );
        }

        if (!cancelado) {
          setAcciones(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (!cancelado) {
          setAcciones([]);
          toast.error(
            error instanceof Error
              ? error.message
              : 'Error al cargar las acciones',
          );
        }
      } finally {
        if (!cancelado) setLoadingAcciones(false);
      }
    };

    cargarAcciones();

    return () => {
      cancelado = true;
    };
  }, [tipoServicio]);

  // Cargar recibos de la acción seleccionada (o todos si value === 0)
  useEffect(() => {
    if (!hasSelection(accion)) {
      setFilas([]);
      setLoading(false);
      return;
    }

    let cancelado = false;

    const cargarRecibos = async () => {
      try {
        setLoading(true);
        const isTodos = String(accion) === '0';
        const response = isTodos
          ? await ReciboServices.getAll()
          : await ReciboServices.getRecibosByAccion({ id: accion });

        if (!response.ok) {
          throw new Error(response.message || 'No se pudo obtener los recibos');
        }

        if (!cancelado) {
          setFilas(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (!cancelado) {
          setFilas([]);
          toast.error(
            error instanceof Error
              ? error.message
              : 'Error al cargar los recibos',
          );
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    cargarRecibos();

    return () => {
      cancelado = true;
    };
  }, [accion]);

  const handleTipoServicioChange = (e) => {
    setTipoServicio(e.target.value || '');
    setAccion('');
    setAcciones([]);
    setFilas([]);
  };

  const handleAccionChange = (e) => {
    setAccion(e.target.value ?? '');
    setFilas([]);
  };

  const limpiarFiltros = () => {
    setTipoServicio('');
    setAccion('');
    setAcciones([]);
    setFilas([]);
  };

  const handleRecibo = useCallback((row) => {
    imprimirRecibo(row);
  }, []);

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
      },
      {
        accessorKey: 'codigo_interno',
        header: 'ACCIÓN',
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-700">
            {getValue() || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'fecha_emision',
        header: 'FECHA DE EMISIÓN',
      },
      {
        accessorKey: 'estado',
        header: 'ESTADO',
        cell: ({ row }) => {
          const activo = row.original.estado;
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                activo
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
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
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleRecibo(row.original)}
              title="Ver recibo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:scale-95"
            >
              <EyeIcon className="h-4 w-4" />
              Ver recibo
            </button>

            <button
              type="button"
              onClick={() =>
                toast.info('La anulación aún no está implementada')
              }
              title="Anular recibo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-all hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 active:scale-95"
            >
              <NoSymbolIcon className="h-4 w-4" />
              Anular
            </button>
          </div>
        ),
      },
    ],
    [handleRecibo],
  );

  return (
    <section className="mx-auto max-w-7xl space-y-6 pb-8">
      {/* ENCABEZADO */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-6 shadow-lg sm:p-8">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <DocumentTextIcon className="h-8 w-8 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Recibos por acción
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Consulta y visualiza los recibos emitidos filtrando por tipo de
              servicio y acción.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-12 -top-20 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl" />
      </header>

      {/* FILTROS */}
      <div className="relative z-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <FunnelIcon className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Filtros de búsqueda
              </h2>
              <p className="text-xs text-slate-500">
                Selecciona un servicio y una acción para consultar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <Select
            label="Tipo de servicio"
            placeholder="Seleccionar servicio..."
            value={tipoServicio}
            onChange={handleTipoServicioChange}
            options={[
              { value: 'AGUA', label: 'AGUA' },
              { value: 'ALCANTARILLADO', label: 'ALCANTARILLADO' },
            ]}
          />

          <div>
            <Select
              label="Acción"
              placeholder={
                loadingAcciones
                  ? 'Cargando acciones...'
                  : 'Seleccionar acción...'
              }
              value={accion}
              onChange={handleAccionChange}
              isDisabled={!tipoServicio || loadingAcciones}
              options={acciones}
            />

            {tipoServicio && loadingAcciones && (
              <p className="mt-1 text-xs text-blue-600">
                Obteniendo acciones disponibles...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="relative z-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5">
              <ClipboardDocumentListIcon className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Listado de recibos
              </h2>
              <p className="text-xs text-slate-500">
                {hasSelection(accion)
                  ? String(accion) === '0'
                    ? 'Mostrando todos los recibos'
                    : 'Recibos correspondientes a la acción seleccionada'
                  : 'Selecciona una acción para mostrar sus recibos'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <DataTableLocal columns={columns} data={filas} loading={loading} />
        </div>
      </div>
    </section>
  );
}
