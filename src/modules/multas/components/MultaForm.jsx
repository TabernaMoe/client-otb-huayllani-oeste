import { useState } from 'react';
import { BanknotesIcon, TagIcon } from '@heroicons/react/24/outline';
import ElegantInput from '../../../components/ElegantInput';
import { validateMulta } from '../schemas/multas.schema';

const emptyForm = { nombre_multa: '', precio: '' };

export default function MultaForm({
  initialValues = emptyForm,
  submitLabel = 'Guardar multa',
  onSave,
  onSuccess,
  resetOnSuccess = false,
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateMulta(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    const response = await onSave(validation.data);
    setSaving(false);

    if (!response.ok) {
      setMessage(response.message);
      return;
    }

    setErrors({});
    setMessage('');
    if (resetOnSuccess) setForm(emptyForm);
    onSuccess?.(response);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ElegantInput
        label="Nombre de la multa"
        name="nombre_multa"
        value={form.nombre_multa}
        onChange={handleChange}
        placeholder="Ej: Basura en la calle"
        error={errors.nombre_multa}
        required
        icon={<TagIcon className="h-5 w-5" />}
      />

      <ElegantInput
        label="Precio"
        name="precio"
        type="number"
        value={form.precio}
        onChange={handleChange}
        placeholder="0.00"
        error={errors.precio}
        required
        icon={<BanknotesIcon className="h-5 w-5" />}
      />

      {message && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {message}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
