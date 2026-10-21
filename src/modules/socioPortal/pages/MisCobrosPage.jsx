import { useEffect, useMemo, useState } from 'react';

import AccionSelector from '../components/AccionSelector';
import CobroCard from '../components/CobroCard';
import {
  PortalEmpty,
  PortalError,
  PortalLoading,
} from '../components/PortalFeedback';
import { useSocioAcciones } from '../hooks/useSocioAcciones';
import { SocioPortalServices } from '../services/socioPortal.services';

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

        const response = await SocioPortalServices.getCobros(
          accionSeleccionada,
        );

        setCobros(response?.data ?? response ?? []);
      } catch (error) {
        setErrorCobros(
          error.response?.data?.message ||
            'No se pudieron cargar los cobros',
        );
      } finally {
        setLoadingCobros(false);
      }
    }

    cargarCobros();
  }, [accionSeleccionada]);

  const resumen = useMemo(() => {
    return cobros.reduce(
      (acc, cobro) => {
        const monto = Number(cobro.monto ?? cobro.saldo ?? 0);

        acc.total += monto;

        if (['PENDIENTE', 'PARCIAL'].includes(cobro.estado)) {
          acc.pendiente += monto;
        }

        if (cobro.estado === 'PAGADO') {
          acc.pagados += 1;
        }

        return acc;
      },
      {
        total: 0,
        pendiente: 0,
        pagados: 0,
      },
    );
  }, [cobros]);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Mis cobros
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona una acción para consultar sus cobros y deudas.
        </p>
      </div>

      <PortalError message={errorAcciones || errorCobros} />

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Selecciona una acción
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Los cobros se filtrarán por la acción seleccionada.
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
        <div className="grid gap-3 sm:grid-cols-3">
          <ResumenCard
            label="Acción"
            value={`#${accionActual.codigo_interno}`}
          />
          <ResumenCard
            label="Pendiente"
            value={`Bs ${resumen.pendiente.toFixed(2)}`}
          />
          <ResumenCard
            label="Cobros pagados"
            value={resumen.pagados}
          />
        </div>
      )}

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-900">
            Cobros de la acción
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Estado, fecha, saldo y detalle de cada cobro.
          </p>
        </div>

        {loadingCobros ? (
          <PortalLoading text="Cargando cobros..." />
        ) : !accionSeleccionada ? (
          <PortalEmpty
            title="Selecciona una acción"
            description="Elige una acción para ver sus cobros."
          />
        ) : cobros.length === 0 ? (
          <PortalEmpty
            title="Sin cobros registrados"
            description="La acción seleccionada no tiene cobros disponibles."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cobros.map((cobro) => (
              <CobroCard
                key={`${cobro.origen}-${cobro.id}`}
                cobro={cobro}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ResumenCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-slate-900">
        {value}
      </p>
    </article>
  );
}
