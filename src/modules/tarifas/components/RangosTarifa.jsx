import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import ElegantInput from '../../../components/ElegantInput';

export default function RangosTarifa({ rangos, errors, onChange, onAdd, onRemove }) {
  const ultimo = rangos[rangos.length - 1];
  const canAdd = ultimo.consumo_maximo !== '' && ultimo.consumo_maximo !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">Rangos de consumo</h3>
          <p className="text-sm text-slate-500">Deja vacío el máximo del último rango para indicar que no tiene límite.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!canAdd}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlusIcon className="h-4 w-4" /> Agregar rango
        </button>
      </div>

      {rangos.map((rango, index) => (
        <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <ElegantInput
            label="Consumo mínimo"
            name={`consumo_minimo_${index}`}
            type="number"
            value={rango.consumo_minimo}
            disabled
            error={errors[`consumo_minimo_${index}`]?.[0]}
          />
          <ElegantInput
            label={index === rangos.length - 1 ? 'Consumo máximo (opcional)' : 'Consumo máximo'}
            name={`consumo_maximo_${index}`}
            type="number"
            value={rango.consumo_maximo}
            onChange={(e) => onChange(index, 'consumo_maximo', e.target.value)}
            error={errors[`consumo_maximo_${index}`]?.[0]}
          />
          <ElegantInput
            label="Precio (Bs)"
            name={`precio_${index}`}
            type="number"
            value={rango.precio}
            onChange={(e) => onChange(index, 'precio', e.target.value)}
            error={errors[`precio_${index}`]?.[0]}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={rangos.length === 1}
            className="mb-1 rounded-xl p-3 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
            title="Eliminar rango"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}

      {errors.rangosTarifa?.[0] && <p className="text-sm font-medium text-red-500">{errors.rangosTarifa[0]}</p>}
    </div>
  );
}
