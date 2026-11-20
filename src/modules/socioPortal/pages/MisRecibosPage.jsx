import { useEffect, useMemo, useState } from 'react';

import { AuthService } from '../../auth/services/auth.services';
import AccionSelector from '../components/AccionSelector';
import PortalPageHeader from '../components/PortalPageHeader';
import PortalStatGrid from '../components/PortalStatGrid';
import ReciboCard from '../components/ReciboCard';
import ReciboDetalleModal from '../components/ReciboDetalleModal';
import {
  PortalEmpty,
  PortalError,
  PortalLoading,
} from '../components/PortalFeedback';
import { useSocioAcciones } from '../hooks/useSocioAcciones';
import { SocioPortalServices } from '../services/socioPortal.services';
import { formatCurrency } from '../../../utils/formatters';

const ORIGENES = ['TODOS', 'GENERAL', 'AGUA'];

export default function MisRecibosPage() {
  const user = AuthService.getUser();
  const socioName = user?.nombre || user?.nombre_usuario || 'Socio';

  const {
    acciones,
    accionSeleccionada,
    setAccionSeleccionada,
    accionActual,
    loadingAcciones,
    errorAcciones,
  } = useSocioAcciones();

  const [recibos, setRecibos] = useState([]);
  const [origenFiltro, setOrigenFiltro] = useState('TODOS');
  const [reciboActivo, setReciboActivo] = useState(null);
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
        const response = await SocioPortalServices.getRecibos(accionSeleccionada);
        setRecibos(response?.data ?? response ?? []);
      } catch (error) {
        setErrorRecibos(
          error.response?.data?.message || 'No se pudieron cargar los recibos',
        );
      } finally {
        setLoadingRecibos(false);
      }
    }

    cargarRecibos();
  }, [accionSeleccionada]);

  const recibosFiltrados = useMemo(() => {
    if (origenFiltro === 'TODOS') return recibos;
    return recibos.filter((r) => r.origen === origenFiltro);
  }, [recibos, origenFiltro]);

  const totalPagado = useMemo(
    () => recibosFiltrados.reduce((sum, r) => sum + Number(r.monto ?? 0), 0),
    [recibosFiltrados],
  );

  return (
    <section className="space-y-6">
      <PortalPageHeader
        title="Mis recibos"
        description="Consulta tus comprobantes de pago y genera una copia imprimible cuando la necesites."
        action={
          recibos.length > 0 && (
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
              {ORIGENES.map((origen) => (
                <button
                  key={origen}
                  type="button"
                  onClick={() => setOrigenFiltro(origen)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    origenFiltro === origen
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {origen}
                </button>
              ))}
            </div>
          )
        }
      />

      <PortalError message={errorAcciones || errorRecibos} />

      <AccionSelector
        acciones={acciones}
        value={accionSeleccionada}
        onChange={setAccionSeleccionada}
        loading={loadingAcciones}
      />

      {accionActual && (
        <PortalStatGrid
          items={[
            {
              label: 'Acción seleccionada',
              value: `#${accionActual.codigo_interno}`,
              helper: accionActual.tipo,
            },
            {
              label: 'Comprobantes',
              value: recibosFiltrados.length,
              valueClass: 'text-violet-700',
            },
            {
              label: 'Total pagado',
              value: formatCurrency(totalPagado),
              valueClass: 'text-emerald-700',
            },
          ]}
        />
      )}

      {loadingRecibos ? (
        <PortalLoading text="Cargando recibos..." />
      ) : !accionSeleccionada ? (
        <PortalEmpty
          title="Selecciona una acción"
          description="Elige una acción para consultar sus recibos."
        />
      ) : recibosFiltrados.length === 0 ? (
        <PortalEmpty
          title="Sin recibos registrados"
          description="No se encontraron comprobantes para el filtro actual."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recibosFiltrados.map((recibo) => (
            <ReciboCard
              key={`${recibo.origen}-${recibo.id}`}
              recibo={recibo}
              onSelect={setReciboActivo}
            />
          ))}
        </div>
      )}

      <ReciboDetalleModal
        recibo={reciboActivo}
        socioName={socioName}
        onClose={() => setReciboActivo(null)}
      />
    </section>
  );
}
