import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronRightIcon,
  HomeIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import LogoOtb from '/logo-otb.webp';
import { AuthService } from '../modules/auth/services/auth.services';

const menuItems = [
  {
    label: 'Inicio',
    description: 'Resumen de tu cuenta',
    to: '/cliente/dashboard',
    icon: HomeIcon,
  },
  {
    label: 'Mi perfil',
    description: 'Datos de acceso',
    to: '/cliente/perfil',
    icon: UserIcon,
  },
];

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role) {
  return role.replaceAll('_', ' ');
}

function Sidebar({ open, onClose, onLogout, user }) {
  const initials = getInitials(user.nombre_usuario);

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-80 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={LogoOtb}
                  alt="Logo OTB"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-black tracking-tight text-slate-900">
                  OTB Huayllani Oeste
                </h1>
                <p className="text-sm font-medium text-emerald-700">
                  Portal del socio
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 lg:hidden"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white font-black text-emerald-700 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.nombre_usuario}
                </p>
                <p className="truncate text-xs capitalize text-slate-500">
                  {formatRole(user.rol)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <p className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Navegación
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl border px-3 py-3 transition ${
                      isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`rounded-xl p-2.5 ${
                          isActive
                            ? 'bg-white text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block truncate text-xs opacity-70">
                          {item.description}
                        </span>
                      </span>
                      <ChevronRightIcon className="h-4 w-4 text-slate-300" />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = AuthService.getUser();

  const currentItem = useMemo(
    () =>
      menuItems.find((item) => location.pathname.startsWith(item.to)) ||
      menuItems[0],
    [location.pathname],
  );

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
          user={user}
        />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menú"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span>Portal del socio</span>
                  <span>/</span>
                  <span className="truncate text-emerald-700">
                    {currentItem.label}
                  </span>
                </div>
                <h2 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {currentItem.label}
                </h2>
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
