import { useEffect, useState } from 'react';
import { MapPinIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { SocioServices } from '../services/socio.services';

const nombreCompleto = (socio) => [socio.nombres, socio.primer_apellido, socio.segundo_apellido].filter(Boolean).join(' ');

export default function SocioDetalleModal({ open, socioId, onClose }) {
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);
        const response = await SocioServices.getDetalle(socioId);
        setSocio(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'No se pudo cargar el detalle');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, socioId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Detalle del socio</h2>
            <p className="text-sm text-slate-500">Datos personales y acciones registradas.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {loading || !socio ? (
          <div className="p-10 text-center text-sm text-slate-500">Cargando detalle...</div>
        ) : (
          <div className="space-y-6 p-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{nombreCompleto(socio)}</h3>
                  <p className="mt-1 text-sm text-slate-500">CI {socio.ci_socio} {socio.ci_expedido}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${socio.estado ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {socio.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="flex items-center gap-2"><PhoneIcon className="h-4 w-4" /> {socio.numero_celular}</div>
                <div className="flex items-center gap-2"><MapPinIcon className="h-4 w-4" /> {socio.direccion}</div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Acciones</h3>
                <span className="text-sm text-slate-500">{socio.acciones.length} registradas</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {socio.acciones.map((accion) => (
                  <div key={accion.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{accion.codigo_interno}</p>
                        <p className="mt-1 text-sm text-slate-500">Medidor: {accion.nro_medidor}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${accion.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {accion.estado}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{accion.direccion}</p>
                    <p className="mt-1 text-xs text-slate-400">{accion.observacion}</p>
                  </div>
                ))}
              </div>

              {socio.acciones.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">El socio no tiene acciones registradas.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
