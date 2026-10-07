import { useEffect, useState } from 'react';
import FormModal from '../../../components/FormModal';
import ElegantInput from '../../../components/ElegantInput';
import { LecturasServices } from '../services/lecturas.services';

const initialForm = {
  consumo_m3: '',
  observacion_modificacion: '',
};

export default function EditarM3({ open, lectura, onClose, onSaved }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    console.log(lectura);
    setForm({
      consumo_m3: lectura?.consumo_m3 ?? '',
      observacion_modificacion: lectura?.observacion_modificacion ?? '',
    });

    setErrors({});
  }, [open, lectura]);

  const change = ({ target: { name, value } }) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      // Aquí iría tu servicio

      const response = await LecturasServices.updateM3({
        id: lectura.id,
        payload: {
          consumo_m3: Number(form.consumo_m3),
          observacion_modificacion: form.observacion_modificacion,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo modificar la consumo_m3');
      }

      onSaved?.();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title="Modificar consumo_m3"
      description={
        lectura?.periodo
          ? `Modificar la consumo_m3 correspondiente al periodo ${lectura.periodo}`
          : 'Ingrese los nuevos datos de la consumo_m3'
      }
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <ElegantInput
            label="Ingrese consumo_m3"
            name="consumo_m3"
            type="number"
            value={form.consumo_m3}
            onChange={change}
            error={errors.consumo_m3}
            min="0"
            step="0.01"
            required
          />

          <ElegantInput
            label="Observación"
            name="observacion_modificacion"
            type="text"
            value={form.observacion_modificacion}
            onChange={change}
            error={errors.observacion_modificacion}
            required
          />
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
