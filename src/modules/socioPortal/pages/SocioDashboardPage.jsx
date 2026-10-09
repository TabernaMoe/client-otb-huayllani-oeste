import { useEffect, useState } from 'react';
import { AuthService } from '../../auth/services/auth.services';
import { SocioPortalServices } from '../services/socioPortal.services';

const initial = {
  acciones_activas: 0,
  deuda_pendiente: 0,
  ultima_lectura: null,
  ultimo_pago: null,
};

export default function SocioDashboardPage() {
  const user = AuthService.getUser();
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    SocioPortalServices.getResumen()
      .then((response) => setData(response?.data ?? response ?? initial))
      .catch((err) => setError(err.response?.data?.message || 'No se pudo cargar el resumen'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-linear-to-br from-emerald-600 to-cyan-700 p-6 text-white shadow-lg">
        <p className="text-sm font-semibold text-emerald-100">Portal del socio</p>
        <h1 className="mt-2 text-3xl font-black">Bienvenido, {user?.nombre || user?.nombre_usuario}</h1>
        <p className="mt-2 text-sm text-emerald-50">Consulta tus acciones, lecturas, cobros y recibos desde un solo lugar.</p>
      </div>

      {error && <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Acciones activas" value={loading ? '...' : data.acciones_activas ?? 0} />
        <Card title="Deuda pendiente" value={loading ? '...' : `Bs ${Number(data.deuda_pendiente ?? 0).toFixed(2)}`} />
        <Card title="Última lectura" value={loading ? '...' : data.ultima_lectura ?? 'Sin registro'} />
        <Card title="Último pago" value={loading ? '...' : data.ultimo_pago ?? 'Sin registro'} />
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </article>
  );
}
