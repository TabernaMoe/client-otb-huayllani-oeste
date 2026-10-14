import {
  ClipboardDocumentListIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const tabs = [
  { value: 'categorias', label: 'Tipos de egreso', icon: TagIcon },
  { value: 'egresos', label: 'Registrar egreso', icon: ClipboardDocumentListIcon },
];

export default function EgresosTabs({ activeView, onChange }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-2">
      {tabs.map(({ value, label, icon: Icon }) => {
        const active = activeView === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
