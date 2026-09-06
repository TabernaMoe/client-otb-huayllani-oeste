import { useEffect, useMemo, useState } from 'react';

import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import { CobrosServices } from '../services/cobros.services';

import { validatePagoCobro } from '../schema/cobros.schema';

import SocioSelector from '../components/SocioSelector';

import ResumenCobro from '../components/ResumenCobro';

import FormularioPago from '../components/FormularioPago';

import QrPagoModal from '../components/QrPagoModal';

import {
  formatMoney,
  getCobroId,
  getCobroSaldo,
  getSocioCi,
  getSocioId,
  getSocioInitials,
  getSocioName,
  groupCobrosByAccion,
} from '../utils/cobros.utils';

export default function CobrarAccionesView() {
  // =========================================================
  // SOCIOS
  // =========================================================

  const [socios, setSocios] = useState([]);

  const [selectedSocio, setSelectedSocio] = useState(null);

  // =========================================================
  // COBROS DEL SOCIO
  // =========================================================

  const [cobros, setCobros] = useState([]);

  // =========================================================
  // BUSCADOR
  // =========================================================

  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // =========================================================
  // GRUPOS ABIERTOS
  // =========================================================

  const [openGroups, setOpenGroups] = useState({});

  // =========================================================
  // LOADING
  // =========================================================

  const [loadingSocios, setLoadingSocios] = useState(false);

  const [loadingCobros, setLoadingCobros] = useState(false);

  const [saving, setSaving] = useState(false);

  // =========================================================
  // QR
  // =========================================================

  const [qrPago, setQrPago] = useState(null);

  const [qrModalOpen, setQrModalOpen] = useState(false);

  // =========================================================
  // FORMULARIO
  // =========================================================

  const [form, setForm] = useState({
    socio_id: '',

    monto: '',

    cobros: [],

    metodo_pago: 'QR',
  });

  // =========================================================
  // ERRORES ZOD
  // =========================================================

  const [errors, setErrors] = useState({});

  // =========================================================
  // MENSAJE GENERAL
  // =========================================================

  const [message, setMessage] = useState('');

  const [messageType, setMessageType] = useState('success');

  // =========================================================
  // DEBOUNCE DEL BUSCADOR
  // =========================================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  // =========================================================
  // CARGAR SOCIOS
  // =========================================================

  const fetchSocios = async () => {
    try {
      setLoadingSocios(true);

      const params = {
        page: 1,

        limit: 100,

        search: debouncedSearch,
      };

      const response = await CobrosServices.getSocios(params);

      if (!response?.ok) {
        setSocios([]);

        setMessage(response?.message || 'No se pudieron cargar los socios');

        setMessageType('error');

        return;
      }

      setSocios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('ERROR CARGANDO SOCIOS:', error);

      setSocios([]);

      setMessage(error?.message || 'Ocurrió un error al cargar los socios');

      setMessageType('error');
    } finally {
      setLoadingSocios(false);
    }
  };

  // =========================================================
  // EJECUTAR BÚSQUEDA
  // =========================================================

  useEffect(() => {
    fetchSocios();
  }, [debouncedSearch]);

  // =========================================================
  // SELECCIONAR SOCIO
  // =========================================================

  const openSocio = async (socio) => {
    const socioId = getSocioId(socio);

    if (!socioId) {
      setMessage('El socio seleccionado no tiene un ID válido');

      setMessageType('error');

      return;
    }

    // -------------------------------------------------------
    // GUARDAMOS SOCIO SELECCIONADO
    // -------------------------------------------------------

    setSelectedSocio(socio);

    // -------------------------------------------------------
    // LIMPIAMOS DATOS ANTERIORES
    // -------------------------------------------------------

    setCobros([]);

    setErrors({});

    setMessage('');

    setOpenGroups({});

    // -------------------------------------------------------
    // REINICIAMOS FORMULARIO
    // -------------------------------------------------------

    setForm({
      socio_id: socioId,

      monto: '',

      cobros: [],

      metodo_pago: 'QR',
    });

    try {
      setLoadingCobros(true);

      // -----------------------------------------------------
      // GET /admin/cobro/:socioId
      // -----------------------------------------------------

      const response = await CobrosServices.getSocioCobros(socioId);

      if (!response?.ok) {
        setMessage(
          response?.message || 'No se pudieron cargar los cobros del socio',
        );

        setMessageType('error');

        return;
      }

      const data = response?.data || {};

      // -----------------------------------------------------
      // EL BACKEND DEVUELVE cobrosSocio
      // -----------------------------------------------------

      const listaCobros = Array.isArray(data?.cobrosSocio)
        ? data.cobrosSocio
        : Array.isArray(data?.cobros)
          ? data.cobros
          : [];

      // -----------------------------------------------------
      // ACTUALIZAMOS DATOS DEL SOCIO
      // -----------------------------------------------------

      setSelectedSocio({
        ...socio,

        ...data,

        socio_id: socioId,
      });

      // -----------------------------------------------------
      // GUARDAMOS COBROS
      // -----------------------------------------------------

      setCobros(listaCobros);

      // -----------------------------------------------------
      // AGRUPAMOS POR ACCIÓN
      // -----------------------------------------------------

      const grupos = groupCobrosByAccion(listaCobros);

      // -----------------------------------------------------
      // ABRIMOS TODOS LOS GRUPOS AL INICIO
      // -----------------------------------------------------

      const initialOpen = {};

      grupos.forEach((group) => {
        initialOpen[group.codigo] = true;
      });

      setOpenGroups(initialOpen);
    } catch (error) {
      console.error('ERROR CARGANDO COBROS:', error);

      setMessage(error?.message || 'Ocurrió un error al cargar los cobros');

      setMessageType('error');
    } finally {
      setLoadingCobros(false);
    }
  };

  // =========================================================
  // COBROS AGRUPADOS POR ACCIÓN
  // =========================================================

  const cobrosAgrupados = useMemo(() => {
    return groupCobrosByAccion(cobros);
  }, [cobros]);

  // =========================================================
  // COBROS SELECCIONADOS
  // =========================================================

  const selectedCobros = useMemo(() => {
    return cobros.filter((cobro) => {
      const cobroId = getCobroId(cobro);

      return form.cobros.includes(cobroId);
    });
  }, [cobros, form.cobros]);

  // =========================================================
  // TOTAL SELECCIONADO
  // =========================================================

  const totalSeleccionado = useMemo(() => {
    return selectedCobros.reduce((total, cobro) => {
      return total + getCobroSaldo(cobro);
    }, 0);
  }, [selectedCobros]);

  // =========================================================
  // TOTAL PENDIENTE DEL SOCIO
  // =========================================================

  const totalPendiente = useMemo(() => {
    return cobros.reduce((total, cobro) => {
      return total + getCobroSaldo(cobro);
    }, 0);
  }, [cobros]);

  // =========================================================
  // ABRIR / CERRAR UNA ACCIÓN
  // =========================================================

  const toggleGroup = (codigo) => {
    setOpenGroups((previous) => ({
      ...previous,

      [codigo]: !previous[codigo],
    }));
  };

  // =========================================================
  // SELECCIONAR UN COBRO
  // =========================================================

  const toggleCobro = (cobro) => {
    const cobroId = getCobroId(cobro);

    if (!cobroId) {
      setMessage('El cobro seleccionado no tiene un ID válido');

      setMessageType('error');

      return;
    }

    setForm((previous) => {
      // ---------------------------------------------------
      // ¿YA ESTÁ SELECCIONADO?
      // ---------------------------------------------------

      const existe = previous.cobros.includes(cobroId);

      // ---------------------------------------------------
      // NUEVA LISTA
      // ---------------------------------------------------

      const nuevosCobros = existe
        ? previous.cobros.filter((id) => id !== cobroId)
        : [...previous.cobros, cobroId];

      // ---------------------------------------------------
      // CALCULAR NUEVO TOTAL
      // ---------------------------------------------------

      const nuevoTotal = cobros

        .filter((item) => {
          const itemId = getCobroId(item);

          return nuevosCobros.includes(itemId);
        })

        .reduce((total, item) => {
          return total + getCobroSaldo(item);
        }, 0);

      return {
        ...previous,

        cobros: nuevosCobros,

        monto: String(nuevoTotal),
      };
    });

    // -------------------------------------------------------
    // LIMPIAR ERRORES
    // -------------------------------------------------------

    setErrors((previous) => ({
      ...previous,

      cobros: undefined,

      monto: undefined,
    }));

    setMessage('');
  };

  // =========================================================
  // SELECCIONAR TODOS LOS COBROS DE UNA ACCIÓN
  // =========================================================

  const toggleCobrosAccion = (group) => {
    // -------------------------------------------------------
    // OBTENER IDS DEL GRUPO
    // -------------------------------------------------------

    const ids = group.cobros

      .map((cobro) => getCobroId(cobro))

      .filter(Boolean);

    if (ids.length === 0) {
      return;
    }

    // -------------------------------------------------------
    // VERIFICAR SI TODOS YA ESTÁN MARCADOS
    // -------------------------------------------------------

    const todosSeleccionados = ids.every((id) => form.cobros.includes(id));

    setForm((previous) => {
      // ---------------------------------------------------
      // QUITAR O AGREGAR TODOS
      // ---------------------------------------------------

      const nuevosCobros = todosSeleccionados
        ? previous.cobros.filter((id) => !ids.includes(id))
        : Array.from(new Set([...previous.cobros, ...ids]));

      // ---------------------------------------------------
      // RECALCULAR TOTAL
      // ---------------------------------------------------

      const nuevoTotal = cobros

        .filter((item) => {
          const itemId = getCobroId(item);

          return nuevosCobros.includes(itemId);
        })

        .reduce((total, item) => {
          return total + getCobroSaldo(item);
        }, 0);

      return {
        ...previous,

        cobros: nuevosCobros,

        monto: String(nuevoTotal),
      };
    });

    setErrors((previous) => ({
      ...previous,

      cobros: undefined,

      monto: undefined,
    }));

    setMessage('');
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================
  //
  // Funciona con:
  //
  // ElegantInput
  // SelectComponent
  //
  // porque ambos mandan:
  //
  // event.target.name
  // event.target.value
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: value,
    }));

    // -------------------------------------------------------
    // QUITAR ERROR DEL CAMPO
    // -------------------------------------------------------

    setErrors((previous) => ({
      ...previous,

      [name]: undefined,
    }));

    setMessage('');
  };

  // =========================================================
  // POST - REGISTRAR PAGO
  // =========================================================

  const handlePagar = async (event) => {
    event.preventDefault();

    // ======================================================
    // 1. VALIDAR CON ZOD
    // ======================================================

    const validation = validatePagoCobro(form);

    // ======================================================
    // 2. SI HAY ERRORES
    // ======================================================

    if (!validation.isValid) {
      setErrors(validation.errors);

      setMessage('Revise los datos del pago');

      setMessageType('error');

      return;
    }

    // ======================================================
    // 3. CONFIRMAR
    // ======================================================

    const confirmPay = window.confirm(
      `¿Confirmar pago por ${formatMoney(validation.data.monto)}?`,
    );

    if (!confirmPay) {
      return;
    }

    try {
      setSaving(true);

      setMessage('');

      // ====================================================
      // 4. POST
      // ====================================================

      const response = await CobrosServices.pagar(validation.data);

      // ====================================================
      // 5. ERROR DEL BACKEND
      // ====================================================

      if (!response?.ok) {
        setMessage(response?.message || 'No se pudo registrar el pago');

        setMessageType('error');

        return;
      }

      setErrors({});

      // ====================================================
      // 6. SI ES QR
      // ====================================================

      if (validation.data.metodo_pago === 'QR') {
        if (!response?.qrImage) {
          setMessage('El servidor no devolvió la imagen del QR');

          setMessageType('warning');

          return;
        }

        setQrPago(response);

        setQrModalOpen(true);

        return;
      }

      // ====================================================
      // 7. EFECTIVO
      // ====================================================

      setMessage(response?.message || 'Pago registrado correctamente');

      setMessageType('success');

      // ----------------------------------------------------
      // RECARGAR COBROS DEL SOCIO
      // ----------------------------------------------------

      if (selectedSocio) {
        await openSocio(selectedSocio);
      }

      // ----------------------------------------------------
      // RECARGAR SOCIOS
      // ----------------------------------------------------

      await fetchSocios();
    } catch (error) {
      console.error('ERROR REGISTRANDO PAGO:', error);

      setMessage(error?.message || 'Ocurrió un error al registrar el pago');

      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CERRAR QR
  // =========================================================

  const closeQrModal = () => {
    setQrModalOpen(false);

    setQrPago(null);
  };

  // =========================================================
  // CLASE DEL MENSAJE
  // =========================================================

  const messageClasses =
    messageType === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : messageType === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <>
      {/* =====================================================
          PASOS
      ====================================================== */}

      <div className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
          <StepItem
            number="1"
            label="Buscar socio"
            active={!selectedSocio}
            completed={Boolean(selectedSocio)}
          />

          <StepItem
            number="2"
            label="Deudas pendientes"
            active={Boolean(selectedSocio)}
            completed={form.cobros.length > 0}
          />

          <StepItem
            number="3"
            label="Seleccionar conceptos"
            active={form.cobros.length > 0}
            completed={form.cobros.length > 0}
          />

          <StepItem
            number="4"
            label="Registrar pago"
            active={form.cobros.length > 0}
            completed={false}
          />
        </div>
      </div>

      {/* =====================================================
          MENSAJE
      ====================================================== */}

      {message && (
        <div
          className={`
            mb-5
            flex items-start
            gap-2
            rounded-xl
            border
            px-4 py-3
            text-sm
            font-medium
            ${messageClasses}
          `}
        >
          {messageType === 'error' ? (
            <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <span>{message}</span>
        </div>
      )}

      {/* =====================================================
          GRID PRINCIPAL
      ====================================================== */}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_300px]">
        {/* ===================================================
            IZQUIERDA - SOCIOS
        ==================================================== */}

        <SocioSelector
          socios={socios}
          selectedSocio={selectedSocio}
          loading={loadingSocios}
          search={search}
          onSearchChange={setSearch}
          onSelect={openSocio}
        />

        {/* ===================================================
            CENTRO - ACCIONES Y COBROS
        ==================================================== */}

        <main className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {!selectedSocio ? (
            // =================================================
            // SIN SOCIO
            // =================================================

            <div className="flex min-h-140 items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <UserIcon className="h-8 w-8" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Selecciona un socio
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Elige un socio para revisar sus acciones y cobros pendientes.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* =============================================
                  CABECERA SOCIO
              ============================================== */}

              <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-base font-bold text-emerald-700">
                      {getSocioInitials(selectedSocio) || 'S'}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {getSocioName(selectedSocio)}
                      </h2>

                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>CI: {getSocioCi(selectedSocio)}</span>

                        <span>{cobrosAgrupados.length} acciones con deuda</span>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL PENDIENTE */}

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Total pendiente
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-800">
                      {formatMoney(totalPendiente)}
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  LISTADO COBROS
              ============================================== */}

              <div className="p-5 lg:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                    2
                  </span>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Deudas pendientes del socio
                    </h3>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Selecciona los conceptos que deseas cobrar.
                    </p>
                  </div>
                </div>

                {/* ===========================================
                    LOADING
                ============================================ */}

                {loadingCobros ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Cargando cobros...
                    </p>
                  </div>
                ) : cobrosAgrupados.length === 0 ? (
                  // ===========================================
                  // SIN DEUDAS
                  // ===========================================

                  <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
                    <CheckCircleIcon className="mx-auto h-10 w-10 text-emerald-500" />

                    <h3 className="mt-3 font-bold text-slate-800">
                      Sin cobros pendientes
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Este socio no tiene deudas registradas.
                    </p>
                  </div>
                ) : (
                  // ===========================================
                  // GRUPOS DE ACCIONES
                  // ===========================================

                  <div className="space-y-4">
                    {cobrosAgrupados.map((group) => {
                      const isOpen = openGroups[group.codigo];

                      const ids = group.cobros

                        .map((cobro) => getCobroId(cobro))

                        .filter(Boolean);

                      const selectedCount = ids.filter((id) =>
                        form.cobros.includes(id),
                      ).length;

                      const allSelected =
                        ids.length > 0 && selectedCount === ids.length;

                      return (
                        <div
                          key={group.codigo}
                          className="overflow-hidden rounded-xl border border-slate-200"
                        >
                          {/* =================================
                                HEADER ACCIÓN
                            ================================== */}

                          <div className="flex flex-col gap-3 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <button
                              type="button"
                              onClick={() => toggleGroup(group.codigo)}
                              className="flex min-w-0 items-center gap-3 text-left"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
                                {isOpen ? (
                                  <ChevronDownIcon className="h-5 w-5" />
                                ) : (
                                  <ChevronRightIcon className="h-5 w-5" />
                                )}
                              </span>

                              <div className="min-w-0">
                                <p className="truncate font-bold text-slate-900">
                                  {group.titulo}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  {group.cobros.length} conceptos pendientes
                                </p>
                              </div>
                            </button>

                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                              {/* TOTAL ACCIÓN */}

                              <div className="text-right">
                                <p className="text-xs text-slate-500">
                                  Total acción
                                </p>

                                <p className="font-bold text-slate-900">
                                  {formatMoney(group.total)}
                                </p>
                              </div>

                              {/* SELECCIONAR TODO */}

                              <button
                                type="button"
                                onClick={() => toggleCobrosAccion(group)}
                                className={`
                                    rounded-lg
                                    border
                                    px-3 py-2
                                    text-xs
                                    font-semibold
                                    transition

                                    ${
                                      allSelected
                                        ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                        : 'border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                                    }
                                  `}
                              >
                                {allSelected
                                  ? 'Quitar todos'
                                  : 'Seleccionar acción'}
                              </button>
                            </div>
                          </div>

                          {/* =================================
                                DETALLES
                            ================================== */}

                          {isOpen && (
                            <div className="divide-y divide-slate-100">
                              {group.cobros.map((cobro, index) => {
                                const id = getCobroId(cobro);

                                const checked = form.cobros.includes(id);

                                return (
                                  <label
                                    key={id || `${group.codigo}-${index}`}
                                    className={`
                                          flex
                                          cursor-pointer
                                          items-start
                                          gap-4
                                          px-4 py-4
                                          transition

                                          ${
                                            checked
                                              ? 'bg-emerald-50/60'
                                              : 'bg-white hover:bg-slate-50'
                                          }
                                        `}
                                  >
                                    {/* CHECKBOX */}

                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      disabled={!id}
                                      onChange={() => toggleCobro(cobro)}
                                      className="mt-1 h-4 w-4 accent-emerald-700"
                                    />

                                    {/* DATOS */}

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                        <div>
                                          <p className="font-semibold text-slate-900">
                                            {cobro.concepto ||
                                              cobro.nombre ||
                                              'Cobro pendiente'}
                                          </p>

                                          <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {cobro.descripcion ||
                                              'Sin descripción'}
                                          </p>

                                          {cobro.nro_medidor && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                              <MapPinIcon className="h-3.5 w-3.5" />
                                              Medidor: {cobro.nro_medidor}
                                            </p>
                                          )}
                                        </div>

                                        {/* MONTO */}

                                        <div className="shrink-0 text-left sm:text-right">
                                          <p className="text-xs text-slate-500">
                                            Saldo pendiente
                                          </p>

                                          <p className="mt-1 text-lg font-bold text-emerald-700">
                                            {formatMoney(getCobroSaldo(cobro))}
                                          </p>

                                          <p className="mt-1 text-xs text-slate-400">
                                            Pagado:{' '}
                                            {formatMoney(cobro.monto_pagado)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ===========================================
                    ERROR COBROS
                ============================================ */}

                {errors.cobros && (
                  <p className="mt-4 flex items-center gap-1 text-sm font-medium text-red-600">
                    <ExclamationCircleIcon className="h-4 w-4" />

                    {errors.cobros}
                  </p>
                )}
              </div>
            </>
          )}
        </main>

        {/* ===================================================
            DERECHA
        ==================================================== */}

        <aside className="space-y-4">
          {/* RESUMEN */}

          <ResumenCobro
            cantidad={form.cobros.length}
            total={totalSeleccionado}
          />

          {/* FORMULARIO */}

          {selectedSocio && (
            <FormularioPago
              form={form}
              errors={errors}
              saving={saving}
              onChange={handleChange}
              onSubmit={handlePagar}
            />
          )}

          {/* INFORMACIÓN */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h4 className="text-sm font-bold text-blue-900">Información</h4>

            <p className="mt-1 text-xs leading-5 text-blue-800/80">
              Selecciona uno o varios conceptos. El monto se calcula
              automáticamente según los saldos pendientes.
            </p>
          </div>
        </aside>
      </div>

      {/* =====================================================
          QR MODAL
      ====================================================== */}

      <QrPagoModal open={qrModalOpen} pago={qrPago} onClose={closeQrModal} />
    </>
  );
}

/**
 * ============================================================
 * PASO DEL PROCESO
 * ============================================================
 */
function StepItem({ number, label, active, completed }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <span
        className={`
          flex h-8 w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          text-xs
          font-bold

          ${
            completed
              ? 'bg-emerald-700 text-white'
              : active
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
          }
        `}
      >
        {completed ? <CheckCircleIcon className="h-5 w-5" /> : number}
      </span>

      <span
        className={`
          text-xs
          font-semibold

          ${active || completed ? 'text-slate-800' : 'text-slate-400'}
        `}
      >
        {label}
      </span>
    </div>
  );
}
