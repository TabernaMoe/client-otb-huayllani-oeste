import { useEffect, useMemo, useState } from 'react';
import {
  BanknotesIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { CobrosAguaServices } from '../services/cobrosAgua.services';
import { validatePagoAgua } from '../schema/cobrosAgua.schema';

const formatMoney = (value) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(Number(value || 0));

const normalizeArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.rows)) return response.rows;
  if (Array.isArray(response?.items)) return response.items;

  return [];
};

const getAccionId = (accion) =>
  Number(
    accion?.accion_id ??
      accion?.id ??
      accion?.codigo_accion ??
      0,
  );

const getCobroId = (cobro) =>
  Number(
    cobro?.cobro_agua_id ??
      cobro?.id ??
      0,
  );

const getNombreCompleto = (accion) =>
  accion?.nombre_completo ||
  [
    accion?.nombres,
    accion?.primer_apellido,
    accion?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(' ') ||
  'Socio sin nombre';

const getCobrosFromResponse = (response) => {
  const data = response?.data || response?.dato || response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.cobrosAccion)) return data.cobrosAccion;
  if (Array.isArray(data?.cobrosAgua)) return data.cobrosAgua;
  if (Array.isArray(data?.cobros_agua)) return data.cobros_agua;
  if (Array.isArray(data?.cobros)) return data.cobros;
  if (Array.isArray(data?.lecturas)) return data.lecturas;

  return [];
};

const getHistorialFromResponse = (response) => {
  const data = response?.data || response?.dato || response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.cobrosAccion)) return data.cobrosAccion;
  if (Array.isArray(data?.historial)) return data.historial;
  if (Array.isArray(data?.cobrosAgua)) return data.cobrosAgua;
  if (Array.isArray(data?.cobros_agua)) return data.cobros_agua;
  if (Array.isArray(data?.lecturas)) return data.lecturas;

  return [];
};

const getSaldo = (cobro) =>
  Number(
    cobro?.saldo ??
      cobro?.saldo_pendiente ??
      cobro?.monto_total ??
      0,
  );

const getMontoTotal = (cobro) =>
  Number(
    cobro?.monto_total ??
      cobro?.precio ??
      cobro?.monto ??
      0,
  );

const getMontoPagado = (cobro) =>
  Number(
    cobro?.monto_pagado ??
      cobro?.pagado ??
      0,
  );

