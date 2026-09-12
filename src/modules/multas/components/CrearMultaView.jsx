import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { MultasServices } from '../services/multas.services';
import MultaForm from './MultaForm';

export default function CrearMultaView({ onCreated }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <PlusCircleIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Nueva multa</h2>
          <p className="mt-1 text-sm text-slate-500">
            Registra el concepto y el monto de la multa.
          </p>
        </div>
      </div>

      <MultaForm
        submitLabel="Crear multa"
        onSave={MultasServices.create}
        onSuccess={onCreated}
      />
    </div>
  );
}
