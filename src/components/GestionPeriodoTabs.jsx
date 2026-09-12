import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/admin/gestiones', label: 'Gestiones' },
  { to: '/admin/periodos', label: 'Períodos' },
];

export default function GestionPeriodoTabs() {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `rounded-xl px-4 py-2 text-sm font-semibold transition ${
            isActive
              ? 'bg-emerald-700 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
