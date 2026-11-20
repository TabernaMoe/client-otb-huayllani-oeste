import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/solid';
import LogoOtb from '/logo-otb.webp';

export default function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
  onOpenMobile,
  displayName,
  displayRole,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4">
        <button
          onClick={onOpenMobile}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 md:hidden"
          aria-label="Abrir menú"
          type="button"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 md:inline-flex"
          aria-label="Cambiar sidebar"
          type="button"
          title={sidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white sm:flex">
            <img
              src={LogoOtb}
              alt="Logo OTB"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Panel Admin</p>
            <p className="text-xs text-slate-500">Panel de administración</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 md:flex">
            <div className="leading-tight">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-slate-500">{displayRole}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-red-50 hover:text-red-600"
            aria-label="Cerrar sesión"
            type="button"
            title="Cerrar sesión"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}