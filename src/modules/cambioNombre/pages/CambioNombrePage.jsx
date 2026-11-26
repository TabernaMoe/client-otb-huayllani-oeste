import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import PageHeader from '../../../components/PageHeader';
import SelectComponent from '../../../components/Select';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { formatCurrency } from '../../../utils/formatters';
import { validateCambioNombre } from '../schema/cambioNombre.schema';
import { CambioNombreServices } from '../services/cambioNombre.services';

const EMPTY_FORM = {
  accion_id: null,
  socio_nuevo_id: null,
  tipo: null,
  observacion: '',
  monto: '',
};

const SERVICIOS = [
  { value: 'AGUA', label: 'Agua' },
  { value: 'ALCANTARILLADO', label: 'Alcantarillado' },
];

const TIPOS = [
  { value: 'FAMILIAR', label: 'Familiar' },
  { value: 'AJENO', label: 'Ajeno' },
];

export default function CambioNombrePage() {
  const [tipoServicio, setTipoServicio] = useState('AGUA');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [acciones, setAcciones] = useState([]);
  const [socios, setSocios] = useState([]);
  const [loadingAcciones, setLoadingAcciones] = useState(false);
  const [loadingSocios, setLoadingSocios] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const { submitting, run } = useAsyncSubmit();

  useEffect(() => {
    setLoadingSocios(true);
    CambioNombreServices.getSocios().then((res) => {
      setLoadingSocios(false);
      if (!res.ok) return toast.error(res.message);
      setSocios(res.data ?? []);
    });
  }, []);

  const loadAcciones = useCallback(async (servicio) => {
    setLoadingAcciones(true);
    const res = await CambioNombreServices.getAcciones(servicio);
    setLoadingAcciones(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    setAcciones(res.data ?? []);
  }, []);

  useEffect(() => {
    setForm((current) => ({ ...current, accion_id: null }));
    loadAcciones(tipoServicio);
  }, [tipoServicio, loadAcciones]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = validateCambioNombre(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    setPendingPayload(validation.data);
  };

  const handleConfirm = async () => {
    if (!pendingPayload) return;

    await run(
      () => CambioNombreServices.create(pendingPayload, tipoServicio),
      {
        successMessage: (res) =>
          res?.message || 'Cambio de nombre registrado',
        errorMessage: 'No se pudo registrar el cambio de nombre',
        onSuccess: async () => {
          setPendingPayload(null);
          setForm(EMPTY_FORM);
          setErrors({});
          await loadAcciones(tipoServicio);
        },
      },
    );
  };

  const selectedAccionLabel =
    acciones.find((a) => a.value === pendingPayload?.accion_id)?.label || '';
  const selectedSocioLabel =
    socios.find((s) => s.value === pendingPayload?.socio_nuevo_id)?.label || '';

  return (
    <section className="space-y-6">
      <PageHeader
        title="Cambio de nombre"
        description="Transfiere una acción de agua o alcantarillado a un nuevo socio."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectComponent
            label="Tipo de servicio"
            name="tipo_servicio"
            value={tipoServicio}
            onChange={({ target }) => setTipoServicio(target.value || 'AGUA')}
            options={SERVICIOS}
          />

          <SelectComponent
            label="Acción"
            name="accion_id"
            value={form.accion_id}
            onChange={handleChange}
            options={acciones}
            error={errors.accion_id}
            isDisabled={loadingAcciones}
          />
        </div>

        <SelectComponent
          label="Nuevo socio"
          name="socio_nuevo_id"
          value={form.socio_nuevo_id}
          onChange={handleChange}
          options={socios}
          error={errors.socio_nuevo_id}
          isDisabled={loadingSocios}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectComponent
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={TIPOS}
            error={errors.tipo}
          />

          <ElegantInput
            label="Monto"
            name="monto"
            type="number"
            step="0.01"
            value={form.monto}
            onChange={handleChange}
            error={errors.monto}
            placeholder="0.00"
            required
          />
        </div>

        <ElegantTextarea
          label="Observación"
          name="observacion"
          value={form.observacion}
          onChange={handleChange}
          error={errors.observacion}
          rows={3}
          placeholder="Motivo del cambio de nombre"
          required
        />

        <div className="flex justify-end border-t border-slate-200 pt-4">
          <button
            type="submit"
            disabled={submitting || loadingAcciones || loadingSocios}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Procesando...' : 'Registrar cambio'}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={Boolean(pendingPayload)}
        title="Confirmar cambio de nombre"
        message={
          pendingPayload
            ? `¿Confirmas transferir la acción "${selectedAccionLabel}" (${tipoServicio}) a "${selectedSocioLabel}" por ${formatCurrency(pendingPayload.monto)}?`
            : ''
        }
        confirmText="Confirmar traspaso"
        loading={submitting}
        onConfirm={handleConfirm}
        onClose={() => setPendingPayload(null)}
      />
    </section>
  );
}
