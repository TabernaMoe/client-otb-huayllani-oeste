import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal';
import SelectComponent from '../../../components/Select';
import { CobrosServices } from '../services/cobros.services';
import { validatePagoCobro } from '../schema/cobros.schema';
import CobrosPendientes from './CobrosPendientes';
import ResumenCobro from './ResumenCobro';
import FormularioPago from './FormularioPago';
import QrPagoModal from './QrPagoModal';
import { imprimirRecibo } from '../reciboPdf/generarReciboHTML.js';

const initialForm = {
  monto: '',
  cobros: [],
  metodo_pago: 'EFECTIVO',
};

const SERVICIOS = [
  { value: 'AGUA', label: 'AGUA' },
  { value: 'ALCANTARILLADO', label: 'ALCANTARILLADO' },
];

export default function CobroPorAccionView() {
  const [tipoServicio, setTipoServicio] = useState('AGUA');
  const [acciones, setAcciones] = useState([]);
  const [selectedAccionId, setSelectedAccionId] = useState(null);
  const [cobros, setCobros] = useState([]);
  const [loadingAcciones, setLoadingAcciones] = useState(false);
  const [loadingCobros, setLoadingCobros] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [qrPago, setQrPago] = useState(null);
  const [pendingPago, setPendingPago] = useState(null);

  useEffect(() => {
    setLoadingAcciones(true);
    setSelectedAccionId(null);
    setCobros([]);
    setForm(initialForm);
    setErrors({});
    setMessage(null);

    CobrosServices.getAccionesByServicio(tipoServicio).then((res) => {
      setLoadingAcciones(false);
      if (!res.ok) {
        setAcciones([]);
        toast.error(res.message || 'No se pudieron cargar las acciones');
        return;
      }
      setAcciones(res.data ?? []);
    });
  }, [tipoServicio]);

  const loadCobrosAccion = async (accionId) => {
    if (!accionId) {
      setCobros([]);
      return;
    }

    setErrors({});
    setMessage(null);
    setForm(initialForm);
    setLoadingCobros(true);

    const response = await CobrosServices.getCobrosByAccion(accionId);
    setLoadingCobros(false);

    if (!response.ok) {
      setCobros([]);
      setMessage({ type: 'error', text: response.message });
      return;
    }

    setCobros(Array.isArray(response.data) ? response.data : []);
  };

  const handleSelectAccion = ({ target: { value } }) => {
    setSelectedAccionId(value);
    loadCobrosAccion(value);
  };

  const selectedAccionObj = useMemo(
    () => acciones.find((a) => a.value === selectedAccionId) || null,
    [acciones, selectedAccionId],
  );

  const selectedCobros = useMemo(
    () => cobros.filter((cobro) => form.cobros.includes(cobro.id)),
    [cobros, form.cobros],
  );

  const totalSeleccionado = useMemo(
    () =>
      selectedCobros.reduce((total, cobro) => total + Number(cobro.saldo), 0),
    [selectedCobros],
  );

  const toggleCobro = (id) => {
    setForm((prev) => ({
      ...prev,
      cobros: prev.cobros.includes(id)
        ? prev.cobros.filter((cobroId) => cobroId !== id)
        : [...prev.cobros, id],
    }));
    setErrors((prev) => ({ ...prev, cobros: undefined }));
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validatePagoCobro(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setPendingPago(validation.data);
  };

  const confirmPago = async () => {
    if (!pendingPago) return;

    setSaving(true);
    const response = await CobrosServices.pagar(pendingPago);
    setSaving(false);

    if (!response.ok) {
      setPendingPago(null);
      setMessage({ type: 'error', text: response.message });
      toast.error(response.message);
      return;
    }

    const pagoData = pendingPago;
    setPendingPago(null);

    if (response.data) {
      imprimirRecibo(response.data);
    }

    if (pagoData.metodo_pago === 'QR') {
      setQrPago({ ...response, monto: pagoData.monto });
      return;
    }

    const successText = response.message || 'Pago registrado correctamente';
    setMessage({ type: 'success', text: successText });
    toast.success(successText);
    await loadCobrosAccion(selectedAccionId);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Cobros por Acción</h2>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona un servicio y una acción para consultar sus cobros
          pendientes y registrar el pago.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
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
            placeholder={
              loadingAcciones
                ? 'Cargando acciones...'
                : 'Buscar y seleccionar acción...'
            }
            value={selectedAccionId}
            onChange={handleSelectAccion}
            options={acciones}
            isDisabled={loadingAcciones}
          />
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircleIcon className="h-5 w-5 shrink-0" />
          ) : (
            <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <CobrosPendientes
          socio={
            selectedAccionObj
              ? { nombre_completo: selectedAccionObj.label }
              : null
          }
          cobros={cobros}
          selectedIds={form.cobros}
          loading={loadingCobros}
          error={errors.cobros}
          onToggle={toggleCobro}
        />

        <div className="space-y-5">
          <ResumenCobro
            cantidad={form.cobros.length}
            total={totalSeleccionado}
          />
          <FormularioPago
            form={form}
            errors={errors}
            saving={saving}
            disabled={!selectedAccionId}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <ConfirmModal
        open={Boolean(pendingPago)}
        title="Confirmar pago"
        message={
          pendingPago ? `¿Confirmar pago de Bs ${pendingPago.monto}?` : ''
        }
        confirmText="Confirmar pago"
        loading={saving}
        onConfirm={confirmPago}
        onClose={() => setPendingPago(null)}
      />

      <QrPagoModal pago={qrPago} onClose={() => setQrPago(null)} />
    </div>
  );
}
