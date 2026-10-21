import { useEffect, useState } from 'react';

import AccionSelector from '../components/AccionSelector';
import LecturaCard from '../components/LecturaCard';
import {
  PortalEmpty,
  PortalError,
  PortalLoading,
} from '../components/PortalFeedback';
import { useSocioAcciones } from '../hooks/useSocioAcciones';
import { SocioPortalServices } from '../services/socioPortal.services';

export default function MisLecturasPage() {
  const {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
    errorAcciones,
  } = useSocioAcciones();

  const [lecturas, setLecturas] = useState([]);
  const [loadingLecturas, setLoadingLecturas] = useState(false);
  const [errorLecturas, setErrorLecturas] = useState('');

  useEffect(() => {
    if (!accionSeleccionada) {
      setLecturas([]);
      return;
    }

    async function cargarLecturas() {
      try {
        setLoadingLecturas(true);
        setErrorLecturas('');

        const response = await SocioPortalServices.getLecturas(
          accionSeleccionada,
        );

        setLecturas(response?.data ?? response ?? []);
      } catch (error) {
        setErrorLecturas(
          error.response?.data?.message ||
            'No se pudieron cargar las lecturas',
        );
      } finally {
        setLoadingLecturas(false);
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
          Selecciona una acción para consultar su historial de consumo de agua.
        </p>
      </div>

      <PortalError message={errorAcciones || errorLecturas} />

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Selecciona una acción
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Las lecturas se mostrarán únicamente para la acción seleccionada.
          </p>
        </div>

        <AccionSelector
          acciones={acciones}
          value={accionSeleccionada}
          onChange={setAccionSeleccionada}
          loading={loadingAcciones}
        />
      </div>

      {accionActual && (
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
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
            Historial de lecturas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Consumo, lectura anterior, lectura actual y monto por periodo.
          </p>
        </div>

        {loadingLecturas ? (
          <PortalLoading text="Cargando lecturas..." />
        ) : !accionSeleccionada ? (
          <PortalEmpty
            title="Selecciona una acción"
            description="Elige una acción para ver sus lecturas."
          />
        ) : lecturas.length === 0 ? (
          <PortalEmpty
            title="Sin lecturas registradas"
            description="La acción seleccionada todavía no tiene lecturas."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {lecturas.map((lectura) => (
              <LecturaCard
                key={lectura.id}
                lectura={lectura}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
