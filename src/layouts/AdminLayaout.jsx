import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import LogoOtb from '/logo-otb.webp';


import { AdminNav } from './Nav';
function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

const BRAND = {
  name: 'Panel Admin',
  logo: (
    <div className="flex items-center gap-3 px-3 py-4">
      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
        <img
          src={LogoOtb}
          alt="Logo"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  ),
};
function findGroupFromPath(pathname) {
  for (const g of AdminNav) {
    if (g.items.some((it) => pathname.startsWith(it.to))) return g.id;
  }
  return AdminNav[0]?.id || 'general';
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
    <div className="flex h-full flex-col min-h-0">
      <div className="h-3" />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 pb-3">
        <nav>
          {sidebar.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroup === group.id;

            return (
              <div key={group.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => {
                    if (sidebarCollapsed) {
                      setSidebarOpen(true);
                      setOpenGroup(group.id);
                      return;
                    }

                    setOpenGroup((cur) => (cur === group.id ? '' : group.id));
                  }}
                  className={cx(
                    'group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all',
                    'hover:bg-slate-100',
                    isOpen ? 'bg-slate-100' : 'bg-transparent',
                    sidebarCollapsed ? 'justify-center px-2' : '',
                  )}
                  title={group.title}
                >
                  <GroupIcon className="h-6 w-6 shrink-0 text-slate-700" />

                  <div className={cx('flex-1', sidebarCollapsed && 'hidden')}>
                    <p className="text-sm font-semibold">{group.title}</p>
                  </div>

                  <div className={cx(sidebarCollapsed && 'hidden')}>
                    {isOpen ? (
                      <ChevronDownIcon className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                </button>

                <div
                  className={cx(
                    'mt-1 overflow-hidden transition-all duration-300',
                    isOpen && !sidebarCollapsed ? 'max-h-125' : 'max-h-0',
                  )}
                >
                  <div className="ml-3 border-l border-slate-200 pl-3">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const active = location.pathname.startsWith(item.to);

                      return (
                        <NavLink
                          key={`${group.id}:${item.to}`}
                          to={item.to}
                          className={({ isActive }) =>
                            cx(
                              'mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                              isActive
                                ? 'bg-red-800 text-white shadow-sm'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-700',
                            )
                          }
                          end
                          title={item.label}
                        >
                          <ItemIcon
                            className={cx(
                              'h-5 w-5 shrink-0',
                              active ? 'text-white' : 'text-slate-500',
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
export default function ClienteLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const activeGroup = useMemo(
    () => findGroupFromPath(location.pathname),
    [location.pathname],
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

  const sidebarCollapsed = !sidebarOpen;

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 md:hidden"
            aria-label="Open menu"
            type="button"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
            aria-label="Toggle sidebar"
            type="button"
            title={sidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">{BRAND.logo}</div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{BRAND.name}</p>
              <p className="text-xs text-slate-500">Panel de administración</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <div className="leading-tight">
                <p className="text-sm font-semibold">Admin</p>
                <p className="text-xs text-slate-500">admin@cns.bo</p>
              </div>
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              aria-label="Logout"
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
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cx(
            'absolute inset-0 bg-black/40 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={cx(
            'absolute left-0 top-0 h-full w-[18rem] border-r border-slate-200/70 bg-white/90 backdrop-blur',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200/70 px-4">
            <div className="flex items-center gap-3">
              {BRAND.logo}
              <div className="leading-tight">
                <p className="text-sm font-semibold">{BRAND.name}</p>
                <p className="text-xs text-slate-500">Menú</p>
              </div>
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
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
            sidebar={AdminNav}
          />
        </aside>
      </div>

      <div className="hidden md:flex h-[calc(100vh-4rem)] min-h-0">
        <aside
          className={cx(
            'border-r border-slate-200/70 bg-white/70 backdrop-blur transition-all duration-300',
            sidebarOpen ? 'w-72' : 'w-20',
          )}
        >
          <SidebarContent
            sidebarCollapsed={sidebarCollapsed}
            openGroup={openGroup}
            setOpenGroup={setOpenGroup}
            setSidebarOpen={setSidebarOpen}
            location={location}
            sidebar={AdminNav}
          />
        </aside>

        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <div className="md:hidden h-[calc(100vh-4rem)] min-h-0">
        <main className="h-full overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}