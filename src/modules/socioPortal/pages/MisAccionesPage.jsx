import { useEffect, useState } from 'react';

import { SocioPortalServices } from '../services/socioPortal.services';
import AccionCard from '../../../components/AccionCard';

export default function MisAccionesPage() {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarAcciones() {
      try {
        setLoading(true);
        setError('');

        const response =
          await SocioPortalServices.getAcciones();

        console.log('ACCIONES:', response);

        setAcciones(
          response?.data ?? response ?? []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            'No se pudieron cargar las acciones'
        );
      } finally {
        setLoading(false);
      }
    }

    cargarAcciones();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Mis acciones
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Acciones asociadas a tu cuenta.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
            Cargando acciones...
          </div>
        </div>
      ) : acciones.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-700">
            No tienes acciones registradas
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Las acciones asociadas a tu cuenta aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {acciones.map((accion) => (
            <AccionCard
              key={accion.id}
              accion={accion}
            />
          ))}
        </div>
      )}
    </section>
  );
}