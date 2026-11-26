import { useEffect, useState } from 'react';
import {
  BookmarkSquareIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import PageHeader from '../../../components/PageHeader';
import Select from '../../../components/Select';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { formatZodErrorMessage } from '../../../services/error';
import { formatCurrency } from '../../../utils/formatters';
import { zodErrors } from '../../../utils/zodErrors';
import { CobroUniversalSchema } from '../schema';
import { ReciboMadreSerivices as Servs } from '../services';

const INITIAL_FORM = {
  accion_id: '',
  concepto: '',
  descripcion: '',
  monto: '',
};

export default function UniversalFormView({
  title,
  description,
  sectionTitle,
  sectionDescription,
  submitLabel,
  confirmTitle,
  confirmMessage,
  onSubmitPayload,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [acciones, setAcciones] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingAcciones, setLoadingAcciones] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const { submitting, run } = useAsyncSubmit();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingAcciones(true);
        const response = await Servs.getSelectAccion();
        if (!response.ok) {
          toast.error(response?.message || 'No se pudo obtener las acciones');
          return;
        }
        setAcciones(Array.isArray(response?.data) ? response.data : []);
      } finally {
        setLoadingAcciones(false);
      }
    };
    loadData();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value ?? '' }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleOpenConfirm = () => {
    const result = CobroUniversalSchema.safeParse(form);
    if (!result.success) {
      setErrors(zodErrors(result.error));
      toast.error(formatZodErrorMessage(result.error));
      return;
    }
    setPendingData(result.data);
  };

  const handleSave = async () => {
    if (!pendingData) return;

    await run(() => onSubmitPayload({ payload: pendingData }), {
      successMessage: (res) => res?.message || 'Cobro registrado correctamente',
      errorMessage: 'No se pudo guardar el registro',
      onError: (response) => {
        if (response?.fieldErrors) setErrors(response.fieldErrors);
        setPendingData(null);
      },
      onSuccess: () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setPendingData(null);
      },
    });
  };

  const selectedAccionLabel =
    acciones.find((item) => item.value === pendingData?.accion_id)?.label || '';

  return (
    <>
      <section className="space-y-5">
        <PageHeader title={title} description={description} />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <Cog6ToothIcon className="mt-0.5 size-6 shrink-0 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {sectionTitle}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {sectionDescription}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Select
              label="Acción"
              placeholder={
                loadingAcciones
                  ? 'Cargando acciones...'
                  : 'Buscar y seleccionar acción...'
              }
              name="accion_id"
              value={form.accion_id}
              options={acciones}
              onChange={handleChange}
              error={errors.accion_id}
              isDisabled={loadingAcciones}
            />
            <ElegantInput
              label="Concepto"
              name="concepto"
              value={form.concepto}
              error={errors.concepto}
              onChange={handleChange}
            />
            <ElegantTextarea
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              error={errors.descripcion}
              onChange={handleChange}
            />
            <ElegantInput
              label="Monto Bs."
              type="number"
              name="monto"
              value={form.monto}
              error={errors.monto}
              onChange={handleChange}
            />
          </div>

          <footer className="mt-6 flex justify-end border-t border-slate-200 pt-5">
            <button
              type="button"
              disabled={submitting}
              onClick={handleOpenConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <BookmarkSquareIcon className="size-4" />
              {submitting ? 'Guardando...' : submitLabel}
            </button>
          </footer>
        </div>
      </section>

      <ConfirmModal
        open={Boolean(pendingData)}
        title={confirmTitle}
        message={
          pendingData
            ? `${confirmMessage} Acción: "${selectedAccionLabel}" · Monto: ${formatCurrency(pendingData.monto)}.`
            : confirmMessage
        }
        confirmText="Confirmar"
        onClose={() => setPendingData(null)}
        onConfirm={handleSave}
        loading={submitting}
      />
    </>
  );
}