const getEstadoClass = (estado) => {
  const normalized = String(estado || '').toUpperCase();

  if (normalized === 'PAGADO') {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (normalized === 'PARCIAL') {
    return 'bg-amber-50 text-amber-700';
  }

  if (normalized === 'ANULADO') {
    return 'bg-red-50 text-red-700';
  }

  return 'bg-blue-50 text-blue-700';
};

const openPdfBlob = (blob, filename = 'recibo-agua.pdf') => {
  if (!(blob instanceof Blob)) return;

  const pdfUrl = URL.createObjectURL(blob);

  const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');

  if (!newWindow) {
    const link = document.createElement('a');

    link.href = pdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  window.setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 60_000);
};

export default function CobrosAguaPage() {
  const [acciones, setAcciones] = useState([]);
  const [selectedAccion, setSelectedAccion] = useState(null);
  const [cobrosAgua, setCobrosAgua] = useState([]);
  const [selectedCobro, setSelectedCobro] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [loadingAcciones, setLoadingAcciones] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    accion_id: '',
    cobro_agua_id: '',
    monto: '',
    metodo_pago: 'QR',
    observacion: '',
    saldo: 0,
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const fetchAcciones = async () => {
    setLoadingAcciones(true);

    const response = await CobrosAguaServices.getAll(
      page,
      limit,
      debouncedSearch,
    );

    setLoadingAcciones(false);

    if (!response?.ok) {
      setAcciones([]);
      setTotalPages(1);
      setMessage(
        response?.message ||
          'No se pudieron cargar los cobros de agua',
      );
      setMessageType('error');
      return;
    }

    setAcciones(normalizeArray(response));
    setTotalPages(Number(response?.totalPages || 1));
  };

  useEffect(() => {
    fetchAcciones();
  }, [page, limit, debouncedSearch]);

  const selectAccion = async (accion) => {
    const accionId = getAccionId(accion);

    if (!accionId) {
      setMessage('La acción seleccionada no tiene un identificador válido');
      setMessageType('error');
      return;
    }

    setSelectedAccion(accion);
    setCobrosAgua([]);
    setSelectedCobro(null);
    setErrors({});
    setMessage('');

    setForm({
      accion_id: accionId,
      cobro_agua_id: '',
      monto: '',
      metodo_pago: 'QR',
      observacion: '',
      saldo: 0,
    });

    setLoadingDetalle(true);

    const response =
      await CobrosAguaServices.getByAccionId(accionId);

    setLoadingDetalle(false);

    if (!response?.ok) {
      setMessage(
        response?.message ||
          'No se pudieron cargar los cobros de esta acción',
      );
      setMessageType('error');
      return;
    }

    const detalle = response?.data || response?.dato || {};

    setSelectedAccion({
      ...accion,
      ...(typeof detalle === 'object' && !Array.isArray(detalle)
        ? detalle
        : {}),
      id: accionId,
      accion_id: accionId,
    });

    setCobrosAgua(getCobrosFromResponse(response));
  };

  const selectCobro = (cobro) => {
    const cobroId = getCobroId(cobro);
    const saldo = getSaldo(cobro);

    if (!cobroId) {
      setMessage('El cobro seleccionado no tiene un ID válido');
      setMessageType('error');
      return;
    }

    setSelectedCobro(cobro);

    setForm((previous) => ({
      ...previous,
      cobro_agua_id: cobroId,
      monto: saldo > 0 ? String(saldo) : '',
      saldo,
    }));

    setErrors({});
    setMessage('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setMessage('');
  };

  const totalPendiente = useMemo(
    () =>
      cobrosAgua.reduce(
        (total, cobro) => total + getSaldo(cobro),
        0,
      ),
    [cobrosAgua],
  );

  const handlePagar = async (event) => {
    event.preventDefault();

    const validation = validatePagoAgua(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const confirmed = window.confirm(
      `¿Confirmar el pago de ${formatMoney(
        validation.data.monto,
      )}?`,
    );

    if (!confirmed) return;

    setSaving(true);

    const response = await CobrosAguaServices.pagar(
      validation.data.accion_id,
      validation.data,
    );

    setSaving(false);

    if (!response?.ok) {
      setMessage(
        response?.message ||
          'No se pudo registrar el pago de agua',
      );
      setMessageType('error');
      return;
    }

    setMessage(
      response?.message ||
        'Pago de agua registrado correctamente',
    );
    setMessageType('success');

    if (response?.pdfBlob) {
      openPdfBlob(response.pdfBlob, response.filename);
    }

    const currentAccion = selectedAccion;

    setSelectedCobro(null);
    setForm((previous) => ({
      ...previous,
      cobro_agua_id: '',
      monto: '',
      observacion: '',
      saldo: 0,
    }));

    if (currentAccion) {
      await selectAccion(currentAccion);
    }

    await fetchAcciones();
  };

  const handleHistorial = async () => {
    const accionId = getAccionId(selectedAccion);

    if (!accionId) return;

    setShowHistorial(true);
    setHistorial([]);
    setLoadingHistorial(true);

    const response =
      await CobrosAguaServices.getHistorial(accionId);

    setLoadingHistorial(false);

    if (!response?.ok) {
      setMessage(
        response?.message ||
          'No se pudo cargar el historial de agua',
      );
      setMessageType('error');
      return;
    }

    setHistorial(getHistorialFromResponse(response));
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">
            <BanknotesIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Cobros de agua
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Busca una acción, selecciona una lectura pendiente y
              registra su pago.
            </p>
          </div>
        </div>
      </header>

      {message && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            messageType === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.5fr]">
        <aside className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="relative mb-5">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por socio, medidor o dirección..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-3">
            {loadingAcciones ? (
              <p className="py-10 text-center text-sm text-slate-500">
                Cargando acciones...
              </p>
            ) : acciones.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">
                No se encontraron acciones con cobros de agua.
              </p>
            ) : (
              acciones.map((accion) => {
                const accionId = getAccionId(accion);
                const isSelected =
                  getAccionId(selectedAccion) === accionId;

                return (
                  <button
                    key={accionId}
                    type="button"
                    onClick={() => selectAccion(accion)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
                        <UserIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-800">
                          {getNombreCompleto(accion)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Acción:{' '}
                          {accion.codigo_interno ||
                            accionId ||
                            '-'}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Medidor: {accion.nro_medidor || '-'}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {accion.direccion || 'Sin dirección'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={page <= 1 || loadingAcciones}
              onClick={() =>
                setPage((previous) => Math.max(1, previous - 1))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="text-xs font-semibold text-slate-500">
              Página {page} de {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loadingAcciones}
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1),
                )
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </aside>

        <main className="rounded-3xl bg-white p-5 shadow-sm">
          {!selectedAccion ? (
            <div className="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500">
                Selecciona una acción para revisar sus cobros de agua.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {getNombreCompleto(selectedAccion)}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Medidor: {selectedAccion.nro_medidor || '-'}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Calle: {selectedAccion.nombre_calle || '-'}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Tarifa: {selectedAccion.nombre_tarifa || '-'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
                    <p className="text-xs font-bold text-blue-700">
                      Total pendiente
                    </p>

                    <p className="text-xl font-black text-blue-900">
                      {formatMoney(totalPendiente)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleHistorial}
                    className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                  >
                    <ClockIcon className="h-5 w-5" />
                    Historial
                  </button>
                </div>
              </div>

              {loadingDetalle ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Cargando cobros...
                </p>
              ) : cobrosAgua.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  Esta acción no tiene cobros pendientes o parciales.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {cobrosAgua.map((cobro) => {
                    const cobroId = getCobroId(cobro);
                    const isSelected =
                      getCobroId(selectedCobro) === cobroId;
                    const estado =
                      cobro.estado || 'PENDIENTE';

                    return (
                      <button
                        key={cobroId}
                        type="button"
                        onClick={() => selectCobro(cobro)}
                        className={`rounded-3xl border p-5 text-left transition ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-800">
                              {cobro.concepto ||
                                cobro.descripcion ||
                                `Cobro de agua #${cobroId}`}
                            </p>

                            {cobro.concepto &&
                              cobro.descripcion && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {cobro.descripcion}
                                </p>
                              )}
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getEstadoClass(
                              estado,
                            )}`}
                          >
                            {estado}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              Monto total
                            </span>
                            <strong className="text-slate-800">
                              {formatMoney(getMontoTotal(cobro))}
                            </strong>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-slate-500">
                              Pagado
                            </span>
                            <strong className="text-slate-800">
                              {formatMoney(getMontoPagado(cobro))}
                            </strong>
                          </div>

                          <div className="flex justify-between gap-4 border-t border-slate-100 pt-2">
                            <span className="font-bold text-slate-700">
                              Saldo
                            </span>
                            <strong className="text-lg text-blue-800">
                              {formatMoney(getSaldo(cobro))}
                            </strong>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <form
                onSubmit={handlePagar}
                className="space-y-5 rounded-3xl bg-slate-50 p-5"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Registrar pago
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Selecciona una deuda de agua antes de registrar el
                    pago.
                  </p>
                </div>

                {errors.cobro_agua_id && (
                  <p className="text-sm font-semibold text-red-600">
                    {errors.cobro_agua_id}
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Método de pago
                    </label>

                    <select
                      name="metodo_pago"
                      value={form.metodo_pago}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="QR">QR</option>
                      <option value="EFECTIVO">EFECTIVO</option>
                      <option value="TRANSFERENCIA">
                        TRANSFERENCIA
                      </option>
                    </select>

                    {errors.metodo_pago && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.metodo_pago}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Monto a pagar
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="monto"
                      value={form.monto}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.monto && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.monto}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Observación
                  </label>

                  <textarea
                    name="observacion"
                    value={form.observacion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Observación opcional..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                  />

                  {errors.observacion && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.observacion}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving || !selectedCobro}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CreditCardIcon className="h-5 w-5" />

                  {saving
                    ? 'Registrando pago...'
                    : 'Confirmar pago y generar recibo'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {showHistorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Historial de cobros de agua
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {getNombreCompleto(selectedAccion)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHistorial(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              {loadingHistorial ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Cargando historial...
                </p>
              ) : historial.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  No existen registros en el historial.
                </p>
              ) : (
                <div className="space-y-3">
                  {historial.map((item, index) => {
                    const id =
                      getCobroId(item) ||
                      `${item.periodo_id || 'historial'}-${index}`;

                    return (
                      <article
                        key={id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                          <div>
                            <p className="font-bold text-slate-800">
                              {item.concepto ||
                                item.descripcion ||
                                `Registro #${index + 1}`}
                            </p>

                            {item.periodo && (
                              <p className="mt-1 text-sm text-slate-500">
                                Periodo: {item.periodo}
                              </p>
                            )}

                            {item.observacion && (
                              <p className="mt-1 text-sm text-slate-500">
                                {item.observacion}
                              </p>
                            )}
                          </div>

                          <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${getEstadoClass(
                              item.estado,
                            )}`}
                          >
                            {item.estado || 'PENDIENTE'}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">
                              Total
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {formatMoney(getMontoTotal(item))}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">
                              Pagado
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {formatMoney(getMontoPagado(item))}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">
                              Saldo
                            </p>
                            <p className="mt-1 font-bold text-blue-800">
                              {formatMoney(getSaldo(item))}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-100 p-5">
              <button
                type="button"
                onClick={() => setShowHistorial(false)}
                className="rounded-2xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}