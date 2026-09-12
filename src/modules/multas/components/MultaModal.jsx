import { XMarkIcon } from '@heroicons/react/24/outline';
import { MultasServices } from '../services/multas.services';
import MultaForm from './MultaForm';

export default function MultaModal({ open, multa, onClose, onSaved }) {
  if (!open) return null;

  const initialValues = {
    nombre_multa: multa.nombre_multa,
    precio: multa.precio,
  };

  const handleSave = (data) => MultasServices.update(multa.id, data);
  const handleSuccess = async () => {
    await onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Editar multa</h3>
            <p className="text-sm text-slate-500">Actualiza el nombre o el precio.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <MultaForm
            initialValues={initialValues}
            submitLabel="Guardar cambios"
            onSave={handleSave}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
