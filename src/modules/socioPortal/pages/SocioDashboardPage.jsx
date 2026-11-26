import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BanknotesIcon,
  BoltIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/solid';

import { useAuth } from '../../auth/context/AuthContext';
import { SocioPortalServices } from '../services/socioPortal.services';
import DashboardStatCard from '../../../components/DashboardStatCard';
import { PortalError } from '../components/PortalFeedback';
import { getApiErrorMessage } from '../../../services/error';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const initialResumen = {
  acciones_activas: 0,
  total_acciones: 0,
  deuda_pendiente: 0,
  cobros_pendientes_count: 0,
  recibos_count: 0,
  ultima_lectura: null,
  ultimo_pago: null,
  proximos_cobros: [],
};

const quickLinks = [
  {
    title: 'Mis acciones',
    description: 'Consulta tus medidores, tarifas y detalles.',
    to: '/socio/acciones',
    icon: ClipboardDocumentListIcon,
    color: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Mis lecturas',
    description: 'Revisa tu historial de consumo en m³.',
    to: '/socio/lecturas',
    icon: DocumentTextIcon,
    color: 'bg-cyan-50 text-cyan-700',
  },
  {
    title: 'Mis cobros',
    description: 'Revisa cobros pendientes, parciales y pagados.',
    to: '/socio/cobros',
    icon: BanknotesIcon,
    color: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Mis recibos',
    description: 'Descarga o imprime tus comprobantes de pago.',
    to: '/socio/recibos',
    icon: ReceiptPercentIcon,
    color: 'bg-violet-50 text-violet-700',
  },
];

export default function SocioDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(initialResumen);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    SocioPortalServices.getResumen()
      .then((response) => {
        const merged = { ...initialResumen, ...(response?.data ?? response) };
        setData({
          ...merged,
          proximos_cobros: Array.isArray(merged.proximos_cobros)
            ? merged.proximos_cobros
            : [],
        });
      })
      .catch((err) =>
        setError(getApiErrorMessage(err, 'No se pudo cargar el resumen')),
      )
      .finally(() => setLoading(false));
  }, []);

  const deuda = Number(data.deuda_pendiente ?? 0);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
          OTB Huayllani Oeste — Portal del Socio
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-4xl">
          Bienvenido, {user?.nombre || user?.nombre_usuario}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">
          Consulta el estado de tus acciones, lecturas de agua, cobros pendientes y
          comprobantes de pago en tiempo real.
        </p>
      </div>

      <PortalError message={error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Acciones activas"
          value={loading ? '...' : `${data.acciones_activas} / ${data.total_acciones || data.acciones_activas}`}
          icon={CheckCircleIcon}
          iconClass="bg-emerald-50 text-emerald-700"
        />
        <DashboardStatCard
          title="Deuda pendiente"
          value={loading ? '...' : formatCurrency(deuda)}
          icon={BanknotesIcon}
          iconClass={deuda > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}
          valueClass={deuda > 0 ? 'text-rose-700' : 'text-emerald-700'}
        />
        <DashboardStatCard
          title="Última lectura"
          value={loading ? '...' : data.ultima_lectura ?? 'Sin registro'}
          icon={BoltIcon}
          iconClass="bg-cyan-50 text-cyan-700"
        />
        <DashboardStatCard
          title="Último pago"
          value={loading ? '...' : data.ultimo_pago ?? 'Sin registro'}
          icon={ReceiptPercentIcon}
          iconClass="bg-violet-50 text-violet-700"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              Cobros pendientes recientes
            </h2>
            <Link
              to="/socio/cobros"
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              Ver todos <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <p className="p-6 text-sm text-slate-500">Cargando cobros...</p>
            ) : data.proximos_cobros.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-bold text-emerald-700">¡Estás al día!</p>
                <p className="mt-1 text-sm text-slate-500">
                  No tienes cobros pendientes en este momento.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {data.proximos_cobros.map((cobro) => (
                  <li
                    key={`${cobro.origen}-${cobro.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">{cobro.concepto}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(cobro.fecha_emision)} · {cobro.origen}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-rose-700">
                        {formatCurrency(cobro.saldo ?? cobro.monto)}
                      </p>
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                        {cobro.estado}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900">Accesos rápidos</h2>
          <div className="grid gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className={`rounded-xl p-2.5 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 group-hover:text-emerald-700">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
