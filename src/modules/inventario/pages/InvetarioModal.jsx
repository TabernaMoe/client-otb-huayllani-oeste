import {
  ArrowPathIcon,
  CheckCircleIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';
import ConfirmModal from '../../../components/ConfirmModal';
import InputField from '../../../components/ElegantInput';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { getChangedFields } from '../../../utils/getChangedFields';
import { inventaioSchema, inventarioUpdateSchema } from '../inventario.schema';
import { InventarioServices as Servs } from '../inventario.services';
const initialForm = () => ({
  nombre_producto: '',
  saldo_actual: '',
});

export default function InventarioModal({
  open,
  onClose,
  dataRow,
  onSuccess,
  isEdit = false,
}) {
  const [form, setForm] = useState(initialForm());
  const [formTwo, setFormTwo] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const { openModal, closeModal, isModalOpen } = useModalManager();

  useEffect(() => {
    setError({});

    if (dataRow) {
      setForm({
        nombre_producto: dataRow.nombre_producto || '',
        saldo_actual: dataRow.saldo_actual || '',
      });
      setFormTwo({
        nombre_producto: dataRow.nombre_producto || '',
        saldo_actual: dataRow.saldo_actual || '',
      });
    } else {
      setForm(initialForm());
    }
  }, [dataRow, open]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError((previous) => ({
      ...previous,
      [name]: null,
    }));
  };

  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(formTwo, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = isEdit
      ? inventarioUpdateSchema.safeParse(payload)
      : inventarioUpdateSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }

    setData(result.data);
    openModal(MODALS.CONFIRM);
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = isEdit
        ? await Servs.update(dataRow.id, data)
        : await Servs.create(data);

      if (!response.ok) {
        toast.error(response.message || 'Error al guardar');
        closeModal(MODALS.CONFIRM);
        return;
      }

      toast.success(
        isEdit
          ? 'Producto actualizado correctamente'
          : 'Producto registrado correctamente',
      );

      closeModal(MODALS.CONFIRM);
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  };

  const handleBackdropKeyDown = (event) => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      event.target === event.currentTarget &&
      !loading
    ) {
      event.preventDefault();
      onClose();
    }

    if (event.key === 'Escape' && !loading) {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
        aria-label="Cerrar modal"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropKeyDown}
      >
        <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                <UsersIcon className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span>Inventario</span>
                  <span>/</span>
                  <span className="text-emerald-700">
                    {isEdit ? 'Editar' : 'Nuevo'}
                  </span>
                </div>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {isEdit
                    ? 'Editar información del producto'
                    : 'Registrar nuevo producto'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Completa los campos vacios.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(92vh-90px)] overflow-y-auto">
            <div className="space-y-6 p-6">
              <section>
                <div className="grid gap-5 md:grid-cols-1 xl:grid-cols-1">
                  <InputField
                    label="Producto"
                    type="text"
                    name="nombre_producto"
                    value={form.nombre_producto}
                    onChange={handleChange}
                    error={error.nombre_producto}
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-1 xl:grid-cols-1">
                  <InputField
                    label={
                      isEdit ? 'Aumentar al saldo actual' : ' Saldo acutal'
                    }
                    type="number"
                    name="saldo_actual"
                    value={form.saldo_actual}
                    onChange={handleChange}
                    error={error.saldo_actual}
                  />
                </div>
              </section>
            </div>
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleValidation}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    {isEdit ? 'Guardar cambios' : 'Registrar socio'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={isModalOpen(MODALS.CONFIRM)}
        title={isEdit ? 'Editar datos' : 'Guardar datos'}
        message="¿Deseas continuar?"
        confirmText={isEdit ? 'Sí, editar' : 'Sí, guardar'}
        cancelText="Cancelar"
        loading={loading}
        onClose={() => closeModal(MODALS.CONFIRM)}
        onConfirm={handleSubmit}
      />
    </>
  );
}
