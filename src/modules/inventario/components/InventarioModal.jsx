import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { formatZodErrorMessage } from '../../../services/error';
import { zodErrors } from '../../../utils/zodErrors';
import { inventarioSchema } from '../inventario.schema';
import { InventarioServices } from '../inventario.services';

const EMPTY_FORM = {
  nombre_producto: '',
  saldo_actual: '',
};

export default function InventarioModal({ open, producto, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const { submitting, run } = useAsyncSubmit();
  const isEdit = Boolean(producto);

  useEffect(() => {
    if (!open) return;

    setForm(
      producto
        ? {
            nombre_producto: producto.nombre_producto,
            saldo_actual: producto.saldo_actual,
          }
        : EMPTY_FORM,
    );
    setErrors({});
  }, [open, producto]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = inventarioSchema.safeParse(form);
    if (!result.success) {
      setErrors(zodErrors(result.error));
      toast.error(formatZodErrorMessage(result.error));
      return;
    }

    await run(
      () =>
        isEdit
          ? InventarioServices.update(producto.id, result.data)
          : InventarioServices.create(result.data),
      {
        successMessage: (res) =>
          res?.message || (isEdit ? 'Producto actualizado' : 'Producto creado'),
        errorMessage: 'No se pudo guardar el producto',
        onSuccess,
      },
    );
  };

  return (
    <FormModal
      open={open}
      title={isEdit ? 'Editar producto' : 'Nuevo producto'}
      description="Información básica del inventario."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <ElegantInput
          label="Producto"
          name="nombre_producto"
          value={form.nombre_producto}
          onChange={handleChange}
          error={errors.nombre_producto}
          required
        />

        <ElegantInput
          label="Saldo actual"
          name="saldo_actual"
          type="number"
          value={form.saldo_actual}
          onChange={handleChange}
          error={errors.saldo_actual}
          required
        />

        <ModalFooter
          onCancel={onClose}
          saving={submitting}
          submitLabel={isEdit ? 'Guardar cambios' : 'Crear producto'}
        />
      </form>
    </FormModal>
  );
}
