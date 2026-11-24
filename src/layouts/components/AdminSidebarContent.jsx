import { NavLink } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminSidebarContent({
  sidebarCollapsed,
  openGroup,
  setOpenGroup,
  setSidebarOpen,
  pathname,
  sidebar,
}) {
  const handleGroupClick = (groupId) => {
    if (sidebarCollapsed) {
      setSidebarOpen(true);
      setOpenGroup(groupId);
      return;
    }
    setOpenGroup((current) => (current === groupId ? '' : groupId));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="h-3" />

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-4">
        <nav>
          {sidebar.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroup === group.id;

            return (
              <div key={group.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => handleGroupClick(group.id)}
                  className={cx(
                    'group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all hover:bg-slate-100',
                    isOpen ? 'bg-slate-100' : 'bg-transparent',
                    sidebarCollapsed && 'justify-center px-2',
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

                      return (
                        <NavLink
                          key={`${group.id}:${item.to}`}
                          to={item.to}
                          end
                          title={item.label}
                          className={({ isActive }) =>
                            cx(
                              'mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                              isActive
                                ? 'bg-blue-800 text-white shadow-sm'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-800',
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <ItemIcon
                                className={cx(
                                  'h-5 w-5 shrink-0',
                                  isActive ? 'text-white' : 'text-slate-500',
                                )}
                              />
                              <span className="truncate">{item.label}</span>
                            </>
                          )}
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