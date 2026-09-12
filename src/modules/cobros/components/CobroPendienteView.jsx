import { useEffect, useMemo, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CobrosServices } from '../services/cobros.services';
import { validatePagoCobro } from '../schema/cobros.schema';
import SocioSelector from './SocioSelector';
import CobrosPendientes from './CobrosPendientes';
import ResumenCobro from './ResumenCobro';
import FormularioPago from './FormularioPago';
import QrPagoModal from './QrPagoModal';

const initialForm = {
  socio_id: '',
  monto: '',
  cobros: [],
  metodo_pago: 'EFECTIVO',
};

export default function CobroPendienteView({ tipoCobro, title, description }) {
  const [socios, setSocios] = useState([]);
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [cobros, setCobros] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingSocios, setLoadingSocios] = useState(false);
  const [loadingCobros, setLoadingCobros] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [qrPago, setQrPago] = useState(null);

  const loadSocios = async (value = search) => {
    setLoadingSocios(true);
    const response = await CobrosServices.getSocios({
      page: 1,
      limit: 100,
      search: value.trim(),
    });
    setLoadingSocios(false);

    if (!response.ok) {
      setSocios([]);
      setMessage({ type: 'error', text: response.message });
      return;
    }

    setSocios(response.data);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => loadSocios(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const openSocio = async (socio) => {
    setSelectedSocio(socio);
    setCobros([]);
    setErrors({});
    setMessage(null);
    setForm({ ...initialForm, socio_id: socio.id });
    setLoadingCobros(true);

    const response = await CobrosServices.getSocioCobros(socio.id);
    setLoadingCobros(false);

    if (!response.ok) {
      setMessage({ type: 'error', text: response.message });
      return;
    }

    setSelectedSocio({ ...socio, ...response.data });
    setCobros(response.data.cobrosSocio.filter((cobro) => cobro.tipo_cobro === tipoCobro));
  };

  const selectedCobros = useMemo(
    () => cobros.filter((cobro) => form.cobros.includes(cobro.id)),
    [cobros, form.cobros],
  );

  const totalSeleccionado = useMemo(
    () => selectedCobros.reduce((total, cobro) => total + Number(cobro.saldo), 0),
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validatePagoCobro(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!window.confirm(`¿Confirmar pago de Bs ${validation.data.monto}?`)) return;

    setSaving(true);
    const response = await CobrosServices.pagar(validation.data);
    setSaving(false);

    if (!response.ok) {
      setMessage({ type: 'error', text: response.message });
      return;
    }

    if (validation.data.metodo_pago === 'QR') {
      setQrPago({ ...response, monto: validation.data.monto });
      return;
    }

    setMessage({ type: 'success', text: response.message });
    await openSocio(selectedSocio);
    await loadSocios();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
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
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <ExclamationCircleIcon className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)_300px]">
        <SocioSelector
          socios={socios}
          selectedSocio={selectedSocio}
          loading={loadingSocios}
          search={search}
          onSearchChange={setSearch}
          onSelect={openSocio}
        />

        <CobrosPendientes
          socio={selectedSocio}
          cobros={cobros}
          selectedIds={form.cobros}
          loading={loadingCobros}
          error={errors.cobros}
          onToggle={toggleCobro}
        />

        <div className="space-y-5">
          <ResumenCobro cantidad={form.cobros.length} total={totalSeleccionado} />
          <FormularioPago
            form={form}
            errors={errors}
            saving={saving}
            disabled={!selectedSocio}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <QrPagoModal pago={qrPago} onClose={() => setQrPago(null)} />
    </div>
  );
}
