import { useEffect, useMemo, useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  MapPinIcon,
  BanknotesIcon,
  SignalIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CreditCardIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import { AccionesServices } from '../services/acciones.services';
import { CallesServices } from '../../calles/services/calles.services';
import { validateAccionForm } from '../schema/acciones.schema';

const initialForm = {
  socio_id: '',
  calle_id: '',
  tarifa_id: '',
  nro_medidor: '',
  direccion: '',
  observacion: '',
  estado: 'ACTIVO',
  detallesAccion: [],
};

/**
 * Obtiene el ID de una opción.
 *
 * Selects del backend:
 * {
 *   value: 1,
 *   label: '...'
 * }
 *
 * Calles:
 * {
 *   id: 1,
 *   nombre_calle: '...'
 * }
 */
const getOptionId = (item) => {
  if (item === null || item === undefined) {
    return null;
  }

  if (typeof item === 'number') {
    return item;
  }

  if (typeof item === 'string') {
    const value = Number(item);

    return Number.isFinite(value) ? value : null;
  }

  const value = item?.value ?? item?.id;

  const numericValue = Number(value);

  return Number.isFinite(numericValue)
    ? numericValue
    : null;
};

/**
 * Los socios del endpoint:
 *
 * GET /admin/accion/socios
 *
 * vienen como:
 *
 * {
 *   value: 1,
 *   label: '123456 - Nombre completo'
 * }
 */
const getSocioLabel = (socio) =>
  socio?.label ||
  socio?.nombre_completo ||
  `Socio ${socio?.value ?? socio?.id ?? ''}`;

/**
 * Las calles vienen del módulo Calles.
 */
const getCalleLabel = (calle) =>
  calle?.nombre_calle ||
  calle?.label ||
  `Calle ${calle?.id ?? calle?.value ?? ''}`;

/**
 * Las tarifas de Acción vienen preparadas
 * para utilizarse en un select.
 */
const getTarifaLabel = (tarifa) =>
  tarifa?.label ||
  tarifa?.nombre_tarifa ||
  `Tarifa ${tarifa?.value ?? tarifa?.id ?? ''}`;

/**
 * Los detalles también vienen como:
 *
 * {
 *   value: 2,
 *   label: 'Carnet socio'
 * }
 */
const getDetalleLabel = (detalle) =>
  detalle?.label ||
  detalle?.nombre_accion ||
  detalle?.nombre_detalle_accion ||
  `Detalle ${detalle?.value ?? detalle?.id ?? ''}`;

const inputClass = (hasError = false) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

export default function AccionModal({
  open,
  selected,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(initialForm);

  /**
   * ==============================
   * CATÁLOGOS
   * ==============================
   */

  const [socios, setSocios] = useState([]);

  const [calles, setCalles] = useState([]);

  const [tarifas, setTarifas] = useState([]);

  const [tiposAccion, setTiposAccion] = useState([]);

  const [detalles, setDetalles] = useState([]);

  /**
   * El tipo de acción NO forma parte del payload
   * final según la documentación.
   *
   * Lo utilizamos solamente para consultar:
   *
   * /detalle-accion/:tipoAccionId
   */
  const [tipoAccionId, setTipoAccionId] = useState('');

  /**
   * ==============================
   * SOCIOS
   * ==============================
   */

  const [socioSearch, setSocioSearch] = useState('');

  const [showSocios, setShowSocios] = useState(false);

  /**
   * ==============================
   * INTERFAZ
   * ==============================
   */

  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(false);

  const [loadingSelects, setLoadingSelects] = useState(false);

  const [loadingDetalles, setLoadingDetalles] = useState(false);

  const [resolvingTipo, setResolvingTipo] = useState(false);

  const [message, setMessage] = useState('');

  /**
   * ============================================================
   * CARGAR SELECTS PRINCIPALES
   * ============================================================
   */
  const loadSelects = async () => {
    try {
      setLoadingSelects(true);

      setMessage('');

      const [
        sociosRes,
        callesRes,
        tarifasRes,
        tiposRes,
      ] = await Promise.all([
        AccionesServices.getSocios(),

        /**
         * Calles pertenece a CallesServices.
         *
         * Solicitamos una cantidad amplia para utilizar
         * el listado como select.
         *
         * Lo ideal en el futuro sería tener:
         *
         * GET /admin/calle/select
         *
         * documentado específicamente.
         */
        CallesServices.getAll(
          1,
          1000,
          '',
          true,
        ),

        AccionesServices.getTarifas(),

        AccionesServices.getTiposAccion(),
      ]);

      const erroresCarga = [];

      if (!sociosRes?.ok) {
        erroresCarga.push(
          sociosRes?.message ||
            'Error al cargar socios',
        );
      }

      if (!callesRes?.ok) {
        erroresCarga.push(
          callesRes?.message ||
            'Error al cargar calles',
        );
      }

      if (!tarifasRes?.ok) {
        erroresCarga.push(
          tarifasRes?.message ||
            'Error al cargar tarifas',
        );
      }

      if (!tiposRes?.ok) {
        erroresCarga.push(
          tiposRes?.message ||
            'Error al cargar tipos de acción',
        );
      }

      if (erroresCarga.length > 0) {
        setMessage(
          erroresCarga.join('. '),
        );
      }

      setSocios(
        Array.isArray(sociosRes?.data)
          ? sociosRes.data
          : [],
      );

      setCalles(
        Array.isArray(callesRes?.data)
          ? callesRes.data
          : [],
      );

      setTarifas(
        Array.isArray(tarifasRes?.data)
          ? tarifasRes.data
          : [],
      );

      setTiposAccion(
        Array.isArray(tiposRes?.data)
          ? tiposRes.data
          : [],
      );
    } finally {
      setLoadingSelects(false);
    }
  };

  /**
   * ============================================================
   * ABRIR MODAL
   * ============================================================
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setMessage('');

    setErrors({});

    setShowSocios(false);

    loadSelects();
  }, [open]);

  /**
   * ============================================================
   * CREAR / EDITAR
   * ============================================================
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    /**
     * EDITAR
     */
    if (selected) {
      const detalleIds =
        Array.isArray(selected.detallesAccion)
          ? selected.detallesAccion
              .map((item) => getOptionId(item))
              .filter(Boolean)
          : [];

      setForm({
        socio_id:
          selected.socio_id ?? '',

        calle_id:
          selected.calle_id ?? '',

        tarifa_id:
          selected.tarifa_id ?? '',

        nro_medidor:
          selected.nro_medidor ?? '',

        direccion:
          selected.direccion ?? '',

        observacion:
          selected.observacion ?? '',

        estado:
          selected.estado ?? 'ACTIVO',

        detallesAccion: detalleIds,
      });

      /**
       * El GET /accion/:id no devuelve,
       * según la documentación actual,
       * el tipo de acción.
       *
       * Más abajo intentaremos descubrirlo
       * utilizando detallesAccion.
       */
      setTipoAccionId('');

      setDetalles([]);

      setSocioSearch('');

      return;
    }

    /**
     * CREAR
     */
    setForm(initialForm);

    setSocioSearch('');

    setTipoAccionId('');

    setDetalles([]);
  }, [open, selected]);

  /**
   * ============================================================
   * MOSTRAR NOMBRE DEL SOCIO AL EDITAR
   * ============================================================
   *
   * El GET /accion/:id devuelve socio_id.
   *
   * Buscamos dicho ID dentro del catálogo
   * cargado por /accion/socios.
   */
  useEffect(() => {
    if (
      !open ||
      !selected ||
      socios.length === 0
    ) {
      return;
    }

    const socioId = Number(
      selected.socio_id,
    );

    const socioEncontrado = socios.find(
      (socio) =>
        getOptionId(socio) === socioId,
    );

    if (socioEncontrado) {
      setSocioSearch(
        getSocioLabel(socioEncontrado),
      );
      return;
    }

    /**
     * Fallback por si el socio no aparece
     * en el catálogo.
     */
    setSocioSearch(
      selected.nombre_completo || '',
    );
  }, [socios, selected, open]);

  /**
   * ============================================================
   * DESCUBRIR EL TIPO DE ACCIÓN AL EDITAR
   * ============================================================
   *
   * Problema:
   *
   * GET /accion/:id devuelve:
   *
   * detallesAccion: [2]
   *
   * pero NO devuelve tipo_accion_id.
   *
   * Para poder mostrar correctamente el formulario
   * consultamos los detalles de cada tipo hasta
   * encontrar a cuál pertenecen los detalles actuales.
   */
  useEffect(() => {
    if (
      !open ||
      !selected ||
      tiposAccion.length === 0 ||
      tipoAccionId
    ) {
      return;
    }

    const detalleIds =
      Array.isArray(selected.detallesAccion)
        ? selected.detallesAccion
            .map((item) => getOptionId(item))
            .filter(Boolean)
        : [];

    if (detalleIds.length === 0) {
      return;
    }

    let cancelled = false;

    const resolverTipoAccion = async () => {
      try {
        setResolvingTipo(true);

        for (const tipo of tiposAccion) {
          const id = getOptionId(tipo);

          if (!id) {
            continue;
          }

          const response =
            await AccionesServices.getDetallesAccion(
              id,
            );

          if (!response?.ok) {
            continue;
          }

          const detallesTipo =
            Array.isArray(response.data)
              ? response.data
              : [];

          const idsTipo = detallesTipo
            .map((detalle) =>
              getOptionId(detalle),
            )
            .filter(Boolean);

          /**
           * Comprobamos que todos los detalles
           * asignados pertenezcan al tipo.
           */
          const perteneceAlTipo =
            detalleIds.every((detalleId) =>
              idsTipo.includes(detalleId),
            );

          if (perteneceAlTipo) {
            if (!cancelled) {
              setTipoAccionId(
                String(id),
              );
            }

            return;
          }
        }
      } finally {
        if (!cancelled) {
          setResolvingTipo(false);
        }
      }
    };

    resolverTipoAccion();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    selected,
    tiposAccion,
    tipoAccionId,
  ]);

  /**
   * ============================================================
   * CARGAR DETALLES SEGÚN TIPO
   * ============================================================
   */
  useEffect(() => {
    /**
     * Evitamos hacer:
     *
     * GET /detalle-accion/
     *
     * sin ID.
     */
    if (!open || !tipoAccionId) {
      setDetalles([]);

      return;
    }

    let cancelled = false;

    const fetchDetalles = async () => {
      try {
        setLoadingDetalles(true);

        const response =
          await AccionesServices.getDetallesAccion(
            tipoAccionId,
          );

        if (!response?.ok) {
          if (!cancelled) {
            setDetalles([]);

            setMessage(
              response?.message ||
                'No se pudieron cargar los detalles de la acción',
            );
          }

          return;
        }

        if (!cancelled) {
          setDetalles(
            Array.isArray(response.data)
              ? response.data
              : [],
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDetalles(false);
        }
      }
    };

    fetchDetalles();

    return () => {
      cancelled = true;
    };
  }, [open, tipoAccionId]);

  /**
   * ============================================================
   * INPUTS GENERALES
   * ============================================================
   */
  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((prev) => ({
      ...prev,

      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,

      [name]: '',
    }));

    setMessage('');
  };

  /**
   * ============================================================
   * CAMBIAR TIPO DE ACCIÓN
   * ============================================================
   */
  const handleTipoAccionChange = (
    event,
  ) => {
    const value = event.target.value;

    setTipoAccionId(value);

    /**
     * Si cambia de tipo, los detalles
     * seleccionados anteriormente ya no
     * deberían permanecer.
     */
    setForm((prev) => ({
      ...prev,

      detallesAccion: [],
    }));

    setDetalles([]);

    setErrors((prev) => ({
      ...prev,

      tipo_accion: '',

      detallesAccion: '',
    }));

    setMessage('');
  };

  /**
   * ============================================================
   * CERRAR
   * ============================================================
   */
  const handleClose = () => {
    if (saving) {
      return;
    }

    setShowSocios(false);

    onClose();
  };

  /**
   * ============================================================
   * SELECCIONAR SOCIO
   * ============================================================
   */
  const selectSocio = (socio) => {
    const id = getOptionId(socio);

    if (!id) {
      return;
    }

    setForm((prev) => ({
      ...prev,

      socio_id: id,
    }));

    setSocioSearch(
      getSocioLabel(socio),
    );

    setShowSocios(false);

    setErrors((prev) => ({
      ...prev,

      socio_id: '',
    }));
  };

  /**
   * ============================================================
   * AGREGAR / QUITAR DETALLE
   * ============================================================
   */
  const toggleDetalle = (id) => {
    const detalleId = Number(id);

    if (!detalleId) {
      return;
    }

    setForm((prev) => ({
      ...prev,

      detallesAccion:
        prev.detallesAccion.includes(
          detalleId,
        )
          ? prev.detallesAccion.filter(
              (item) =>
                item !== detalleId,
            )
          : [
              ...prev.detallesAccion,
              detalleId,
            ],
    }));

    setErrors((prev) => ({
      ...prev,

      detallesAccion: '',
    }));
  };

  /**
   * ============================================================
   * GUARDAR
   * ============================================================
   */
  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    const validation =
      validateAccionForm(form);

    const newErrors = {
      ...validation.errors,
    };

    /**
     * El tipo no se envía al backend,
     * pero sí es necesario en la interfaz
     * para seleccionar los detalles.
     */
    if (!tipoAccionId) {
      newErrors.tipo_accion =
        'Seleccione un tipo de acción';
    }

    if (
      !validation.isValid ||
      !tipoAccionId
    ) {
      setErrors(newErrors);

      setMessage(
        'Revise los campos marcados antes de guardar la acción.',
      );

      return;
    }

    try {
      setSaving(true);

      setMessage('');

      /**
       * El schema nos entrega el payload.
       *
       * NO enviamos tipoAccionId porque
       * la API no lo solicita.
       */
      const payload = {
        ...validation.data,
      };

      const response = selected
        ? await AccionesServices.update(
            selected.id,
            payload,
          )
        : await AccionesServices.create(
            payload,
          );

      if (!response?.ok) {
        setMessage(
          response?.message ||
            'Error al guardar la acción',
        );

        return;
      }

      onSaved();
    } finally {
      setSaving(false);
    }
  };

  /**
   * ============================================================
   * FILTRAR SOCIOS
   * ============================================================
   *
   * El label contiene CI + nombre,
   * por lo que podemos buscar directamente
   * sobre el label.
   */
  const sociosFiltrados = useMemo(() => {
    const texto = socioSearch
      .toLowerCase()
      .trim();

    if (!texto) {
      return socios.slice(0, 20);
    }

    return socios.filter((socio) =>
      getSocioLabel(socio)
        .toLowerCase()
        .includes(texto),
    );
  }, [socios, socioSearch]);

  /**
   * Detalles seleccionados.
   */
  const detallesAsignados = useMemo(
    () =>
      detalles.filter((detalle) =>
        form.detallesAccion.includes(
          getOptionId(detalle),
        ),
      ),
    [detalles, form.detallesAccion],
  );

  /**
   * Detalles todavía disponibles.
   */
  const detallesDisponibles = useMemo(
    () =>
      detalles.filter(
        (detalle) =>
          !form.detallesAccion.includes(
            getOptionId(detalle),
          ),
      ),
    [detalles, form.detallesAccion],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-[2px] sm:p-5"
      aria-label="Cerrar modal"
    >
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================= ENCABEZADO ================= */}

        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
              <CreditCardIcon className="h-6 w-6" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Acciones</span>

                <span>/</span>

                <span className="text-emerald-700">
                  {selected
                    ? 'Editar'
                    : 'Nueva'}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {selected
                  ? 'Editar acción'
                  : 'Registrar nueva acción'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete los datos de conexión y asigne los conceptos
                correspondientes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_310px]">

              {/* ================= FORMULARIO ================= */}

              <div className="space-y-6 p-5 sm:p-7">
                {message && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />

                    <p className="font-medium">
                      {message}
                    </p>
                  </div>
                )}

                {loadingSelects && (
                  <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />

                    Cargando socios, calles, tarifas y tipos de acción...
                  </div>
                )}

                {/* ================= SOCIO ================= */}

                <section>
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      1
                    </span>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Información del socio
                      </h3>

                      <p className="mt-0.5 text-sm text-slate-500">
                        Seleccione el socio propietario de la acción.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Socio

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={socioSearch}
                        disabled={Boolean(selected)}
                        placeholder="Buscar socio por nombre o CI"
                        onFocus={() => {
                          if (!selected) {
                            setShowSocios(true);
                          }
                        }}
                        onChange={(event) => {
                          setSocioSearch(
                            event.target.value,
                          );

                          setShowSocios(true);

                          setForm((prev) => ({
                            ...prev,

                            socio_id: '',
                          }));

                          setErrors((prev) => ({
                            ...prev,

                            socio_id: '',
                          }));
                        }}
                        className={`${inputClass(
                          Boolean(
                            errors.socio_id,
                          ),
                        )} pl-11 pr-11 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`}
                      />

                      {!selected && (
                        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      )}
                    </div>

                    {showSocios &&
                      !selected && (
                        <div className="absolute left-0 right-0 z-40 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                          {sociosFiltrados.length ===
                          0 ? (
                            <div className="px-4 py-5 text-center">
                              <UserIcon className="mx-auto h-7 w-7 text-slate-300" />

                              <p className="mt-2 text-sm text-slate-500">
                                No se encontraron socios
                              </p>
                            </div>
                          ) : (
                            sociosFiltrados.map(
                              (socio) => {
                                const id =
                                  getOptionId(
                                    socio,
                                  );

                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() =>
                                      selectSocio(
                                        socio,
                                      )
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-emerald-50"
                                  >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                                      {getSocioLabel(
                                        socio,
                                      )
                                        .split(
                                          ' ',
                                        )
                                        .filter(
                                          Boolean,
                                        )
                                        .slice(
                                          0,
                                          2,
                                        )
                                        .map(
                                          (
                                            item,
                                          ) =>
                                            item
                                              .charAt(
                                                0,
                                              )
                                              .toUpperCase(),
                                        )
                                        .join(
                                          '',
                                        )}
                                    </span>

                                    <span className="block text-sm font-semibold text-slate-800">
                                      {getSocioLabel(
                                        socio,
                                      )}
                                    </span>
                                  </button>
                                );
                              },
                            )
                          )}
                        </div>
                      )}

                    {errors.socio_id && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                        <ExclamationCircleIcon className="h-4 w-4" />

                        {errors.socio_id}
                      </p>
                    )}
                  </div>
                </section>

                <div className="border-t border-slate-100" />

                {/* ================= CONEXIÓN ================= */}

                <section>
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      2
                    </span>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Datos de la conexión
                      </h3>

                      <p className="mt-0.5 text-sm text-slate-500">
                        Registre la ubicación, tarifa y número de medidor.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* CALLE */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Calle

                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <MapPinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <select
                          name="calle_id"
                          value={form.calle_id}
                          onChange={handleChange}
                          className={`${inputClass(
                            Boolean(
                              errors.calle_id,
                            ),
                          )} appearance-none pl-11 pr-10`}
                        >
                          <option value="">
                            Seleccionar calle
                          </option>

                          {calles.map(
                            (calle) => {
                              const id =
                                getOptionId(
                                  calle,
                                );

                              return (
                                <option
                                  key={id}
                                  value={id}
                                >
                                  {getCalleLabel(
                                    calle,
                                  )}
                                </option>
                              );
                            },
                          )}
                        </select>

                        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>

                      {errors.calle_id && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          {errors.calle_id}
                        </p>
                      )}
                    </div>

                    {/* TARIFA */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Tarifa

                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <BanknotesIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <select
                          name="tarifa_id"
                          value={form.tarifa_id}
                          onChange={handleChange}
                          className={`${inputClass(
                            Boolean(
                              errors.tarifa_id,
                            ),
                          )} appearance-none pl-11 pr-10`}
                        >
                          <option value="">
                            Seleccionar tarifa
                          </option>

                          {tarifas.map(
                            (tarifa) => {
                              const id =
                                getOptionId(
                                  tarifa,
                                );

                              return (
                                <option
                                  key={id}
                                  value={id}
                                >
                                  {getTarifaLabel(
                                    tarifa,
                                  )}
                                </option>
                              );
                            },
                          )}
                        </select>

                        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>

                      {errors.tarifa_id && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          {errors.tarifa_id}
                        </p>
                      )}
                    </div>

                    {/* MEDIDOR */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Número de medidor

                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <SignalIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          name="nro_medidor"
                          value={
                            form.nro_medidor
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Ej. 321"
                          className={`${inputClass(
                            Boolean(
                              errors.nro_medidor,
                            ),
                          )} pl-11`}
                        />
                      </div>

                      {errors.nro_medidor && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          {
                            errors.nro_medidor
                          }
                        </p>
                      )}
                    </div>

                    {/* ESTADO */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Estado

                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </label>

                      <div className="relative">
                        <CheckCircleIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <select
                          name="estado"
                          value={form.estado}
                          onChange={handleChange}
                          className={`${inputClass(
                            Boolean(
                              errors.estado,
                            ),
                          )} appearance-none pl-11 pr-10`}
                        >
                          <option value="ACTIVO">
                            ACTIVO
                          </option>

                          <option value="PASIVO">
                            PASIVO
                          </option>

                          <option value="ANULADO">
                            ANULADO
                          </option>
                        </select>

                        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    {/* DIRECCIÓN */}

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Dirección
                      </label>

                      <div className="relative">
                        <MapPinIcon className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />

                        <input
                          name="direccion"
                          value={
                            form.direccion
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Ej. Calle principal, lote 15"
                          className={`${inputClass(
                            Boolean(
                              errors.direccion,
                            ),
                          )} pl-11`}
                        />
                      </div>
                    </div>

                    {/* OBSERVACIÓN */}

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Observación
                      </label>

                      <div className="relative">
                        <DocumentTextIcon className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />

                        <textarea
                          name="observacion"
                          value={
                            form.observacion
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Ingrese una observación adicional"
                          rows="3"
                          className={`${inputClass()} resize-none pl-11`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="border-t border-slate-100" />

                {/* ================= TIPO ACCIÓN ================= */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tipo de acción

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <CreditCardIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <select
                      value={tipoAccionId}
                      onChange={
                        handleTipoAccionChange
                      }
                      disabled={
                        loadingSelects ||
                        resolvingTipo
                      }
                      className={`${inputClass(
                        Boolean(
                          errors.tipo_accion,
                        ),
                      )} appearance-none pl-11 pr-10 disabled:bg-slate-100`}
                    >
                      <option value="">
                        Seleccionar tipo de acción
                      </option>

                      {tiposAccion.map(
                        (tipo) => {
                          const id =
                            getOptionId(
                              tipo,
                            );

                          return (
                            <option
                              key={id}
                              value={id}
                            >
                              {tipo.label}
                            </option>
                          );
                        },
                      )}
                    </select>

                    <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {errors.tipo_accion && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.tipo_accion}
                    </p>
                  )}

                  {resolvingTipo && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />

                      Identificando tipo de acción...
                    </p>
                  )}
                </div>

                {/* ================= DETALLES ================= */}

                <section>
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      3
                    </span>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Detalles de la acción
                      </h3>

                      <p className="mt-0.5 text-sm text-slate-500">
                        Seleccione los conceptos asociados al tipo de acción.
                      </p>
                    </div>
                  </div>

                  {errors.detallesAccion && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      <ExclamationCircleIcon className="h-5 w-5" />

                      {
                        errors.detallesAccion
                      }
                    </div>
                  )}

                  {!tipoAccionId ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <CreditCardIcon className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        Seleccione primero un tipo de acción
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Los detalles disponibles dependen del tipo seleccionado.
                      </p>
                    </div>
                  ) : loadingDetalles ? (
                    <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-8 text-sm font-medium text-blue-700">
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />

                      Cargando detalles...
                    </div>
                  ) : (
                    <div className="grid gap-5 xl:grid-cols-2">

                      {/* DISPONIBLES */}

                      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              Disponibles
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              Agregue conceptos a la acción
                            </p>
                          </div>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                            {
                              detallesDisponibles.length
                            }
                          </span>
                        </div>

                        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                          {detallesDisponibles.length ===
                          0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
                              <CheckCircleIcon className="mx-auto h-7 w-7 text-emerald-500" />

                              <p className="mt-2 text-sm font-medium text-slate-500">
                                No hay más detalles disponibles
                              </p>
                            </div>
                          ) : (
                            detallesDisponibles.map(
                              (detalle) => {
                                const id =
                                  getOptionId(
                                    detalle,
                                  );

                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() =>
                                      toggleDetalle(
                                        id,
                                      )
                                    }
                                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                        <CreditCardIcon className="h-4 w-4" />
                                      </span>

                                      <span>
                                        <span className="block text-sm font-semibold text-slate-800">
                                          {getDetalleLabel(
                                            detalle,
                                          )}
                                        </span>

                                        <span className="mt-0.5 block text-xs text-slate-500">
                                          Agregar a la acción
                                        </span>
                                      </span>
                                    </div>

                                    <span className="rounded-full bg-emerald-50 p-1.5 text-emerald-700">
                                      <PlusIcon className="h-4 w-4" />
                                    </span>
                                  </button>
                                );
                              },
                            )
                          )}
                        </div>
                      </div>

                      {/* ASIGNADOS */}

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-emerald-800">
                              Asignados
                            </p>

                            <p className="mt-0.5 text-xs text-emerald-700/70">
                              Conceptos incluidos en la acción
                            </p>
                          </div>

                          <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
                            {
                              detallesAsignados.length
                            }
                          </span>
                        </div>

                        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                          {detallesAsignados.length ===
                          0 ? (
                            <div className="rounded-lg border border-dashed border-emerald-300 bg-white/70 p-6 text-center">
                              <CreditCardIcon className="mx-auto h-7 w-7 text-emerald-300" />

                              <p className="mt-2 text-sm font-medium text-slate-500">
                                No hay detalles asignados
                              </p>
                            </div>
                          ) : (
                            detallesAsignados.map(
                              (detalle) => {
                                const id =
                                  getOptionId(
                                    detalle,
                                  );

                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() =>
                                      toggleDetalle(
                                        id,
                                      )
                                    }
                                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-white p-3 text-left transition hover:border-red-200 hover:bg-red-50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                        <CheckCircleIcon className="h-5 w-5" />
                                      </span>

                                      <span>
                                        <span className="block text-sm font-semibold text-slate-800">
                                          {getDetalleLabel(
                                            detalle,
                                          )}
                                        </span>

                                        <span className="mt-0.5 block text-xs text-emerald-700">
                                          Incluido en la acción
                                        </span>
                                      </span>
                                    </div>

                                    <span className="rounded-full bg-red-50 p-1.5 text-red-600">
                                      <MinusIcon className="h-4 w-4" />
                                    </span>
                                  </button>
                                );
                              },
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* ================= RESUMEN ================= */}

              <aside className="border-t border-slate-200 bg-slate-50/70 p-5 lg:border-l lg:border-t-0 lg:p-6">
                <div className="sticky top-0 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900">
                      Resumen de la acción
                    </h3>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="rounded-full bg-emerald-50 p-2 text-emerald-700">
                          <UserIcon className="h-4 w-4" />
                        </span>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-400">
                            Socio
                          </p>

                          <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                            {socioSearch ||
                              'Sin seleccionar'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="rounded-full bg-blue-50 p-2 text-blue-700">
                          <SignalIcon className="h-4 w-4" />
                        </span>

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Medidor
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-slate-800">
                            {form.nro_medidor ||
                              'Sin registrar'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="rounded-full bg-amber-50 p-2 text-amber-700">
                          <CheckCircleIcon className="h-4 w-4" />
                        </span>

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Estado
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-slate-800">
                            {form.estado}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Detalles asignados
                        </span>

                        <span className="text-xl font-bold text-emerald-700">
                          {
                            form
                              .detallesAccion
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-white p-2 text-blue-700">
                        <DocumentTextIcon className="h-4 w-4" />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-blue-900">
                          Información
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-blue-800/80">
                          Los campos marcados con un asterisco son
                          obligatorios. Revise los datos antes de guardar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* ================= BOTONES ================= */}

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingSelects ||
                loadingDetalles ||
                resolvingTipo
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />

                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />

                  {selected
                    ? 'Guardar cambios'
                    : 'Registrar acción'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}