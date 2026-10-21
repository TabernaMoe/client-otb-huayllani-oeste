import {
  useEffect,
  useState,
} from 'react';

import AccionSelector
  from '../../../components/AccionSelector';

import ReciboCard
  from '../../../components/ReciboCard';

import {
  useSocioAcciones,
} from '../hooks/useSocioAcciones';

import {
  SocioPortalServices,
} from '../services/socioPortal.services';

export default function MisRecibosPage() {
  const {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
  } = useSocioAcciones();

  const [
    recibos,
    setRecibos,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    if (!accionSeleccionada) {
      setRecibos([]);
      return;
    }

    async function cargarRecibos() {
      try {
        setLoading(true);

        const response =
          await SocioPortalServices
            .getRecibos(
              accionSeleccionada,
            );

        setRecibos(
          response?.data ??
          response ??
          [],
        );
      } finally {
        setLoading(false);
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

      <AccionSelector
        acciones={acciones}
        value={
          accionSeleccionada
        }
        onChange={
          setAccionSeleccionada
        }
        loading={
          loadingAcciones
        }
      />

      {accionActual && (
        <div className="rounded-3xl bg-violet-50 p-5">
          Recibos de la acción
          {' '}
          <strong>
            #{accionActual.codigo_interno}
          </strong>
        </div>
      )}

      {loading ? (
        <p>Cargando recibos...</p>
      ) : recibos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          No hay recibos para esta acción
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recibos.map(
            (recibo) => (
              <ReciboCard
                key={`${recibo.origen}-${recibo.id}`}
                recibo={recibo}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}