import { useEffect, useMemo, useState } from 'react';
import {
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import ElegantInput from '../../../components/ElegantInput';
import SelectComponent from '../../../components/Select';
import { validatePagoAlcantarillado } from '../schema/cobrosAlcantarillado.schema';
import { CobrosAlcantarilladoServices as Servs } from '../services/cobrosAlcantarillado.services';
import SocioAlcantarilladoSelector from './SocioAlcantarilladoSelector';
import CobrosPendientes from './CobrosPendientes';
import ResumenCobro from './ResumenCobro';

const initialForm = {
  monto: '',
  cobros: [],
  metodo_pago: 'EFECTIVO',
};

const metodoOptions = [{ value: 'EFECTIVO', label: 'Efectivo' }];

const normalizeSocio = (item) => {
  const rawLabel = String(
    item?.label ?? item?.nombre_completo ?? item?.nombre ?? '',
  ).trim();

  const id = Number(item?.value ?? item?.id ?? item?.socio_id);
  const separatorIndex = rawLabel.indexOf(' - ');

  let ci = String(item?.ci ?? item?.ci_socio ?? '').trim();
  let nombre = rawLabel;

  if (!ci && separatorIndex > 0) {
    const possibleCi = rawLabel.slice(0, separatorIndex).trim();
    if (/^[\dA-Za-z.-]+$/.test(possibleCi)) {
      ci = possibleCi;
      nombre = rawLabel.slice(separatorIndex + 3).trim();
    }
  }

  return {
    id,
    ci,
    nombre_completo: nombre || rawLabel || `Socio ${id}`,
  };
};

export default function CobroAlcantarilladoView() {
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

  const loadSocios = async () => {
    setLoadingSocios(true);
    const response = await Servs.getSocios();
    setLoadingSocios(false);

    if (!response.ok) {
      setSocios([]);
      setMessage({
        type: 'error',
        text: response.message || 'No se pudieron cargar los socios.',
      });
      return;
    }

    const normalized = (response.data || [])
      .map(normalizeSocio)
      .filter((item) => Number.isFinite(item.id));

    setSocios(normalized);
  };

  useEffect(() => {
    loadSocios();
  }, []);

  const sociosFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return socios;

    return socios.filter((socio) =>
      `${socio.nombre_completo} ${socio.ci}`.toLowerCase().includes(term),
    );
  }, [socios, search]);

  const selectedCobros = useMemo(
    () => cobros.filter((cobro) => form.cobros.includes(cobro.id)),
    [cobros, form.cobros],
  );

  const totalSeleccionado = useMemo(
    () =>
      selectedCobros.reduce(
        (total, cobro) => total + Number(cobro.saldo || 0),
        0,
      ),
    [selectedCobros],
  );

  const openSocio = async (socio) => {
    setSelectedSocio(socio);
    setCobros([]);
    setErrors({});
    setMessage(null);
    setForm(initialForm);
    setLoadingCobros(true);

    const response = await Servs.getPendientesSocio(socio.id);
    setLoadingCobros(false);

    if (!response.ok) {
      setMessage({
        type: 'error',
        text: response.message || 'No se pudieron obtener los cobros pendientes.',
      });
      return;
    }

    setCobros(response.data || []);
  };

  const toggleCobro = (id) => {
    const selected = form.cobros.includes(id)
      ? form.cobros.filter((item) => item !== id)
      : [...form.cobros, id];

    const total = cobros
      .filter((item) => selected.includes(item.id))
      .reduce((sum, item) => sum + Number(item.saldo || 0), 0);

    setForm((prev) => ({
      ...prev,
      cobros: selected,
      monto: selected.length ? total.toFixed(2) : '',
    }));
    setErrors((prev) => ({ ...prev, cobros: undefined, monto: undefined }));
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validatePagoAlcantarillado(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!window.confirm(`¿Confirmar pago de Bs ${validation.data.monto}?`)) {
      return;
    }

    setSaving(true);
    const response = await Servs.pagar(validation.data);
    setSaving(false);

    if (!response.ok) {
      setMessage({ type: 'error', text: response.message });
      return;
    }

    setMessage({
      type: 'success',
      text: response.message || 'Pago de alcantarillado registrado correctamente.',
    });
    setForm(initialForm);
    await openSocio(selectedSocio);
    await loadSocios();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Cobrar alcantarillado
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona un socio y los conceptos de alcantarillado que deseas cobrar.
        </p>
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
        <SocioAlcantarilladoSelector
          socios={sociosFiltrados}
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
          <ResumenCobro
            cantidad={form.cobros.length}
            total={totalSeleccionado}
          />

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-slate-900">3. Registrar pago</h3>
            <div className="mt-5 space-y-4">
              <SelectComponent
                label="Método de pago"
                name="metodo_pago"
                options={metodoOptions}
                value={form.metodo_pago}
                onChange={handleChange}
                error={errors.metodo_pago}
                isDisabled
              />
              <ElegantInput
                label="Monto a pagar"
                name="monto"
                type="number"
                value={form.monto}
                onChange={handleChange}
                error={errors.monto}
                disabled={!selectedSocio || saving}
                placeholder="0.00"
                icon={<BanknotesIcon className="h-5 w-5" />}
                required
              />
              <button
                type="submit"
                disabled={!selectedSocio || saving || form.cobros.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Procesando...' : 'Registrar pago'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
