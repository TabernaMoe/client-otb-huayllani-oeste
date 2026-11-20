import { useEffect, useMemo, useState } from 'react';

import AccionSelector from '../components/AccionSelector';
import LecturaCard from '../components/LecturaCard';
import PortalPageHeader from '../components/PortalPageHeader';
import PortalStatGrid from '../components/PortalStatGrid';
import {
  PortalEmpty,
  PortalError,
  PortalLoading,
} from '../components/PortalFeedback';
import { useSocioAcciones } from '../hooks/useSocioAcciones';
import { SocioPortalServices } from '../services/socioPortal.services';
import { formatCurrency } from '../../../utils/formatters';

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
  const [loading, setLoading] = useState(false);
  const [errorLecturas, setErrorLecturas] = useState('');

  useEffect(() => {
    if (!accionSeleccionada) {
      setLecturas([]);
      return;
    }

    async function cargarLecturas() {
      try {
        setLoading(true);
        setErrorLecturas('');
        const response = await SocioPortalServices.getLecturas(accionSeleccionada);
        setLecturas(response?.data ?? response ?? []);
      } catch (err) {
        setErrorLecturas(
          err.response?.data?.message || 'No se pudieron cargar las lecturas',
        );
      } finally {
        setLoading(false);
      }
    }

    cargarLecturas();
  }, [accionSeleccionada]);

  const stats = useMemo(() => {
    const consumoTotal = lecturas.reduce(
      (sum, item) => sum + Number(item.consumo_m3 ?? 0),
      0,
    );
    const promedio = lecturas.length ? (consumoTotal / lecturas.length).toFixed(1) : 0;
    const totalFacturado = lecturas.reduce(
      (sum, item) => sum + Number(item.monto ?? 0),
      0,
    );
    return { consumoTotal, promedio, totalFacturado };
  }, [lecturas]);

  return (
    <section className="space-y-6">
      <PortalPageHeader
        title="Mis lecturas"
        description="Selecciona una acción para consultar el historial mensual de consumo."
      />

      <PortalError message={errorAcciones || errorLecturas} />

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
              helper: `Medidor: ${accionActual.nro_medidor || 'Sin medidor'}`,
            },
            {
              label: 'Consumo promedio',
              value: `${stats.promedio} m³`,
              valueClass: 'text-cyan-700',
              helper: `Acumulado: ${stats.consumoTotal} m³`,
            },
            {
              label: 'Total facturado',
              value: formatCurrency(stats.totalFacturado),
              valueClass: 'text-emerald-700',
              helper: `${lecturas.length} lecturas registradas`,
            },
          ]}
        />
      )}

      {loading ? (
        <PortalLoading text="Cargando lecturas..." />
      ) : !accionSeleccionada ? (
        <PortalEmpty
          title="Selecciona una acción"
          description="Elige una acción para ver sus lecturas de medidor."
        />
      ) : lecturas.length === 0 ? (
        <PortalEmpty
          title="Sin lecturas registradas"
          description="Todavía no existen lecturas para la acción seleccionada."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {lecturas.map((lectura) => (
            <LecturaCard key={lectura.id} lectura={lectura} />
          ))}
        </div>
      )}
    </section>
  );
}
