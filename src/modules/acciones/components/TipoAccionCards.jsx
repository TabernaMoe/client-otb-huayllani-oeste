import {
  CheckCircleIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

export default function TipoAccionCards({ options = [], value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`group flex min-h-32 flex-col justify-between rounded-2xl border p-4 text-left transition ${
              selected
                ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-xl p-2.5 ${selected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'}`}>
                <RectangleStackIcon className="h-5 w-5" />
              </span>

              {selected && <CheckCircleIcon className="h-5 w-5 text-emerald-600" />}
            </div>

            <div>
              <p className="font-semibold text-slate-900">{option.label}</p>
              <p className="mt-1 text-xs text-slate-500">Seleccionar tipo de acción</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
