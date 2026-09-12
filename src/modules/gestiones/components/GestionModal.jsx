import { useEffect, useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import { GestionesServices } from '../services/gestiones.services';
import { gestionSchema } from '../schema/gestiones.schema';

export default function GestionModal({ open, onClose, onSuccess }) {
  const [anio, setAnio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAnio('');
    setError('');
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = gestionSchema.safeParse({ anio });

    if (!validation.success) {
      setError(validation.error.flatten().fieldErrors.anio?.[0]);
      return;
    }

    try {
      setLoading(true);
      const response = await GestionesServices.create(validation.data);
      if (!response.ok) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'No se pudo crear la gestión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title="Nueva gestión"
      description="Al crear una gestión, el backend genera sus períodos mensuales."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <ElegantInput
          label="Año"
          name="anio"
          type="number"
          value={anio}
          onChange={(event) => {
            setAnio(event.target.value);
            setError('');
          }}
          placeholder="2027"
          error={error}
          icon={<CalendarDaysIcon className="h-5 w-5" />}
          required
        />

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? 'Creando...' : 'Crear gestión'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
