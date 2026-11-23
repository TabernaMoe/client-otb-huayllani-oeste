import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { validateTarifa } from '../schema/tarifas.schema';
import { TarifasServices } from '../services/tarifas.services';
import RangosTarifa from './RangosTarifa';

const EMPTY_FORM = {
  nombre_tarifa: '',
  rangosTarifa: [{ consumo_minimo: 0, consumo_maximo: '', precio: '' }],
};

const normalizeRanges = (rangos) =>
  rangos.map((rango, index) => {
    if (index === 0) return { ...rango, consumo_minimo: 0 };
    const maximoAnterior = rangos[index - 1].consumo_maximo;
    return {
      ...rango,
      consumo_minimo:
        maximoAnterior === '' || maximoAnterior === null
          ? rango.consumo_minimo
          : Number(maximoAnterior) + 1,
    };
  });

export default function TarifaModal({ open, tarifa, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();
  const isEdit = Boolean(tarifa?.id);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      tarifa
        ? {
            nombre_tarifa: tarifa.nombre_tarifa ?? '',
            rangosTarifa: (tarifa.rangosTarifa ?? []).map((rango) => ({
              consumo_minimo: rango.consumo_minimo,
              consumo_maximo: rango.consumo_maximo ?? '',
              precio: rango.precio,
            })),
          }
        : EMPTY_FORM,
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
          {
            consumo_minimo: Number(ultimo.consumo_maximo) + 1,
            consumo_maximo: '',
            precio: '',
          },
        ],
      };
    });
  };

  const removeRango = (index) => {
    setForm((prev) => ({
      ...prev,
      rangosTarifa: normalizeRanges(
        prev.rangosTarifa.filter((_, current) => current !== index),
      ),
    }));
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateTarifa(form);

    if (!validation.success) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(
      () =>
        isEdit
          ? TarifasServices.update(tarifa.id, validation.data)
          : TarifasServices.create(validation.data),
      {
        successMessage: (res) =>
          res?.message || (isEdit ? 'Tarifa actualizada' : 'Tarifa creada'),
        errorMessage: 'No se pudo guardar la tarifa',
        onSuccess: async () => {
          await onSuccess?.();
          onClose();
        },
      },
    );
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

        <ModalFooter
          onCancel={onClose}
          saving={submitting}
          submitLabel={isEdit ? 'Guardar cambios' : 'Crear tarifa'}
        />
      </form>
    </FormModal>
  );
}
