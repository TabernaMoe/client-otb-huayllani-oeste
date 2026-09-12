import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Usuarios', to: '/admin/usuarios' },
  { label: 'Roles y permisos', to: '/admin/roles' },
];

export default function UsuariosRolesTabs() {
  const { pathname } = useLocation();

  return (
    <div className="flex w-fit gap-1 rounded-2xl bg-slate-100 p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            pathname === tab.to
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
