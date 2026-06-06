import { useEffect, useState } from 'react';
import { CallesServices } from '../services/calles.services';
import InputField from '../../../components/ElegantInput';

const initialForm = {
  nombre_calle: '',
};

export default function CalleModal({
  open,
  calle,
  onClose,
  onSuccess,
}) {
  const isEdit = Boolean(calle);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    if (calle) {
      setForm({
        nombre_calle: calle.nombre_calle || '',
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
    setMessage('');
  }, [open, calle]);

  if (!open) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!form.nombre_calle.trim()) {
      newErrors.nombre_calle = 'El nombre de la calle es obligatorio';
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setMessage('');

    const payload = {
      nombre_calle: form.nombre_calle.trim(),
    };

    const response = isEdit
      ? await CallesServices.update(calle.id, payload)
      : await CallesServices.create(payload);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'No se pudo guardar la calle');
      return;
    }

    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Editar calle' : 'Nueva calle'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? 'Actualiza el nombre de la calle.'
              : 'Registra una nueva calle para el sistema.'}
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Nombre de la calle"
            type="text"
            name="nombre_calle"
            value={form.nombre_calle}
            onChange={handleChange}
            placeholder="Ej. Bolívar"
            error={errors.nombre_calle}
          />

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-red-800 px-5 py-3 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-60"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}