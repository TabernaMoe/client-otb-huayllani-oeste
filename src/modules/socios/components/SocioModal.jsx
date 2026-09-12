import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import SelectComponent from '../../../components/Select';
import { SocioServices } from '../services/socio.services';
import { validateSocio } from '../schema/socio.schema';

const initialForm = {
  ci_socio: '',
  ci_expedido: '',
  nombres: '',
  primer_apellido: '',
  segundo_apellido: '',
  numero_celular: '',
  genero: '',
  direccion: '',
};

const expedidos = [
  ['LP', 'La Paz'], ['CB', 'Cochabamba'], ['SC', 'Santa Cruz'],
  ['OR', 'Oruro'], ['PT', 'Potosí'], ['TJ', 'Tarija'],
  ['CH', 'Chuquisaca'], ['BN', 'Beni'], ['PD', 'Pando'],
].map(([value, label]) => ({ value, label }));

const generos = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
];

export default function SocioModal({ open, socio, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(socio);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      socio
        ? {
            ci_socio: String(socio.ci_socio),
            ci_expedido: socio.ci_expedido,
            nombres: socio.nombres,
            primer_apellido: socio.primer_apellido,
            segundo_apellido: socio.segundo_apellido,
            numero_celular: String(socio.numero_celular),
            genero: socio.genero,
            direccion: socio.direccion,
          }
        : initialForm,
    );
  }, [open, socio]);

  if (!open) return null;

  const handleChange = ({ target }) => {
    setForm((prev) => ({ ...prev, [target.name]: target.value ?? '' }));
    setErrors((prev) => ({ ...prev, [target.name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateSocio(form);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      const response = isEdit
        ? await SocioServices.update(socio.id, validation.data)
        : await SocioServices.create(validation.data);
      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo guardar el socio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Editar socio' : 'Nuevo socio'}</h2>
            <p className="text-sm text-slate-500">Información personal y de contacto.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <ElegantInput label="CI" name="ci_socio" value={form.ci_socio} onChange={handleChange} error={errors.ci_socio?.[0]} required />
          <SelectComponent label="Expedido" name="ci_expedido" value={form.ci_expedido} onChange={handleChange} options={expedidos} error={errors.ci_expedido?.[0]} />
          <ElegantInput label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} error={errors.nombres?.[0]} required />
          <ElegantInput label="Primer apellido" name="primer_apellido" value={form.primer_apellido} onChange={handleChange} error={errors.primer_apellido?.[0]} required />
          <ElegantInput label="Segundo apellido" name="segundo_apellido" value={form.segundo_apellido} onChange={handleChange} error={errors.segundo_apellido?.[0]} />
          <ElegantInput label="Celular" name="numero_celular" value={form.numero_celular} onChange={handleChange} error={errors.numero_celular?.[0]} required />
          <SelectComponent label="Género" name="genero" value={form.genero} onChange={handleChange} options={generos} error={errors.genero?.[0]} />
          <ElegantInput label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} error={errors.direccion?.[0]} required />
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancelar</button>
          <button disabled={loading} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar socio'}
          </button>
        </div>
      </form>
    </div>
  );
}
