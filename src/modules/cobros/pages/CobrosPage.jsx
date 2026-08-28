import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  QrCodeIcon,
  UserGroupIcon,
  UserIcon,
  WalletIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  CobrosServices,
} from '../services/cobros.services';

/**
 * ============================================================
 * FUNCIONES DEL SCHEMA
 * ============================================================
 */
import {
  validateCobrosParams,
  validatePagoCobro,
  validateSocioCobroId,
} from '../schema/cobros.schema';

/**
 * ============================================================
 * FORMATEAR DINERO
 * ============================================================
 */
const formatMoney = (
  value,
) =>
  new Intl.NumberFormat(
    'es-BO',
    {
      style:
        'currency',

      currency:
        'BOB',
    },
  ).format(
    Number(
      value || 0,
    ),
  );

/**
 * ============================================================
 * OBTENER ID DEL SOCIO
 * ============================================================
 */
const getSocioId = (
  socio,
) => {
  const socioId =
    socio?.socio_id ??
    socio?.id_socio ??
    socio?.socio?.id ??
    socio?.id;

  return socioId
    ? Number(
        socioId,
      )
    : 0;
};

/**
 * ============================================================
 * NOMBRE COMPLETO
 * ============================================================
 */
const getSocioName = (
  socio,
) =>
  socio?.nombre_completo ||
  [
    socio?.nombres,
    socio?.primer_apellido,
    socio?.segundo_apellido,
  ]
    .filter(
      Boolean,
    )
    .join(' ') ||
  'Sin nombre';

/**
 * ============================================================
 * INICIALES
 * ============================================================
 */
const getSocioInitials = (
  socio,
) =>
  getSocioName(
    socio,
  )
    .split(' ')
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
          .charAt(0)
          .toUpperCase(),
    )
    .join('');

/**
 * ============================================================
 * CI
 * ============================================================
 */
const getSocioCi = (
  socio,
) =>
  socio?.ci_socio ||
  socio?.ci ||
  socio?.cedula_identidad ||
  '-';

/**
 * ============================================================
 * ID DEL COBRO
 * ============================================================
 */
const getCobroId = (
  cobro,
) => {
  const cobroId =
    cobro?.cobro_id ??
    cobro?.detalle_pago_accion_id ??
    cobro?.detalle_id ??
    cobro?.id;

  return cobroId
    ? Number(
        cobroId,
      )
    : 0;
};

/**
 * ============================================================
 * SALDO DEL COBRO
 * ============================================================
 */
const getCobroSaldo = (
  cobro,
) =>
  Number(
    cobro?.saldo ??
      cobro?.saldo_pendiente ??
      cobro?.monto_pendiente ??
      0,
  );

/**
 * ============================================================
 * CÓDIGO DE ACCIÓN
 * ============================================================
 */
const getCodigoAccion = (
  cobro,
) => {
  const codigo =
    cobro?.codigo_accion ??
    cobro?.codigo_interno ??
    cobro?.accion_codigo ??
    cobro?.accion_id;

  if (
    codigo !==
      undefined &&
    codigo !==
      null &&
    codigo !==
      ''
  ) {
    return String(
      codigo,
    );
  }

  /**
   * Fallback para descripciones como:
   *
   * "Cobro de accion del codigo 1"
   */
  const texto =
    String(
      cobro?.descripcion ||
        '',
    );

  const match =
    texto.match(
      /c[oó]digo\s+(\d+)/i,
    );

  return (
    match?.[1] ||
    'Sin código'
  );
};

/**
 * ============================================================
 * AGRUPAR COBROS POR ACCIÓN
 * ============================================================
 */
const groupCobrosByAccion = (
  cobros = [],
) => {
  const groups = {};

  cobros.forEach(
    (
      cobro,
    ) => {
      const codigo =
        getCodigoAccion(
          cobro,
        );

      if (
        !groups[codigo]
      ) {
        groups[codigo] = {
          codigo,

          titulo:
            codigo ===
            'Sin código'
              ? 'Acción sin código'
              : `Acción código ${codigo}`,

          cobros: [],

          total: 0,
        };
      }

      groups[
        codigo
      ].cobros.push(
        cobro,
      );

      groups[
        codigo
      ].total +=
        getCobroSaldo(
          cobro,
        );
    },
  );

  return Object.values(
    groups,
  );
};

/**
 * ============================================================
 * QR BASE64 -> SRC
 * ============================================================
 */
