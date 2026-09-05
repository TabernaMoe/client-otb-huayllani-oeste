import { useEffect, useMemo, useState } from 'react';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import LogoOtb from '/logo-otb.webp';
import { AdminNav } from './Nav';
import { AuthService } from '../modules/auth/services/auth.services';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getInitials(name = '') {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function filterSidebarByPermissions(nav) {
  return nav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.permission) return true;
        return AuthService.hasPermission(item.permission);
      }),
    }))
    .filter((group) => group.items.length > 0);
}

function findGroupFromPath(pathname, sidebar) {
  for (const group of sidebar) {
    if (group.items.some((item) => pathname.startsWith(item.to))) {
      return group.id;
    }
  }

  return sidebar[0]?.id || 'admin';
}

function findCurrentItem(pathname, sidebar) {
  for (const group of sidebar) {
    const item = group.items.find((navItem) =>
      pathname.startsWith(navItem.to),
    );

    if (item) {
      return {
        group: group.title,
        label: item.label,
      };
    }
  }

  return {
    group: 'Administración',
    label: 'Panel principal',
  };
}

function SidebarContent({
  sidebarCollapsed,
  openGroup,
  setOpenGroup,
  setSidebarOpen,
  location,
  sidebar,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {!sidebarCollapsed && (
        <div className="px-4 pb-3 pt-4">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Navegación
          </p>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4">
        <nav className="space-y-2">
          {sidebar.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroup === group.id;

            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (sidebarCollapsed) {
                      setSidebarOpen(true);
                      setOpenGroup(group.id);
                      return;
                    }

                    setOpenGroup((current) =>
                      current === group.id ? '' : group.id,
                    );
                  }}
                  className={cx(
                    'group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition',
                    isOpen
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50',
                    sidebarCollapsed && 'justify-center px-2',
                  )}
                  title={group.title}
                >
                  <span
                    className={cx(
                      'rounded-xl p-2',
                      isOpen
                        ? 'bg-white text-emerald-700'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-white',
                    )}
                  >
                    <GroupIcon className="h-5 w-5 shrink-0" />
                  </span>

                  <div
                    className={cx(
                      'min-w-0 flex-1',
                      sidebarCollapsed && 'hidden',
                    )}
                  >
                    <p className="truncate text-sm font-bold">
                      {group.title}
                    </p>
                  </div>

                  <div className={cx(sidebarCollapsed && 'hidden')}>
                    {isOpen ? (
                      <ChevronDownIcon className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                <div
                  className={cx(
                    'overflow-hidden transition-all duration-300',
                    isOpen && !sidebarCollapsed
                      ? 'mt-2 max-h-128'
                      : 'max-h-0',
                  )}
                >
                  <div className="ml-5 space-y-1 border-l border-slate-200 pl-3">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active =
                        location.pathname.startsWith(item.to);

                      return (
                        <NavLink
                          key={`${group.id}:${item.to}`}
                          to={item.to}
                          className={({ isActive }) =>
                            cx(
                              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                              isActive
                                ? 'bg-emerald-700 font-semibold text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                            )
                          }
                          end
                          title={item.label}
                        >
                          <ItemIcon
                            className={cx(
                              'h-4 w-4 shrink-0',
                              active
                                ? 'text-white'
                                : 'text-slate-400',
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = AuthService.getUser();

  const sidebar = useMemo(
    () => filterSidebarByPermissions(AdminNav),
    [],
  );

  const activeGroup = useMemo(
    () => findGroupFromPath(location.pathname, sidebar),
    [location.pathname, sidebar],
  );

  const currentItem = useMemo(
    () => findCurrentItem(location.pathname, sidebar),
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const sidebarCollapsed = !sidebarOpen;

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login', { replace: true });
  };

  const displayName =
    user?.nombre_usuario ||
    user?.nombre ||
    user?.name ||
    user?.user ||
    'Usuario';

  const displayRole =
    user?.rol?.nombre_rol ||
    user?.rol ||
    user?.role ||
    'Sin rol';

  const initials = getInitials(displayName);

  const sidebarHeader = (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={LogoOtb}
          alt="Logo OTB"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-900">
          OTB Huayllani Oeste
        </p>
        <p className="truncate text-xs font-medium text-emerald-700">
          Panel administrativo
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
            aria-label="Abrir menú"
            type="button"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <button
            onClick={() => setSidebarOpen((value) => !value)}
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
            aria-label="Cambiar sidebar"
            type="button"
            title={sidebarOpen ? 'Contraer sidebar' : 'Expandir sidebar'}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
              <Squares2X2Icon className="h-5 w-5" />
            </div>

            <div className="leading-tight">
              <p className="text-xs font-medium text-slate-400">
                {currentItem.group}
              </p>
              <p className="text-sm font-bold text-slate-900">
                {currentItem.label}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
              aria-label="Notificaciones"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm md:flex">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700">
                {initials}
              </div>

              <div className="min-w-0 leading-tight">
                <p className="max-w-40 truncate text-sm font-bold">
                  {displayName}
                </p>
                <p className="max-w-40 truncate text-xs text-slate-500">
                  {displayRole}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 shadow-sm transition hover:bg-red-50"
              aria-label="Cerrar sesión"
              type="button"
              title="Cerrar sesión"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cx(
          'fixed inset-0 z-50 md:hidden',
          mobileOpen
            ? 'pointer-events-auto'
            : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cx(
            'absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={cx(
            'absolute left-0 top-0 flex h-full w-80 flex-col border-r border-slate-200 bg-white shadow-2xl',
            'transition-transform duration-300',
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full',
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-4">
            {sidebarHeader}

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              type="button"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <SidebarContent
            sidebarCollapsed={false}
            openGroup={openGroup}
            setOpenGroup={setOpenGroup}
            setSidebarOpen={setSidebarOpen}
            location={location}
            sidebar={sidebar}
          />

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 font-black text-emerald-700">
                  {initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {displayRole}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="hidden h-[calc(100vh-4rem)] min-h-0 md:flex">
        <aside
          className={cx(
            'flex flex-col border-r border-slate-200 bg-white transition-all duration-300',
            sidebarOpen ? 'w-80' : 'w-20',
          )}
        >
          <div
            className={cx(
              'flex h-20 items-center border-b border-slate-200 px-4',
              sidebarCollapsed && 'justify-center px-2',
            )}
          >
            {sidebarCollapsed ? (
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={LogoOtb}
                  alt="Logo OTB"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              sidebarHeader
            )}
          </div>

          <SidebarContent
            sidebarCollapsed={sidebarCollapsed}
            openGroup={openGroup}
            setOpenGroup={setOpenGroup}
            setSidebarOpen={setSidebarOpen}
            location={location}
            sidebar={sidebar}
          />

          <div className="border-t border-slate-200 p-3">
            {sidebarCollapsed ? (
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 font-black text-emerald-700">
                {initials}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 font-black text-emerald-700">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {displayRole}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <div className="h-[calc(100vh-4rem)] min-h-0 md:hidden">
        <main className="h-full overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}