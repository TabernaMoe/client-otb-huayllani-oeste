import { useMemo } from 'react';
import {
  BeakerIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BellIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ChevronRightIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';

import { AuthService } from '../../auth/services/auth.services';

const debts = [
  {
    id: 1,
    concepto: 'Servicio de agua',
    periodo: 'Mayo 2026',
    vencimiento: '30/05/2026',
    monto: 38.5,
    estado: 'Pendiente',
  },
  {
    id: 2,
    concepto: 'Mantenimiento red principal',
    periodo: 'Cuota comunitaria',
    vencimiento: '15/06/2026',
    monto: 20,
    estado: 'Pendiente',
  },
];

const receipts = [
  {
    id: 1,
    periodo: 'Abril 2026',
    fecha: '03/05/2026',
    monto: 35,
    estado: 'Pagado',
  },
  {
    id: 2,
    periodo: 'Marzo 2026',
    fecha: '02/04/2026',
    monto: 34.5,
    estado: 'Pagado',
  },
  {
    id: 3,
    periodo: 'Febrero 2026',
    fecha: '01/03/2026',
    monto: 36,
    estado: 'Pagado',
  },
];

const consumption = [
  { mes: 'Ene', m3: 11 },
  { mes: 'Feb', m3: 12 },
  { mes: 'Mar', m3: 10 },
  { mes: 'Abr', m3: 13 },
  { mes: 'May', m3: 14 },
];

const notices = [
  {
    title: 'Corte programado',
    description: 'El domingo habrá mantenimiento de 08:00 a 12:00.',
    type: 'warning',
  },
  {
    title: 'Pago recibido',
    description: 'Tu pago de abril fue registrado correctamente.',
    type: 'success',
  },
];

function formatMoney(value) {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(value);
}

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-black text-slate-900">{value}</h3>
          <p className="mt-1 text-sm text-slate-500">{helper}</p>
        </div>

        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}

function ConsumptionChart() {
  const max = Math.max(...consumption.map((item) => item.m3));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Consumo de agua
          </h2>
          <p className="text-sm text-slate-500">Últimos 5 meses en m³</p>
        </div>

        <button
          type="button"
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Ver detalle
        </button>
      </div>

      <div className="mt-6 flex h-56 items-end gap-4">
        {consumption.map((item) => (
          <div
            key={item.mes}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-44 w-full items-end rounded-2xl bg-slate-100 p-1">
              <div
                className="w-full rounded-xl bg-cyan-500"
                style={{ height: `${(item.m3 / max) * 100}%` }}
              />
            </div>

            <span className="text-xs font-bold text-slate-500">
              {item.mes}
            </span>
            <span className="text-xs text-slate-400">{item.m3} m³</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DebtCard({ debt }) {
  return (
    <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-amber-600" />
            <h3 className="font-black text-slate-900">{debt.concepto}</h3>
          </div>

          <p className="mt-1 text-sm text-slate-600">{debt.periodo}</p>

          <p className="mt-1 text-xs font-semibold text-amber-700">
            Vence: {debt.vencimiento}
          </p>
        </div>

        <p className="text-xl font-black text-slate-900">
          {formatMoney(debt.monto)}
        </p>
      </div>
    </article>
  );
}

function ReceiptRow({ receipt }) {
  return (
    <div className="grid grid-cols-12 items-center gap-3 border-b border-slate-100 py-4 last:border-0">
      <div className="col-span-5">
        <p className="font-bold text-slate-800">{receipt.periodo}</p>
        <p className="text-sm text-slate-500">{receipt.fecha}</p>
      </div>

      <div className="col-span-3 text-sm font-semibold text-slate-700">
        {formatMoney(receipt.monto)}
      </div>

      <div className="col-span-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
          {receipt.estado}
        </span>
      </div>

      <div className="col-span-2 flex justify-end gap-2">
        <button
          type="button"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <EyeIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function ClienteDashboardPage() {
  const user = AuthService.getUser();

  const displayName =
    user?.nombre_usuario ||
    user?.nombre ||
    user?.name ||
    'Usuario';

  const totalDebt = useMemo(
    () => debts.reduce((sum, item) => sum + item.monto, 0),
    [],
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <div>
            <p className="font-semibold text-cyan-100">
              Cuenta de agua · Acción #A-024
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Hola {displayName}, tienes {formatMoney(totalDebt)} pendiente
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50 sm:text-base">
              Revisa tu consumo, paga tus cuotas pendientes y descarga tus
              recibos desde un solo lugar.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-cyan-700 shadow-sm hover:bg-cyan-50"
              >
                Pagar ahora
              </button>

              <button
                type="button"
                className="rounded-2xl border border-white/40 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
              >
                Ver estado de cuenta
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <WalletIcon className="h-7 w-7" />
              <div>
                <p className="text-sm text-cyan-100">
                  Próximo vencimiento
                </p>
                <p className="text-xl font-black">30 de mayo</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white/15 p-4">
              <p className="text-sm text-cyan-100">Medidor</p>
              <p className="mt-1 text-2xl font-black">MD-009812</p>
              <p className="mt-1 text-sm text-cyan-100">
                Zona Norte · Calle 5
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BeakerIcon}
          label="Consumo actual"
          value="14 m³"
          helper="Mayo 2026"
        />

        <StatCard
          icon={DocumentTextIcon}
          label="Último recibo"
          value={formatMoney(35)}
          helper="Abril pagado"
        />

        <StatCard
          icon={CalendarDaysIcon}
          label="Días restantes"
          value="9 días"
          helper="Antes del vencimiento"
        />

        <StatCard
          icon={CheckCircleIcon}
          label="Estado"
          value="Activo"
          helper="Sin cortes programados"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <ConsumptionChart />

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Deudas pendientes
              </h2>

              <p className="text-sm text-slate-500">
                Conceptos por pagar
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
              {debts.length} pendientes
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {debts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-black text-white hover:bg-cyan-700"
          >
            Pagar seleccionados
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Últimos recibos
              </h2>

              <p className="text-sm text-slate-500">
                Pagos registrados recientemente
              </p>
            </div>

            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Ver todos
            </button>
          </div>

          <div className="mt-4">
            {receipts.map((receipt) => (
              <ReceiptRow key={receipt.id} receipt={receipt} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Avisos importantes
            </h2>

            <p className="text-sm text-slate-500">
              Comunicados de la OTB
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {notices.map((notice) => {
              const isWarning = notice.type === 'warning';
              const Icon = isWarning
                ? ExclamationTriangleIcon
                : CheckCircleIcon;

              return (
                <article
                  key={notice.title}
                  className={`rounded-2xl border p-4 ${
                    isWarning
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-emerald-200 bg-emerald-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        isWarning ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    />

                    <div>
                      <h3 className="font-black text-slate-900">
                        {notice.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            <BellIcon className="h-5 w-5" />
            Ver comunicados
          </button>
        </section>
      </section>
    </div>
  );
}