const getQrImageSrc = (
  qrImage,
) => {
  if (
    !qrImage
  ) {
    return '';
  }

  /**
   * Si backend ya devuelve:
   *
   * data:image/png;base64,...
   */
  if (
    qrImage.startsWith(
      'data:image',
    )
  ) {
    return qrImage;
  }

  /**
   * Si devuelve solamente Base64.
   */
  return `data:image/png;base64,${qrImage}`;
};

/**
 * ============================================================
 * CLASE INPUT
 * ============================================================
 */
const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50';

export default function CobrosPage() {
  /**
   * ============================================================
   * SOCIOS
   * ============================================================
   */
  const [
    socios,
    setSocios,
  ] = useState([]);

  const [
    selectedSocio,
    setSelectedSocio,
  ] = useState(
    null,
  );

  /**
   * ============================================================
   * COBROS
   * ============================================================
   */
  const [
    cobros,
    setCobros,
  ] = useState([]);

  /**
   * ============================================================
   * BÚSQUEDA
   * ============================================================
   */
  const [
    search,
    setSearch,
  ] = useState('');

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('');

  /**
   * ============================================================
   * GRUPOS ABIERTOS
   * ============================================================
   */
  const [
    openGroups,
    setOpenGroups,
  ] = useState({});

  /**
   * ============================================================
   * LOADING
   * ============================================================
   */
  const [
    loadingSocios,
    setLoadingSocios,
  ] = useState(false);

  const [
    loadingCobros,
    setLoadingCobros,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  /**
   * ============================================================
   * QR
   * ============================================================
   */
  const [
    qrPago,
    setQrPago,
  ] = useState(null);

  const [
    qrModalOpen,
    setQrModalOpen,
  ] = useState(false);

  /**
   * ============================================================
   * FORMULARIO
   * ============================================================
   */
  const [
    form,
    setForm,
  ] = useState({
    socio_id: '',

    monto: '',

    cobros: [],

    metodo_pago:
      'QR',
  });

  /**
   * ============================================================
   * ERRORES
   * ============================================================
   */
  const [
    errors,
    setErrors,
  ] = useState({});

  /**
   * ============================================================
   * MENSAJES
   * ============================================================
   */
  const [
    message,
    setMessage,
  ] = useState('');

  const [
    messageType,
    setMessageType,
  ] = useState(
    'success',
  );

  /**
   * ============================================================
   * DEBOUNCE DEL BUSCADOR
   * ============================================================
   */
  useEffect(() => {
    const timeout =
      window.setTimeout(
        () => {
          setDebouncedSearch(
            search.trim(),
          );
        },
        350,
      );

    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [
    search,
  ]);

  /**
   * ============================================================
   * CARGAR SOCIOS
   * ============================================================
   */
  const fetchSocios =
    async () => {
      /**
       * ========================================================
       * PASO 1
       * PREPARAMOS PARAMS
       * ========================================================
       */
      const params = {
        page:
          1,

        limit:
          100,

        search:
          debouncedSearch,
      };

      /**
       * ========================================================
       * PASO 2
       * VALIDAMOS PARAMS
       * ========================================================
       */
      const validation =
        validateCobrosParams(
          params,
        );

      if (
        !validation.isValid
      ) {
        setMessage(
          'Los parámetros de búsqueda no son válidos',
        );

        setMessageType(
          'error',
        );

        setSocios([]);

        return;
      }

      try {
        setLoadingSocios(
          true,
        );

        /**
         * ======================================================
         * PASO 3
         * GET /admin/cobro
         * ======================================================
         */
        const response =
          await CobrosServices.getSocios(
            validation.data,
          );

        if (
          !response?.ok
        ) {
          setMessage(
            response?.message ||
              'Error al cargar socios',
          );

          setMessageType(
            'error',
          );

          setSocios([]);

          return;
        }

        /**
         * Tu backend documentado devuelve:
         *
         * data: [...]
         */
        setSocios(
          Array.isArray(
            response.data,
          )
            ? response.data
            : [],
        );

      } catch (error) {
        setMessage(
          error?.message ||
            'Error inesperado al cargar socios',
        );

        setMessageType(
          'error',
        );

        setSocios([]);

      } finally {
        setLoadingSocios(
          false,
        );
      }
    };

  /**
   * ============================================================
   * BUSCAR SOCIOS
   * ============================================================
   */
  useEffect(() => {
    fetchSocios();
  }, [
    debouncedSearch,
  ]);

  /**
   * ============================================================
   * SELECCIONAR SOCIO
   * ============================================================
   */
  const openSocio =
    async (
      socio,
    ) => {
      /**
       * Obtenemos ID.
       */
      const rawSocioId =
        getSocioId(
          socio,
        );

      /**
       * ========================================================
       * PASO 1
       * VALIDAR ID
       * ========================================================
       */
      const validation =
        validateSocioCobroId(
          rawSocioId,
        );

      if (
        !validation.isValid
      ) {
        setMessage(
          validation.error,
        );

        setMessageType(
          'error',
        );

        return;
      }

      const socioId =
        validation.data;

      /**
       * ========================================================
       * PASO 2
       * LIMPIAR ESTADO ANTERIOR
       * ========================================================
       */
      setSelectedSocio(
        socio,
      );

      setCobros([]);

      setErrors({});

      setMessage('');

      setOpenGroups({});

      setForm({
        socio_id:
          socioId,

        monto: '',

        cobros: [],

        metodo_pago:
          'QR',
      });

      try {
        setLoadingCobros(
          true,
        );

        /**
         * ======================================================
         * PASO 3
         * GET /admin/cobro/:socioId
         * ======================================================
         */
        const response =
          await CobrosServices.getSocioCobros(
            socioId,
          );

        if (
          !response?.ok
        ) {
          setMessage(
            response?.message ||
              'No se pudieron cargar los cobros del socio',
          );

          setMessageType(
            'error',
          );

          return;
        }

        /**
         * Según tu documentación:
         *
         * response.data:
         *
         * {
         *   ci_socio,
         *   numero_celular,
         *   nombre_completo,
         *   cobrosSocio: [...]
         * }
         */
        const data =
          response?.data ||
          {};

        const cobrosSocio =
          data?.cobrosSocio ??
          data?.cobros ??
          [];

        /**
         * Actualizamos datos del socio.
         */
        setSelectedSocio({
          ...socio,

          ...data,

          socio_id:
            socioId,
        });

        /**
         * Guardamos cobros.
         */
        const listaCobros =
          Array.isArray(
            cobrosSocio,
          )
            ? cobrosSocio
            : [];

        setCobros(
          listaCobros,
        );

        /**
         * Abrimos todos los grupos.
         */
        const grouped =
          groupCobrosByAccion(
            listaCobros,
          );

        const initialOpen =
          {};

        grouped.forEach(
          (
            group,
          ) => {
            initialOpen[
              group.codigo
            ] = true;
          },
        );

        setOpenGroups(
          initialOpen,
        );

      } catch (error) {
        setMessage(
          error?.message ||
            'Error inesperado al cargar los cobros',
        );

        setMessageType(
          'error',
        );

      } finally {
        setLoadingCobros(
          false,
        );
      }
    };

  /**
   * ============================================================
   * COBROS AGRUPADOS
   * ============================================================
   */
  const cobrosAgrupados =
    useMemo(
      () =>
        groupCobrosByAccion(
          cobros,
        ),
      [
        cobros,
      ],
    );

  /**
   * ============================================================
   * COBROS SELECCIONADOS
   * ============================================================
   */
  const selectedCobros =
    useMemo(
      () =>
        cobros.filter(
          (
            cobro,
          ) =>
            form.cobros.includes(
              getCobroId(
                cobro,
              ),
            ),
        ),
      [
        cobros,
        form.cobros,
      ],
    );

  /**
   * ============================================================
   * TOTAL SELECCIONADO
   * ============================================================
   */
  const totalSeleccionado =
    useMemo(
      () =>
        selectedCobros.reduce(
          (
            sum,
            cobro,
          ) =>
            sum +
            getCobroSaldo(
              cobro,
            ),
          0,
        ),
      [
        selectedCobros,
      ],
    );

  /**
   * ============================================================
   * TOTAL PENDIENTE
   * ============================================================
   */
  const totalPendiente =
    useMemo(
      () =>
        cobros.reduce(
          (
            sum,
            cobro,
          ) =>
            sum +
            getCobroSaldo(
              cobro,
            ),
          0,
        ),
      [
        cobros,
      ],
    );

  /**
   * ============================================================
   * ABRIR / CERRAR GRUPO
   * ============================================================
   */
  const toggleGroup = (
    codigo,
  ) => {
    setOpenGroups(
      (
        previous,
      ) => ({
        ...previous,

        [codigo]:
          !previous[
            codigo
          ],
      }),
    );
  };

  /**
   * ============================================================
   * SELECCIONAR COBRO
   * ============================================================
   */
  const toggleCobro = (
    cobro,
  ) => {
    const cobroId =
      getCobroId(
        cobro,
      );

    if (
      !cobroId
    ) {
      setMessage(
        'El cobro seleccionado no tiene un ID válido',
      );

      setMessageType(
        'error',
      );

      return;
    }

    setForm(
      (
        previous,
      ) => {
        const exists =
          previous.cobros.includes(
            cobroId,
          );

        /**
         * Agregar / quitar.
         */
        const newCobros =
          exists
            ? previous.cobros.filter(
                (
                  item,
                ) =>
                  item !==
                  cobroId,
              )
            : [
                ...previous.cobros,

                cobroId,
              ];

        /**
         * Recalculamos total.
         */
        const total =
          cobros
            .filter(
              (
                item,
              ) =>
                newCobros.includes(
                  getCobroId(
                    item,
                  ),
                ),
            )
            .reduce(
              (
                sum,
                item,
              ) =>
                sum +
                getCobroSaldo(
                  item,
                ),
              0,
            );

        return {
          ...previous,

          cobros:
            newCobros,

          monto:
            String(
              total,
            ),
        };
      },
    );

    setErrors({});

    setMessage('');
  };

  /**
   * ============================================================
   * SELECCIONAR TODA UNA ACCIÓN
   * ============================================================
   */
  const toggleCobrosAccion = (
    group,
  ) => {
    const ids =
      group.cobros
        .map(
          (
            cobro,
          ) =>
            getCobroId(
              cobro,
            ),
        )
        .filter(
          Boolean,
        );

    if (
      ids.length ===
      0
    ) {
      setMessage(
        'Los cobros de esta acción no tienen IDs válidos',
      );

      setMessageType(
        'error',
      );

      return;
    }

    const allSelected =
      ids.every(
        (
          id,
        ) =>
          form.cobros.includes(
            id,
          ),
      );

    setForm(
      (
        previous,
      ) => {
        const newCobros =
          allSelected
            ? previous.cobros.filter(
                (
                  id,
                ) =>
                  !ids.includes(
                    id,
                  ),
              )
            : Array.from(
                new Set([
                  ...previous.cobros,

                  ...ids,
                ]),
              );

        const total =
          cobros
            .filter(
              (
                item,
              ) =>
                newCobros.includes(
                  getCobroId(
                    item,
                  ),
                ),
            )
            .reduce(
              (
                sum,
                item,
              ) =>
                sum +
                getCobroSaldo(
                  item,
                ),
              0,
            );

        return {
          ...previous,

          cobros:
            newCobros,

          monto:
            String(
              total,
            ),
        };
      },
    );

    setErrors({});

    setMessage('');
  };

  /**
   * ============================================================
   * CAMBIAR INPUT
   * ============================================================
   */
  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (
        previous,
      ) => ({
        ...previous,

        [name]:
          value,
      }),
    );

    setErrors(
      (
        previous,
      ) => ({
        ...previous,

        [name]:
          undefined,
      }),
    );

    setMessage('');
  };

  /**
   * ============================================================
   * PAGAR
   * ============================================================
   */
  const handlePagar =
    async (
      event,
    ) => {
      event.preventDefault();

      /**
       * ========================================================
       * PASO 1
       * VALIDAR
       * ========================================================
       *
       * Mandamos totalSeleccionado
       * solamente para validarlo.
       */
      const validation =
        validatePagoCobro({
          ...form,

          totalSeleccionado,
        });

      /**
       * ========================================================
       * PASO 2
       * ERROR
       * ========================================================
       */
      if (
        !validation.isValid
      ) {
        setErrors(
          validation.errors,
        );

        setMessage(
          'Revise los datos del pago',
        );

        setMessageType(
          'error',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 3
       * CONFIRMACIÓN
       * ========================================================
       */
      const confirmPay =
        window.confirm(
          `¿Confirmar pago por ${formatMoney(
            validation.data
              .monto,
          )}?`,
        );

      if (
        !confirmPay
      ) {
        return;
      }

      try {
        setSaving(
          true,
        );

        setMessage('');

        /**
         * ======================================================
         * PASO 4
         * POST
         * ======================================================
         *
         * validation.data YA NO contiene:
         *
         * totalSeleccionado
         *
         * solamente:
         *
         * {
         *   socio_id,
         *   monto,
         *   cobros,
         *   metodo_pago
         * }
         */
        const response =
          await CobrosServices.pagar(
            validation.data,
          );

        if (
          !response?.ok
        ) {
          setMessage(
            response?.message ||
              'Error al registrar el pago',
          );

          setMessageType(
            'error',
          );

          return;
        }

        setErrors({});

        /**
         * ======================================================
         * PAGO QR
         * ======================================================
         */
        if (
          validation.data
            .metodo_pago ===
          'QR'
        ) {
          /**
           * Verificamos que exista QR.
           */
          if (
            !response?.qrImage
          ) {
            setMessage(
              'El pago QR fue generado, pero el servidor no devolvió la imagen del QR',
            );

            setMessageType(
              'warning',
            );

            return;
          }

          /**
           * Guardamos respuesta QR.
           */
          setQrPago(
            response,
          );

          /**
           * Abrimos modal.
           */
          setQrModalOpen(
            true,
          );

          /**
           * No refrescamos todavía
           * porque el QR sigue pendiente.
           */
          setMessage('');

          return;
        }

        /**
         * ======================================================
         * EFECTIVO
         * ======================================================
         */
        setMessage(
          response?.message ||
            'Pago registrado correctamente',
        );

        setMessageType(
          'success',
        );

        /**
         * Recargamos cobros.
         */
        if (
          selectedSocio
        ) {
          await openSocio(
            selectedSocio,
          );
        }

        /**
         * Recargamos socios.
         */
        await fetchSocios();

      } catch (error) {
        setMessage(
          error?.message ||
            'Ocurrió un error al registrar el pago',
        );

        setMessageType(
          'error',
        );

      } finally {
        setSaving(
          false,
        );
      }
    };

  /**
   * ============================================================
   * CERRAR QR
   * ============================================================
   */
  const closeQrModal =
    () => {
      setQrModalOpen(
        false,
      );

      setQrPago(
        null,
      );
    };

  /**
   * ============================================================
   * LIMPIAR BUSCADOR
   * ============================================================
   */
  const clearSearch =
    () => {
      setSearch('');
    };

  /**
   * ============================================================
   * COLOR DEL MENSAJE
   * ============================================================
   */
  const getMessageClasses =
    () => {
      if (
        messageType ===
        'error'
      ) {
        return 'border-red-200 bg-red-50 text-red-700';
      }

      if (
        messageType ===
        'warning'
      ) {
        return 'border-amber-200 bg-amber-50 text-amber-700';
      }

      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    };

  return (
    <>
      <section className="min-h-screen bg-slate-50">

        <div className="space-y-5">

          {/* ==================================================
              ENCABEZADO
              ================================================== */}

          <header>

            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                Inicio
              </span>

              <span>
                /
              </span>

              <span>
                Cobros
              </span>

              <span>
                /
              </span>

              <span className="text-emerald-700">
                Cobro a un socio
              </span>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Cobro a un socio
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Selecciona un socio, revisa sus acciones y registra el pago de sus deudas pendientes.
            </p>

          </header>

          {/* ==================================================
              PASOS
              ================================================== */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">

              <StepItem
                number="1"
                label="Buscar socio"
                active={
                  !selectedSocio
                }
                completed={
                  Boolean(
                    selectedSocio,
                  )
                }
              />

              <StepItem
                number="2"
                label="Deudas pendientes"
                active={
                  Boolean(
                    selectedSocio,
                  )
                }
                completed={
                  form.cobros
                    .length >
                  0
                }
              />

              <StepItem
                number="3"
                label="Seleccionar conceptos"
                active={
                  form.cobros
                    .length >
                  0
                }
                completed={
                  false
                }
              />

              <StepItem
                number="4"
                label="Registrar pago"
                active={
                  false
                }
                completed={
                  false
                }
              />

            </div>

          </div>

          {/* ==================================================
              MENSAJES
              ================================================== */}

          {message && (
            <div
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${getMessageClasses()}`}
            >

              {messageType ===
              'error' ? (
                <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
              )}

              <span>
                {message}
              </span>

            </div>
          )}

          {/* ==================================================
              CONTENIDO
              ================================================== */}

          <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_300px]">

            {/* =================================================
                SOCIOS
                ================================================= */}

            <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-5 py-5">

                <div className="flex items-center gap-3">

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                    1
                  </span>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Buscar socio
                    </h2>

                    <p className="text-xs text-slate-500">
                      Selecciona el socio al que deseas cobrar.
                    </p>

                  </div>

                </div>

                {/* BUSCADOR */}

                <div className="relative mt-4">

                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={
                      search
                    }
                    onChange={(
                      event,
                    ) =>
                      setSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Buscar por nombre o CI"
                    className={`${inputClass} pl-11 pr-11`}
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={
                        clearSearch
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Limpiar búsqueda"
                    >

                      <XMarkIcon className="h-4 w-4" />

                    </button>
                  )}

                </div>

              </div>

              {/* LISTADO DE SOCIOS */}

              <div className="max-h-180 space-y-2 overflow-y-auto p-3">

                {loadingSocios ? (
                  <div className="flex flex-col items-center justify-center py-12">

                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Cargando socios...
                    </p>

                  </div>

                ) : socios.length ===
                  0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

                    <UserGroupIcon className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      No hay socios para cobrar
                    </p>

                  </div>

                ) : (
                  socios.map(
                    (
                      socio,
                    ) => {
                      const socioId =
                        getSocioId(
                          socio,
                        );

                      const active =
                        String(
                          getSocioId(
                            selectedSocio,
                          ),
                        ) ===
                        String(
                          socioId,
                        );

                      return (
                        <button
                          key={
                            socioId
                          }
                          type="button"
                          onClick={() =>
                            openSocio(
                              socio,
                            )
                          }
                          className={`w-full rounded-lg border p-3 text-left transition ${
                            active
                              ? 'border-emerald-300 bg-emerald-50'
                              : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                active
                                  ? 'bg-white text-emerald-700 shadow-sm'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {getSocioInitials(
                                socio,
                              ) ||
                                'S'}
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-bold text-slate-900">
                                {getSocioName(
                                  socio,
                                )}
                              </p>

                              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                                <IdentificationIcon className="h-3.5 w-3.5" />

                                CI:{' '}

                                {getSocioCi(
                                  socio,
                                )}

                              </div>

                              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                                <CreditCardIcon className="h-3.5 w-3.5" />

                                {Array.isArray(
                                  socio.acciones,
                                )
                                  ? socio.acciones.length
                                  : 0}{' '}
                                acciones

                              </div>

                            </div>

                            <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-400" />

                          </div>

                        </button>
                      );
                    },
                  )
                )}

              </div>

            </aside>

            {/* =================================================
                COBROS
                ================================================= */}

            <main className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {!selectedSocio ? (
                <div className="flex min-h-140 items-center justify-center p-6">

                  <div className="max-w-sm text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

                      <UserIcon className="h-8 w-8" />

                    </div>

                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                      Selecciona un socio
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Elige un socio del panel izquierdo para revisar sus acciones y cobros pendientes.
                    </p>

                  </div>

                </div>

              ) : (
                <>
                  {/* CABECERA SOCIO */}

                  <div className="border-b border-slate-200 px-5 py-5 lg:px-6">

                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-base font-bold text-emerald-700">

                          {getSocioInitials(
                            selectedSocio,
                          ) ||
                            'S'}

                        </div>

                        <div>

                          <h2 className="text-lg font-bold text-slate-900">

                            {getSocioName(
                              selectedSocio,
                            )}

                          </h2>

                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">

                            <span>
                              CI:{' '}

                              {getSocioCi(
                                selectedSocio,
                              )}
                            </span>

                            <span>

                              {
                                cobrosAgrupados.length
                              }{' '}

                              acciones con deuda

                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right">

                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          Total pendiente
                        </p>

                        <p className="mt-1 text-xl font-bold text-emerald-800">

                          {formatMoney(
                            totalPendiente,
                          )}

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* COBROS */}

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

                    {loadingCobros ? (
                      <div className="flex flex-col items-center justify-center py-16">

                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Cargando cobros...
                        </p>

                      </div>

                    ) : cobrosAgrupados.length ===
                      0 ? (
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
                      <div className="space-y-4">

                        {cobrosAgrupados.map(
                          (
                            group,
                          ) => {
                            const isOpen =
                              openGroups[
                                group.codigo
                              ];

                            const ids =
                              group.cobros
                                .map(
                                  (
                                    cobro,
                                  ) =>
                                    getCobroId(
                                      cobro,
                                    ),
                                )
                                .filter(
                                  Boolean,
                                );

                            const selectedCount =
                              ids.filter(
                                (
                                  id,
                                ) =>
                                  form.cobros.includes(
                                    id,
                                  ),
                              ).length;

                            const allSelected =
                              ids.length >
                                0 &&
                              selectedCount ===
                                ids.length;

                            return (
                              <div
                                key={
                                  group.codigo
                                }
                                className="overflow-hidden rounded-xl border border-slate-200"
                              >

                                {/* HEADER ACCIÓN */}

                                <div className="flex flex-col gap-3 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleGroup(
                                        group.codigo,
                                      )
                                    }
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

                                        {
                                          group
                                            .cobros
                                            .length
                                        }{' '}

                                        conceptos pendientes

                                      </p>

                                    </div>

                                  </button>

                                  <div className="flex items-center justify-between gap-4 sm:justify-end">

                                    <div className="text-right">

                                      <p className="text-xs text-slate-500">
                                        Total acción
                                      </p>

                                      <p className="font-bold text-slate-900">

                                        {formatMoney(
                                          group.total,
                                        )}

                                      </p>

                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleCobrosAccion(
                                          group,
                                        )
                                      }
                                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                        allSelected
                                          ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                          : 'border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                                      }`}
                                    >

                                      {allSelected
                                        ? 'Quitar todos'
                                        : 'Seleccionar acción'}

                                    </button>

                                  </div>

                                </div>

                                {/* DETALLES */}

                                {isOpen && (
                                  <div className="divide-y divide-slate-100">

                                    {group.cobros.map(
                                      (
                                        cobro,
                                        index,
                                      ) => {
                                        const id =
                                          getCobroId(
                                            cobro,
                                          );

                                        const checked =
                                          form.cobros.includes(
                                            id,
                                          );

                                        return (
                                          <label
                                            key={
                                              id ||
                                              `${group.codigo}-${index}`
                                            }
                                            className={`flex cursor-pointer items-start gap-4 px-4 py-4 transition ${
                                              checked
                                                ? 'bg-emerald-50/60'
                                                : 'bg-white hover:bg-slate-50'
                                            }`}
                                          >

                                            <input
                                              type="checkbox"
                                              checked={
                                                checked
                                              }
                                              disabled={
                                                !id
                                              }
                                              onChange={() =>
                                                toggleCobro(
                                                  cobro,
                                                )
                                              }
                                              className="mt-1 h-4 w-4 accent-emerald-700"
                                            />

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

                                                      Medidor:{' '}

                                                      {
                                                        cobro.nro_medidor
                                                      }

                                                    </p>
                                                  )}

                                                </div>

                                                <div className="shrink-0 text-left sm:text-right">

                                                  <p className="text-xs text-slate-500">
                                                    Saldo pendiente
                                                  </p>

                                                  <p className="mt-1 text-lg font-bold text-emerald-700">

                                                    {formatMoney(
                                                      getCobroSaldo(
                                                        cobro,
                                                      ),
                                                    )}

                                                  </p>

                                                  <p className="mt-1 text-xs text-slate-400">

                                                    Pagado:{' '}

                                                    {formatMoney(
                                                      cobro.monto_pagado,
                                                    )}

                                                  </p>

                                                </div>

                                              </div>

                                            </div>

                                          </label>
                                        );
                                      },
                                    )}

                                  </div>
                                )}

                              </div>
                            );
                          },
                        )}

                      </div>
                    )}

                    {/* ERROR COBROS */}

                    {errors.cobros && (
                      <p className="mt-3 flex items-center gap-1 text-sm font-medium text-red-600">

                        <ExclamationCircleIcon className="h-4 w-4" />

                        {
                          errors.cobros
                        }

                      </p>
                    )}

                  </div>
                </>
              )}

            </main>

            {/* =================================================
                RESUMEN
                ================================================= */}

            <aside className="space-y-4">

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <h3 className="text-sm font-bold text-slate-900">
                  Resumen del cobro
                </h3>

                <div className="mt-4 space-y-4">

                  <SummaryRow
                    label="Conceptos seleccionados"
                    value={
                      form.cobros
                        .length
                    }
                  />

                  <SummaryRow
                    label="Monto pendiente"
                    value={
                      formatMoney(
                        totalSeleccionado,
                      )
                    }
                    highlight
                  />

                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total a cobrar
                  </p>

                  <p className="mt-2 text-2xl font-bold text-emerald-700">

                    {formatMoney(
                      totalSeleccionado,
                    )}

                  </p>

                </div>

              </div>

              {/* =================================================
                  REGISTRAR PAGO
                  ================================================= */}

              {selectedSocio && (
                <form
                  onSubmit={
                    handlePagar
                  }
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <h3 className="text-sm font-bold text-slate-900">
                    Registrar pago
                  </h3>

                  <div className="mt-4 space-y-4">

                    {/* MÉTODO */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Método de pago
                      </label>

                      <div className="relative">

                        <WalletIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <select
                          name="metodo_pago"
                          value={
                            form.metodo_pago
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} appearance-none pl-11 pr-10`}
                        >

                          <option value="QR">
                            QR
                          </option>

                          <option value="EFECTIVO">
                            EFECTIVO
                          </option>

                        </select>

                        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      </div>

                      {errors.metodo_pago && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {
                            errors.metodo_pago
                          }
                        </p>
                      )}

                    </div>

                    {/* MONTO */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Monto a pagar
                      </label>

                      <div className="relative">

                        <BanknotesIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          type="number"
                          name="monto"
                          min="0"
                          step="0.01"
                          value={
                            form.monto
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Monto automático"
                          className={`${inputClass} pl-11`}
                        />

                      </div>

                      {errors.monto && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {
                            errors.monto
                          }
                        </p>
                      )}

                    </div>

                    {/* BOTÓN */}

                    <button
                      type="submit"
                      disabled={
                        saving ||
                        form.cobros
                          .length ===
                          0
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {form.metodo_pago ===
                      'QR' ? (
                        <QrCodeIcon className="h-5 w-5" />
                      ) : (
                        <CreditCardIcon className="h-5 w-5" />
                      )}

                      {saving
                        ? form.metodo_pago ===
                          'QR'
                          ? 'Generando QR...'
                          : 'Registrando pago...'
                        : form.metodo_pago ===
                            'QR'
                          ? 'Generar QR'
                          : 'Confirmar pago'}

                    </button>

                  </div>

                </form>
              )}

              {/* INFORMACIÓN */}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex items-start gap-3">

                  <div className="rounded-full bg-white p-2 text-blue-700">

                    <BanknotesIcon className="h-4 w-4" />

                  </div>

                  <div>

                    <h4 className="text-sm font-bold text-blue-900">
                      Información
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-blue-800/80">
                      Selecciona uno o varios conceptos. El monto se calcula automáticamente según los saldos pendientes.
                    </p>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </section>

      {/* ======================================================
          MODAL QR
          ====================================================== */}

      {qrModalOpen &&
        qrPago && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
          >

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

                    <QrCodeIcon className="h-6 w-6" />

                  </div>

                  <div>

                    <h2
                      id="qr-modal-title"
                      className="font-bold text-slate-900"
                    >
                      Pago mediante QR
                    </h2>

                    <p className="text-xs text-slate-500">
                      Escanea el código para realizar el pago
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    closeQrModal
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cerrar"
                >

                  <XMarkIcon className="h-5 w-5" />

                </button>

              </div>

              {/* CONTENIDO */}

              <div className="p-6">

                {/* MONTO */}

                <div className="mb-5 text-center">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Monto a pagar
                  </p>

                  <p className="mt-1 text-3xl font-bold text-emerald-700">

                    {formatMoney(
                      qrPago.amount,
                    )}

                  </p>

                </div>

                {/* QR */}

                <div className="mx-auto flex max-w-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                  <img
                    src={
                      getQrImageSrc(
                        qrPago.qrImage,
                      )
                    }
                    alt="Código QR para realizar el pago"
                    className="h-auto w-full object-contain"
                  />

                </div>

                {/* ESTADO */}

                <div className="mt-5 flex justify-center">

                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">

                    <span className="h-2 w-2 rounded-full bg-amber-500" />

                    {qrPago.estado ||
                      'PENDIENTE'}

                  </span>

                </div>

                {/* DATOS */}

                <div className="mt-5 rounded-xl bg-slate-50 p-4">

                  {qrPago.qrId && (
                    <div className="flex items-start justify-between gap-4 text-xs">

                      <span className="text-slate-500">
                        QR ID
                      </span>

                      <span className="break-all text-right font-medium text-slate-700">

                        {
                          qrPago.qrId
                        }

                      </span>

                    </div>
                  )}

                  {qrPago.dueDate && (
                    <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-3 text-xs">

                      <span className="text-slate-500">
                        Válido hasta
                      </span>

                      <span className="font-semibold text-slate-700">

                        {
                          qrPago.dueDate
                        }

                      </span>

                    </div>
                  )}

                </div>

                {/* MENSAJE */}

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">

                  <p className="text-xs leading-5 text-blue-800">
                    Escanea el código QR desde tu aplicación bancaria para completar el pago.
                  </p>

                </div>

                {/* CERRAR */}

                <button
                  type="button"
                  onClick={
                    closeQrModal
                  }
                  className="mt-5 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cerrar
                </button>

              </div>

            </div>

          </div>
        )}

    </>
  );
}

/**
 * ============================================================
 * ITEM DE PASOS
 * ============================================================
 */
function StepItem({
  number,
  label,
  active,
  completed,
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">

      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          completed
            ? 'bg-emerald-700 text-white'
            : active
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
        }`}
      >

        {completed ? (
          <CheckCircleIcon className="h-5 w-5" />
        ) : (
          number
        )}

      </span>

      <span
        className={`text-xs font-semibold ${
          active ||
          completed
            ? 'text-slate-800'
            : 'text-slate-400'
        }`}
      >
        {label}
      </span>

    </div>
  );
}

/**
 * ============================================================
 * FILA DEL RESUMEN
 * ============================================================
 */
function SummaryRow({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span
        className={`text-sm font-bold ${
          highlight
            ? 'text-emerald-700'
            : 'text-slate-900'
        }`}
      >
        {value}
      </span>

    </div>
  );
}