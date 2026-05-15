import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CalleRamalServices as Servs } from '../../services/calleRamal.services';
import Select from '../../../../components/Select';
import InputField from '../../../../components/ElegantInput';
import ConfirmModal from '../../../../components/ConfirmModal';

import { getChangedFields } from '../../../../helpers/getChangedFields';
import { MODALS, useModalManager } from '../../../../hooks/useModalManager';
import { calleRamalSchema } from '../../schema/calleRamal.schema';

const initialForm = () => ({
  nombre_calle: '',
});

export default function CalleRamalModal({
  open,
  isEdit = false,
  onClose,
  calle,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [valores, setValores] = useState(null);
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();

  useEffect(() => {
    if (open) {
      if (calle) {
        setForm(calle); // Modo edición
        setError({});
      } else {
        setForm(initialForm); // Modo creación
        setError({});
      }
    }
  }, [calle, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleValidation = () => {
    const payload = isEdit ? getChangedFields(calle, form) : form;

    if (isEdit && Object.keys(payload).length === 0) {
      toast.info('No realizaste ningún cambio');
      return;
    }

    const result = calleRamalSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.flatten().fieldErrors);
      toast.error('Datos incorrectos');
      return;
    }
    setValores(result.data);

    openModal(isEdit ? MODALS.EDIT : MODALS.CREATE);
  };
  const handleCreate = async () => {
    try {
      setLoading(true);
      const data = await Servs.create(form);
      if (data.ok) {
        toast.success(data.message || 'Se guardo correctamente');
        onSuccess();
      }
      if (!data.ok) {
        toast.error(e.message || 'No se pudo guardar el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar registro');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const data = await Servs.update(calle.id, form);
      if (data.ok) {
        toast.success(data.message || 'Se guardo correctamente');
        closeModal();
        onSuccess();
      }
      if (!data.ok) {
        toast.error(e.message || 'No se pudo guardar el registro');
      }
    } catch (e) {
      toast.error(e.message || 'Error al guardar registro');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay (fondo) */}
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/40"
        />
        <div
          className="relative z-10 w-3xl max-w-xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200
                max-h-[calc(100vh-2rem)] overflow-y-auto"
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Editar registro' : 'Crear nuevo registro'}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="md:col-span-1 lg:col-span-12">
                <InputField
                  label="Ingrese nombre de la calle"
                  type="text"
                  name="nombre_calle"
                  value={form?.nombre_calle || ''}
                  onChange={handleChange}
                  error={error.nombre_calle}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-5">
            <button
              className="rounded-xl bg-red-800 px-3 py-2 text-white hover:bg-red-900"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-sky-800 px-3 py-2 text-white hover:bg-sky-900"
              onClick={handleValidation}
            >
              {isEdit ? 'Editar cambios' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={isModalOpen(isEdit ? MODALS.EDIT : MODALS.CREATE)}
        onClose={closeModal}
        onConfirm={isEdit ? handleUpdate : handleCreate}
        title={isEdit ? '¿Confirmar edición?' : '¿Confirmar creación?'}
        loading={loading}
      />
    </>
  );
}
