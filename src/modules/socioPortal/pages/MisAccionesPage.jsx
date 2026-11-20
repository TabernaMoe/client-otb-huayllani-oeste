import { useEffect, useMemo, useState } from 'react';

import { SocioPortalServices } from '../services/socioPortal.services';
import AccionCard from '../../../components/AccionCard';
import PortalPageHeader from '../components/PortalPageHeader';
import PortalStatGrid from '../components/PortalStatGrid';
import {
  PortalEmpty,
  PortalError,
  PortalLoading,
} from '../components/PortalFeedback';

const ESTADOS = ['TODAS', 'ACTIVO', 'PASIVO'];

export default function MisAccionesPage() {
  const [acciones, setAcciones] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('TODAS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarAcciones() {
      try {
        setLoading(true);
        setError('');
        const response = await SocioPortalServices.getAcciones();
        setAcciones(response?.data ?? response ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message || 'No se pudieron cargar tus acciones',
        );
      } finally {
        setLoading(false);
      }
    }

    cargarAcciones();
  }, []);

  const accionesFiltradas = useMemo(() => {
    if (estadoFiltro === 'TODAS') return acciones;
    return acciones.filter((a) => a.estado === estadoFiltro);
  }, [acciones, estadoFiltro]);

  const activas = acciones.filter((a) => a.estado === 'ACTIVO').length;
  const pasivas = acciones.filter((a) => a.estado === 'PASIVO').length;

  return (
    <section className="space-y-6">
      <PortalPageHeader
        title="Mis acciones"
        description="Consulta el estado, medidor, calle y tarifa de tus acciones registradas."
        action={
          acciones.length > 0 && (
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
              {ESTADOS.map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => setEstadoFiltro(estado)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    estadoFiltro === estado
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          )
        }
      />

      <PortalError message={error} />

      {!loading && acciones.length > 0 && (
        <PortalStatGrid
          items={[
            { label: 'Total de acciones', value: acciones.length },
            { label: 'Activas', value: activas, valueClass: 'text-emerald-700' },
            { label: 'Pasivas', value: pasivas, valueClass: 'text-amber-700' },
          ]}
        />
      )}

      {loading ? (
        <PortalLoading text="Cargando tus acciones..." />
      ) : accionesFiltradas.length === 0 ? (
        <PortalEmpty
          title="No se encontraron acciones"
          description={
            estadoFiltro === 'TODAS'
              ? 'Las acciones asociadas a tu cuenta aparecerán aquí.'
              : `No tienes acciones en estado ${estadoFiltro}.`
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {accionesFiltradas.map((accion) => (
            <AccionCard key={accion.id} accion={accion} />
          ))}
        </div>
      )}
    </section>
  );
}
