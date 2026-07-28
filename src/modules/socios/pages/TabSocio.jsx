import { useState } from 'react';
import {
  ArchiveBoxXMarkIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import SocioPage from './SocioPage';
import SociosDeleteds from './SociosDeleteds/SociosDeleteds';

const tabs = [
  {
    key: 'SocioPage',
    label: 'Socios',
    description: 'Registros activos e inactivos',
    icon: UserGroupIcon,
  },
  {
    key: 'SociosDeleteds',
    label: 'Socios eliminados',
    description: 'Registros disponibles para restaurar',
    icon: ArchiveBoxXMarkIcon,
  },
];

export default function PlanillaAdministracion() {
  const [tab, setTab] = useState('SocioPage');

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">
        <header>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Inicio</span>
            <span>/</span>
            <span>Administración</span>
            <span>/</span>
            <span className="text-emerald-700">Socios</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Administración de socios
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestiona los socios registrados y recupera registros eliminados.
          </p>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="grid gap-2 md:grid-cols-2">
            {tabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition ${
                    active
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`rounded-full p-2 ${
                      active
                        ? 'bg-white text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span>
                    <span className="block text-sm font-bold">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs opacity-75">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {tab === 'SocioPage' && <SocioPage />}
          {tab === 'SociosDeleteds' && <SociosDeleteds />}
        </div>
      </div>
    </section>
  );
}