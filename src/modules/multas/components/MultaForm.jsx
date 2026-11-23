import { useState } from 'react';
import { BanknotesIcon, TagIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { validateMulta } from '../schemas/multas.schema';

const EMPTY_FORM = { nombre_multa: '', precio: '' };

export default function MultaForm({
  initialValues = EMPTY_FORM,
  submitLabel = 'Guardar multa',
  onSave,
  onSuccess,
  resetOnSuccess = false,
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateMulta(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(() => onSave(validation.data), {
      successMessage: (res) => res?.message || 'Multa guardada correctamente',
      errorMessage: 'No se pudo guardar la multa',
      onSuccess: (response) => {
        setErrors({});
        if (resetOnSuccess) setForm(EMPTY_FORM);
        onSuccess?.(response);
      },
    });
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
        >
          {submitting ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
