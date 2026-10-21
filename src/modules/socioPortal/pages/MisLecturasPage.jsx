import {
  useEffect,
  useState,
} from 'react';

import AccionSelector
  from '../components/AccionSelector';

import LecturaCard
  from '../components/LecturaCard';

import {
  useSocioAcciones,
} from '../hooks/useSocioAcciones';

import {
  SocioPortalServices,
} from '../services/socioPortal.services';

export default function MisLecturasPage() {
  const {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
  } = useSocioAcciones();

  const [
    lecturas,
    setLecturas,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
    if (!accionSeleccionada) {
      setLecturas([]);
      return;
    }

    async function cargarLecturas() {
      try {
        setLoading(true);

        const response =
          await SocioPortalServices
            .getLecturas(
              accionSeleccionada,
            );

        setLecturas(
          response?.data ??
          response ??
          [],
        );
      } finally {
        setLoading(false);
      }
    }

    cargarLecturas();
  }, [accionSeleccionada]);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Mis lecturas
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Selecciona una acción para ver sus lecturas.
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
        <div className="rounded-3xl bg-emerald-50 p-5">
          Acción seleccionada:
          {' '}
          <strong>
            #{accionActual.codigo_interno}
          </strong>
        </div>
      )}

      {loading ? (
        <p>Cargando lecturas...</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {lecturas.map(
            (lectura) => (
              <LecturaCard
                key={lectura.id}
                lectura={lectura}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}