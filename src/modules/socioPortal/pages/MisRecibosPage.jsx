import { useEffect, useState } from 'react';

import AccionSelector from '../components/AccionSelector';
import ReciboCard from '../components/ReciboCard';
import {
  PortalEmpty,
  PortalError,
  PortalLoading,
} from '../components/PortalFeedback';
import { useSocioAcciones } from '../hooks/useSocioAcciones';
import { SocioPortalServices } from '../services/socioPortal.services';

export default function MisRecibosPage() {
  const {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
    errorAcciones,
  } = useSocioAcciones();

  const [recibos, setRecibos] = useState([]);
  const [loadingRecibos, setLoadingRecibos] = useState(false);
  const [errorRecibos, setErrorRecibos] = useState('');

  useEffect(() => {
    if (!accionSeleccionada) {
      setRecibos([]);
      return;
    }

    async function cargarRecibos() {
      try {
        setLoadingRecibos(true);
        setErrorRecibos('');

        const response = await SocioPortalServices.getRecibos(
          accionSeleccionada,
        );

        setRecibos(response?.data ?? response ?? []);
      } catch (error) {
        setErrorRecibos(
          error.response?.data?.message ||
            'No se pudieron cargar los recibos',
        );
      } finally {
        setLoadingRecibos(false);
      }
    }

    cargarRecibos();
  }, [accionSeleccionada]);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Mis recibos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona una acción para consultar sus recibos.
        </p>
      </div>

      <PortalError message={errorAcciones || errorRecibos} />

      <AccionSelector
        acciones={acciones}
        value={accionSeleccionada}
        onChange={setAccionSeleccionada}
        loading={loadingAcciones}
      />

      {accionActual && (
        <div className="rounded-3xl border border-violet-100 bg-violet-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
            Acción seleccionada
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-lg font-black text-slate-900">
              #{accionActual.codigo_interno}
            </span>
            <span className="text-sm font-semibold text-slate-600">
              {accionActual.tipo}
            </span>
            <span className="text-sm text-slate-500">
              Medidor: {accionActual.nro_medidor || 'Sin medidor'}
            </span>
          </div>
        </div>
      )}

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-900">
            Recibos de la acción
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Historial de pagos de la acción seleccionada.
          </p>
        </div>

        {loadingRecibos ? (
          <PortalLoading text="Cargando recibos..." />
        ) : !accionSeleccionada ? (
          <PortalEmpty
            title="Selecciona una acción"
            description="Elige una acción para consultar sus recibos."
          />
        ) : recibos.length === 0 ? (
          <PortalEmpty
            title="Sin recibos"
            description="La acción seleccionada todavía no tiene recibos."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recibos.map((recibo) => (
              <ReciboCard
                key={`${recibo.origen}-${recibo.id}`}
                recibo={recibo}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
