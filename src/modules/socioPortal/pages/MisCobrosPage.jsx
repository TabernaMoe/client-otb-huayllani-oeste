import { useEffect, useMemo, useState } from 'react';

import AccionSelector from '../components/AccionSelector';
import CobroCard from '../components/CobroCard';
import PortalPageHeader from '../components/PortalPageHeader';
import PortalStatGrid from '../components/PortalStatGrid';
import {
  PortalEmpty,
  PortalError,
  PortalLoading,
} from '../components/PortalFeedback';
import { useSocioAcciones } from '../hooks/useSocioAcciones';
import { SocioPortalServices } from '../services/socioPortal.services';
import { getApiErrorMessage } from '../../../services/error';
import { formatCurrency } from '../../../utils/formatters';

const ESTADOS = ['TODOS', 'PENDIENTE', 'PARCIAL', 'PAGADO'];

export default function MisCobrosPage() {
  const {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
    errorAcciones,
  } = useSocioAcciones();

  const [cobros, setCobros] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [loadingCobros, setLoadingCobros] = useState(false);
  const [errorCobros, setErrorCobros] = useState('');

  useEffect(() => {
    if (!accionSeleccionada) {
      setCobros([]);
      return;
    }

    async function cargarCobros() {
      try {
        setLoadingCobros(true);
        setErrorCobros('');
        const response = await SocioPortalServices.getCobros(accionSeleccionada);
        const raw = response?.data ?? response;
        setCobros(Array.isArray(raw) ? raw : []);
      } catch (error) {
        setErrorCobros(
          getApiErrorMessage(error, 'No se pudieron cargar los cobros'),
        );
      } finally {
        setLoadingCobros(false);
      }
    }

    cargarCobros();
  }, [accionSeleccionada]);

  const resumen = useMemo(
    () =>
      cobros.reduce(
        (acc, cobro) => {
          const saldo = Number(cobro.saldo ?? cobro.monto ?? 0);
          if (['PENDIENTE', 'PARCIAL'].includes(cobro.estado)) {
            acc.pendiente += saldo;
            acc.pendientesCount += 1;
          }
          if (cobro.estado === 'PAGADO') acc.pagados += 1;
          return acc;
        },
        { pendiente: 0, pendientesCount: 0, pagados: 0 },
      ),
    [cobros],
  );

  const cobrosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    return cobros.filter((cobro) => {
      if (estadoFiltro !== 'TODOS' && cobro.estado !== estadoFiltro) return false;
      if (!term) return true;
      return (
        cobro.concepto?.toLowerCase().includes(term) ||
        cobro.descripcion?.toLowerCase().includes(term)
      );
    });
  }, [cobros, estadoFiltro, busqueda]);

  return (
    <section className="space-y-6">
      <PortalPageHeader
        title="Mis cobros"
        description="Consulta tus deudas pendientes, pagos parciales y cobros cancelados por acción."
      />

      <PortalError message={errorAcciones || errorCobros} />

      <AccionSelector
        acciones={acciones}
        value={accionSeleccionada}
        onChange={setAccionSeleccionada}
        loading={loadingAcciones}
      />

      {accionActual && (
        <PortalStatGrid
          items={[
            { label: 'Acción', value: `#${accionActual.codigo_interno}` },
            {
              label: 'Saldo pendiente',
              value: formatCurrency(resumen.pendiente),
              valueClass: resumen.pendiente > 0 ? 'text-rose-700' : 'text-emerald-700',
              helper: `${resumen.pendientesCount} cobros pendientes`,
            },
            {
              label: 'Cobros pagados',
              value: resumen.pagados,
              valueClass: 'text-emerald-700',
            },
          ]}
        />
      )}

      {cobros.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {ESTADOS.map((estado) => (
              <button
                key={estado}
                type="button"
                onClick={() => setEstadoFiltro(estado)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  estadoFiltro === estado
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {estado}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar concepto..."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-emerald-600 focus:outline-none sm:w-64"
          />
        </div>
      )}

      {loadingCobros ? (
        <PortalLoading text="Cargando cobros..." />
      ) : !accionSeleccionada ? (
        <PortalEmpty
          title="Selecciona una acción"
          description="Elige una acción para ver sus cobros."
        />
      ) : cobrosFiltrados.length === 0 ? (
        <PortalEmpty
          title="Sin cobros para mostrar"
          description="No existen cobros que coincidan con el filtro seleccionado."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cobrosFiltrados.map((cobro) => (
            <CobroCard key={`${cobro.origen}-${cobro.id}`} cobro={cobro} />
          ))}
        </div>
      )}
    </section>
  );
}
