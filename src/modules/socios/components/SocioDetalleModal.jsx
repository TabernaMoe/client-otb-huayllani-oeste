import { useEffect, useState } from 'react';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import FormModal from '../../../components/FormModal';
import StatusBadge from '../../../components/StatusBadge';
import { getApiErrorMessage } from '../../../services/error';
import { SocioServices } from '../services/socio.services';

const formatNombreCompleto = (socio) =>
  [socio.nombres, socio.primer_apellido, socio.segundo_apellido]
    .filter(Boolean)
    .join(' ');

export default function SocioDetalleModal({ open, socioId, onClose }) {
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !socioId) return;

    const load = async () => {
      try {
        setLoading(true);
        const response = await SocioServices.getDetalle(socioId);
        setSocio(response.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'No se pudo cargar el detalle'));
        onClose();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, socioId, onClose]);

  const acciones = Array.isArray(socio?.acciones) ? socio.acciones : [];

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Detalle del socio"
      description="Datos personales y acciones registradas."
    >
      {loading || !socio ? (
        <div className="p-10 text-center text-sm text-slate-500">
          Cargando detalle...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {formatNombreCompleto(socio)}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  CI {socio.ci_socio} {socio.ci_expedido}
                </p>
              </div>
              <StatusBadge value={Boolean(socio.estado)} />
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" /> {socio.numero_celular}
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" /> {socio.direccion}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Acciones</h3>
              <span className="text-sm text-slate-500">
                {acciones.length} registradas
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {acciones.map((accion) => (
                <div
                  key={accion.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        {accion.codigo_interno}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Medidor: {accion.nro_medidor || '—'}
                      </p>
                    </div>
                    <StatusBadge value={accion.estado} />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {accion.direccion}
                  </p>
                  {accion.observacion && (
                    <p className="mt-1 text-xs text-slate-400">
                      {accion.observacion}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {acciones.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                El socio no tiene acciones registradas.
              </div>
            )}
          </div>
        </div>
      )}
    </FormModal>
  );
}
