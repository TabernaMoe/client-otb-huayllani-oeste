import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/solid';

import LogoOtb from '/logo-otb.webp';
import { AdminNav } from './Nav';
import { AuthService } from '../modules/auth/services/auth.services';
import AdminHeader from './components/AdminHeader';
import AdminSidebarContent from './components/AdminSidebarContent';

function filterSidebarByPermissions(nav) {
  return nav
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || AuthService.hasPermission(item.permission),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

function findGroupFromPath(pathname, sidebar) {
  const match = sidebar.find((group) =>
    group.items.some((item) => pathname.startsWith(item.to)),
  );
  return match?.id || sidebar[0]?.id || 'principal';
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = AuthService.getUser();
  const userKey = user?.id ?? user?.nombre_usuario ?? '';

  const sidebar = useMemo(() => filterSidebarByPermissions(AdminNav), [userKey]);

  const activeGroup = useMemo(
    () => findGroupFromPath(location.pathname, sidebar),
    [location.pathname, sidebar],
  );

  const [openGroup, setOpenGroup] = useState(activeGroup);

  useEffect(() => {
    setOpenGroup(activeGroup);
  }, [activeGroup]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login', { replace: true });
  };

  const displayName =
    user?.nombre_usuario || user?.nombre || user?.name || 'Usuario';
  const displayRole =
    user?.rol?.nombre_rol || user?.rol || user?.role || 'Sin rol';

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
      <AdminHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onOpenMobile={() => setMobileOpen(true)}
        displayName={displayName}
        displayRole={displayRole}
        onLogout={handleLogout}
      />

      {/* Drawer móvil */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-72 flex-col border-r border-slate-200/70 bg-white/95 backdrop-blur transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200/70 px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white">
                <img
                  src={LogoOtb}
                  alt="Logo OTB"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Panel Admin</p>
                <p className="text-xs text-slate-500">Menú</p>
              </div>
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              type="button"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <AdminSidebarContent
            sidebarCollapsed={false}
            openGroup={openGroup}
            setOpenGroup={setOpenGroup}
            setSidebarOpen={setSidebarOpen}
            pathname={location.pathname}
            sidebar={sidebar}
          />
        </aside>
      </div>

      {/* Contenedor único responsive (un solo Outlet) */}
      <div className="flex min-h-0 flex-1">
        <aside
          className={`hidden border-r border-slate-200/70 bg-white/70 backdrop-blur transition-all duration-300 md:block ${
            sidebarOpen ? 'w-72' : 'w-20'
          }`}
        >
          <AdminSidebarContent
            sidebarCollapsed={!sidebarOpen}
            openGroup={openGroup}
            setOpenGroup={setOpenGroup}
            setSidebarOpen={setSidebarOpen}
            pathname={location.pathname}
            sidebar={sidebar}
          />
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}