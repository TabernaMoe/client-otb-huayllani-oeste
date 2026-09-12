import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import RangosTarifa from './RangosTarifa';
import { TarifasServices } from '../services/tarifas.services';
import { validateTarifa } from '../schema/tarifas.schema';

const emptyForm = {
  nombre_tarifa: '',
  rangosTarifa: [{ consumo_minimo: 0, consumo_maximo: '', precio: '' }],
};

const normalizeRanges = (rangos) =>
  rangos.map((rango, index) => {
    if (index === 0) return { ...rango, consumo_minimo: 0 };
    const maximoAnterior = rangos[index - 1].consumo_maximo;
    return {
      ...rango,
      consumo_minimo: maximoAnterior === '' || maximoAnterior === null
        ? rango.consumo_minimo
        : Number(maximoAnterior) + 1,
    };
  });

export default function TarifaModal({ open, tarifa, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(tarifa);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      tarifa
        ? {
            nombre_tarifa: tarifa.nombre_tarifa,
            rangosTarifa: tarifa.rangosTarifa.map((rango) => ({
              consumo_minimo: rango.consumo_minimo,
              consumo_maximo: rango.consumo_maximo ?? '',
              precio: rango.precio,
            })),
          }
        : emptyForm,
    );
  }, [open, tarifa]);

  const changeRango = (index, field, value) => {
    setForm((prev) => {
      const rangos = prev.rangosTarifa.map((rango, current) =>
        current === index ? { ...rango, [field]: value } : rango,
      );
      return { ...prev, rangosTarifa: normalizeRanges(rangos) };
    });
    setErrors((prev) => ({ ...prev, [`${field}_${index}`]: undefined }));
  };

  const addRango = () => {
    setForm((prev) => {
      const ultimo = prev.rangosTarifa[prev.rangosTarifa.length - 1];
      return {
        ...prev,
        rangosTarifa: [
          ...prev.rangosTarifa,
          { consumo_minimo: Number(ultimo.consumo_maximo) + 1, consumo_maximo: '', precio: '' },
        ],
      };
    });
  };

  const removeRango = (index) => {
    setForm((prev) => ({
      ...prev,
      rangosTarifa: normalizeRanges(prev.rangosTarifa.filter((_, current) => current !== index)),
    }));
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateTarifa(form);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      const response = isEdit
        ? await TarifasServices.update(tarifa.id, validation.data)
        : await TarifasServices.create(validation.data);
      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo guardar la tarifa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title={isEdit ? 'Editar tarifa' : 'Nueva tarifa'}
      description="Define el nombre y los rangos de consumo de agua."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ElegantInput
          label="Nombre de la tarifa"
          name="nombre_tarifa"
          value={form.nombre_tarifa}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, nombre_tarifa: e.target.value }));
            setErrors((prev) => ({ ...prev, nombre_tarifa: undefined }));
          }}
          error={errors.nombre_tarifa?.[0]}
          required
        />

        <RangosTarifa
          rangos={form.rangosTarifa}
          errors={errors}
          onChange={changeRango}
          onAdd={addRango}
          onRemove={removeRango}
        />

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Cancelar
          </button>
          <button disabled={loading} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear tarifa'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
