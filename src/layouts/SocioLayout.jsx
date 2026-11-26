import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

import LogoOtb from '/logo-otb.webp';
import { SocioNav } from './SocioNav';
import { useAuth } from '../modules/auth/context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

function getInitials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'SO'
  );
}

function SocioSidebar({ open, onClose, onLogout, displayName }) {
  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[1px] transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1">
            <img src={LogoOtb} alt="Logo OTB" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black tracking-tight text-slate-900">Portal del Socio</p>
            <p className="truncate text-xs font-medium text-slate-500">{displayName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {SocioNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-800'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default function SocioLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const displayName = user?.nombre || user?.nombre_usuario || 'Socio';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SocioSidebar
        open={open}
        onClose={() => setOpen(false)}
        onLogout={handleLogout}
        displayName={displayName}
      />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="max-w-45 truncate text-sm font-bold text-slate-900 sm:max-w-none">
                {displayName}
              </p>
              <p className="text-xs font-medium text-emerald-700">Cuenta de socio</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
              {getInitials(displayName)}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <ErrorBoundary resetKey={location.pathname} homePath="/socio/inicio">
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
