import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import LogoOtb from '/logo-otb.webp';
import { SocioNav } from '../navigation/socioNav';
import { AuthService } from '../modules/auth/services/auth.services';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Sidebar({ open, onClose, onLogout, user }) {
  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className={cx(
          'fixed inset-0 z-40 bg-slate-950/50 transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cx(
          'fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
          <img src={LogoOtb} alt="Logo OTB" className="h-12 w-12 object-contain" />
          <div className="min-w-0 flex-1">
            <p className="font-black text-slate-900">Portal del socio</p>
            <p className="truncate text-xs text-slate-500">
              {user?.nombre || user?.nombre_usuario}
            </p>
          </div>
          <button type="button" onClick={onClose} className="lg:hidden">
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
                  cx(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100',
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default function SocioLayout() {
  const navigate = useNavigate();
  const user = AuthService.getUser();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-slate-200 p-2 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="ml-auto text-right">
            <p className="text-sm font-bold">{user?.nombre || user?.nombre_usuario}</p>
            <p className="text-xs text-slate-500">Socio</p>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
