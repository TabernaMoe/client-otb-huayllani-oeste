import { useEffect, useState } from 'react';

import {
  BanknotesIcon,
  BoltIcon,
  CheckCircleIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/solid';

import { AuthService } from '../../auth/services/auth.services';
import { SocioPortalServices } from '../services/socioPortal.services';

import DashboardStatCard from '../../../components/DashboardStatCard';

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
      .then((response) => {
        setData(response?.data ?? response ?? initial);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            'No se pudo cargar el resumen'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-linear-to-br from-emerald-600 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm font-semibold text-emerald-100">
          Portal del socio
        </p>

        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          Bienvenido, {user?.nombre || user?.nombre_usuario}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
          Consulta tus acciones, lecturas, cobros y recibos desde un solo lugar.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-900">
            Resumen de tu cuenta
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Información principal asociada a tu cuenta.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            title="Acciones activas"
            value={
              loading
                ? '...'
                : data.acciones_activas ?? 0
            }
            icon={CheckCircleIcon}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <DashboardStatCard
            title="Deuda pendiente"
            value={
              loading
                ? '...'
                : `Bs ${Number(
                    data.deuda_pendiente ?? 0
                  ).toFixed(2)}`
            }
            icon={BanknotesIcon}
            iconClass="bg-amber-50 text-amber-700"
            valueClass={
              Number(data.deuda_pendiente ?? 0) > 0
                ? 'text-amber-700'
                : 'text-emerald-700'
            }
          />

          <DashboardStatCard
            title="Última lectura"
            value={
              loading
                ? '...'
                : data.ultima_lectura ?? 'Sin registro'
            }
            icon={BoltIcon}
            iconClass="bg-cyan-50 text-cyan-700"
          />

          <DashboardStatCard
            title="Último pago"
            value={
              loading
                ? '...'
                : data.ultimo_pago ?? 'Sin registro'
            }
            icon={ReceiptPercentIcon}
            iconClass="bg-violet-50 text-violet-700"
          />
        </div>
      </div>
    </section>
  );
}