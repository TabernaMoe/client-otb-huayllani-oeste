import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

const tabs = [
  {
    value: 'cobros_generales',
    label: 'Cobros generales',
    icon: ListBulletIcon,
  },
  {
    value: 'acciones',
    label: 'Cobros acciones de agua',
    icon: ClipboardDocumentListIcon,
  },
  { value: 'multas', label: 'Cobrar multas', icon: ExclamationTriangleIcon },
  {
    value: 'adicionales',
    label: 'Cobros adicionales',
    icon: CurrencyDollarIcon,
  },
  { value: 'pagos', label: 'Pagos', icon: BanknotesIcon },
];

export default function CobrosTabs({ activeView, onChange }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-2 xl:grid-cols-5">
      {tabs.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            activeView === value
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}
