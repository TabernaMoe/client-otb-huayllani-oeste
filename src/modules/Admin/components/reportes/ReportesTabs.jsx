const tabs = [
  { value: 'general', label: 'Cobros generales' },
  { value: 'acciones', label: 'Cobros por acción' },
];

export default function ReportesTabs({ value, onChange }) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            value === tab.value
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
