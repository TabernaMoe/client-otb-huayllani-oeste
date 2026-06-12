import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BeakerIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

import LogoOtb from '/logo-otb.webp';
import { AuthService } from '../modules/auth/services/auth.services';

const menuItems = [
  {
    label: 'Inicio',
    to: '/cliente/dashboard',
    icon: HomeIcon,
  },
  {
    label: 'Mi consumo',
    to: '/cliente/consumo',
    icon: BeakerIcon,
  },
  {
    label: 'Pagos',
    to: '/cliente/pagos',
    icon: CreditCardIcon,
  },
  {
    label: 'Recibos',
    to: '/cliente/recibos',
    icon: DocumentTextIcon,
  },
  {
    label: 'Avisos',
    to: '/cliente/avisos',
    icon: BellIcon,
  },
  {
    label: 'Perfil',
    to: '/cliente/perfil',
    icon: UserIcon,
  },
  {
  label: 'Mis acciones',
  to: '/cliente/acciones',
  icon: BuildingOffice2Icon,
},
];

function getInitials(name = '') {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Sidebar({ open, onClose, onLogout }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <img
                src={LogoOtb}
                alt="Logo OTB"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                OTB Huayllani Oeste
              </h1>
              <p className="text-sm text-slate-500">Portal del socio</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          

          <button
            type="button"
            onClick={onLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-sky-50"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default function ClienteLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = AuthService.getUser();

  const displayName =
    user?.nombre_usuario ||
    user?.nombre ||
    user?.name ||
    'Usuario';

  const displayRole =
    user?.rol?.nombre_rol ||
    user?.rol ||
    user?.role ||
    'Usuario normal';

  const initials = getInitials(displayName);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 p-2 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                <div>
                  <p className="text-sm font-semibold text-cyan-700">
                    Bienvenido, {displayName}
                  </p>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    Panel del socio
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white" />
                </button>

                <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 sm:flex">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-100 font-black text-cyan-700">
                    {initials}
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-black">{displayName}</p>
                    <p className="text-xs text-slate-500">{displayRole}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}