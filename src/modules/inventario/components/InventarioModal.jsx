import { useEffect, useState } from 'react';
import { ArchiveBoxIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import { inventarioSchema } from '../inventario.schema';
import { InventarioServices } from '../inventario.services';

const EMPTY_FORM = {
  nombre_producto: '',
  saldo_actual: '',
};

export default function InventarioModal({ open, producto, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

  if (!open) return null;

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = inventarioSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, value[0]]),
        ),
      );
      return;
    }

    try {
      setLoading(true);

      const response = isEdit
        ? await InventarioServices.update(producto.id, result.data)
        : await InventarioServices.create(result.data);

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <ArchiveBoxIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEdit ? 'Editar producto' : 'Nuevo producto'}
              </h3>
              <p className="text-sm text-slate-500">
                Información básica del inventario.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
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
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
