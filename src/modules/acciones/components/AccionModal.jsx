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
  CreditCardIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  SignalIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  AccionesServices as Servs,
} from '../services/acciones.services';

import {
  CallesServices
} from '../../calles/services/calles.services';

/**
 * ============================================================
 * IMPORTAMOS DIRECTAMENTE LA FUNCIÓN DEL SCHEMA
 * ============================================================
 *
 * El componente NO necesita saber
 * cómo funciona Zod internamente.
 */
import {
  validateAccion,
} from '../schema/acciones.schema';

/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 */
const initialForm = () => ({
  socio_id: '',
  calle_id: '',
  tarifa_id: '',
  nro_medidor: '',
  direccion: '',
  observacion: '',
  estado: 'ACTIVO',
  detallesAccion: [],
});

/**
 * ============================================================
 * OBTENER ID DE OPCIÓN
 * ============================================================
 *
 * Algunos endpoints devuelven:
 *
 * {
 *   value: 1,
 *   label: 'Texto'
 * }
 *
 * mientras Calles puede devolver:
 *
 * {
 *   id: 1,
 *   nombre_calle: 'Av. Principal'
 * }
 *
 * Esta función soporta ambas estructuras.
 */
const getOptionId = (
  item,
) => {
  if (
    item === null ||
    item === undefined
  ) {
    return null;
  }

  /**
   * Si ya es número.
   */
  if (
    typeof item === 'number'
  ) {
    return item;
  }

  /**
   * Si viene como string:
   *
   * "2"
   *
   * lo convertimos.
   */
  if (
    typeof item === 'string'
  ) {
    const numeric =
      Number(item);

    return Number.isFinite(
      numeric,
    )
      ? numeric
      : null;
  }

  /**
   * Buscamos:
   *
   * value
   *
   * o:
   *
   * id
   */
  const value =
    item?.value ??
    item?.id;

  const numericValue =
    Number(value);

  return Number.isFinite(
    numericValue,
  )
    ? numericValue
    : null;
};

/**
 * ============================================================
 * LABEL DEL SOCIO
 * ============================================================
 */
const getSocioLabel = (
  socio,
) =>
  socio?.label ||
  socio?.nombre_completo ||
  `Socio ${
    socio?.value ??
    socio?.id ??
    ''
  }`;

/**
 * ============================================================
 * LABEL DE CALLE
 * ============================================================
 */
const getCalleLabel = (
  calle,
) =>
  calle?.nombre_calle ||
  calle?.label ||
  `Calle ${
    calle?.id ??
    calle?.value ??
    ''
  }`;

/**
 * ============================================================
 * LABEL DE TARIFA
 * ============================================================
 */
const getTarifaLabel = (
  tarifa,
) =>
  tarifa?.label ||
  tarifa?.nombre_tarifa ||
  `Tarifa ${
    tarifa?.value ??
    tarifa?.id ??
    ''
  }`;

/**
 * ============================================================
 * LABEL DE DETALLE
 * ============================================================
 */
const getDetalleLabel = (
  detalle,
) =>
  detalle?.label ||
  detalle?.nombre_accion ||
  detalle?.nombre_detalle_accion ||
  `Detalle ${
    detalle?.value ??
    detalle?.id ??
    ''
  }`;

/**
 * ============================================================
 * CLASE GENERAL DE INPUTS
 * ============================================================
 */
const inputClass = (
  hasError = false,
) =>
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
  /**
   * ============================================================
   * FORMULARIO
   * ============================================================
   */

  const [
    form,
    setForm,
  ] = useState(
    initialForm(),
  );

  /**
   * ============================================================
   * CATÁLOGOS
   * ============================================================
   */

  const [
    socios,
    setSocios,
  ] = useState([]);

  const [
    calles,
    setCalles,
  ] = useState([]);

  const [
    tarifas,
    setTarifas,
  ] = useState([]);

  const [
    tiposAccion,
    setTiposAccion,
  ] = useState([]);

  const [
    detalles,
    setDetalles,
  ] = useState([]);

  /**
   * ============================================================
   * TIPO DE ACCIÓN
   * ============================================================
   *
   * Este ID NO forma parte del payload final.
   *
   * Solamente se utiliza para obtener:
   *
   * GET /detalle-accion/:tipoAccionId
   */
  const [
    tipoAccionId,
    setTipoAccionId,
  ] = useState('');

  /**
   * ============================================================
   * BUSCADOR DEL SOCIO
   * ============================================================
   */

  const [
    socioSearch,
    setSocioSearch,
  ] = useState('');

  const [
    showSocios,
    setShowSocios,
  ] = useState(false);

  /**
   * ============================================================
   * ESTADOS DE INTERFAZ
   * ============================================================
   */

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    loadingSelects,
    setLoadingSelects,
  ] = useState(false);

  const [
    loadingDetalles,
    setLoadingDetalles,
  ] = useState(false);

  const [
    resolvingTipo,
    setResolvingTipo,
  ] = useState(false);

  /**
   * ============================================================
   * CARGAR CATÁLOGOS
   * ============================================================
   *
   * Cargamos simultáneamente:
   *
   * - socios
   * - calles
   * - tarifas
   * - tipos de acción
   */
  const loadSelects = async () => {
  try {
    setLoadingSelects(true);

    const [
      sociosRes,
      callesRes,
      tarifasRes,
      tiposRes,
    ] = await Promise.all([
      Servs.getSocios(),

      /**
       * CORRECTO:
       * getAll recibe UN objeto params.
       */
      CallesServices.getAll({
        page: 1,
        limit: 100,
        search: '',
        estado: true,
      }),

      Servs.getTarifas(),

      Servs.getTiposAccion(),
    ]);

    /**
     * SOCIOS
     */
    if (sociosRes?.ok) {
      setSocios(
        Array.isArray(sociosRes.data)
          ? sociosRes.data
          : [],
      );
    } else {
      setSocios([]);

      toast.error(
        sociosRes?.message ||
          'Error al cargar socios',
      );
    }

    /**
     * CALLES
     */
    if (callesRes?.ok) {
      setCalles(
        Array.isArray(callesRes.data)
          ? callesRes.data
          : [],
      );
    } else {
      setCalles([]);

      toast.error(
        callesRes?.message ||
          'Error al cargar calles',
      );
    }

    /**
     * TARIFAS
     */
    if (tarifasRes?.ok) {
      setTarifas(
        Array.isArray(tarifasRes.data)
          ? tarifasRes.data
          : [],
      );
    } else {
      setTarifas([]);

      toast.error(
        tarifasRes?.message ||
          'Error al cargar tarifas',
      );
    }

    /**
     * TIPOS DE ACCIÓN
     */
    if (tiposRes?.ok) {
      setTiposAccion(
        Array.isArray(tiposRes.data)
          ? tiposRes.data
          : [],
      );
    } else {
      setTiposAccion([]);

      toast.error(
        tiposRes?.message ||
          'Error al cargar tipos de acción',
      );
    }
  } catch (error) {
    toast.error(
      error?.message ||
        'Error inesperado al cargar los catálogos',
    );
  } finally {
    setLoadingSelects(false);
  }
};

  /**
   * ============================================================
   * CUANDO ABRIMOS EL MODAL
   * ============================================================
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    /**
     * Limpiamos errores anteriores.
     */
    setErrors({});

    setShowSocios(false);

    /**
     * Cargamos catálogos.
     */
    loadSelects();
  }, [
    open,
  ]);

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
     * ==========================================================
     * EDITAR
     * ==========================================================
     */
    if (
      selected
    ) {
      /**
       * El backend devuelve:
       *
       * detallesAccion: [2]
       *
       * Nos aseguramos de convertir
       * todos los valores a IDs.
       */
      const detalleIds =
        Array.isArray(
          selected.detallesAccion,
        )
          ? selected.detallesAccion
              .map(
                (item) =>
                  getOptionId(
                    item,
                  ),
              )
              .filter(Boolean)
          : [];

      /**
       * Cargamos datos en el formulario.
       */
      setForm({
        socio_id:
          selected.socio_id ??
          '',

        calle_id:
          selected.calle_id ??
          '',

        tarifa_id:
          selected.tarifa_id ??
          '',

        nro_medidor:
          selected.nro_medidor ??
          '',

        direccion:
          selected.direccion ??
          '',

        observacion:
          selected.observacion ??
          '',

        estado:
          selected.estado ??
          'ACTIVO',

        detallesAccion:
          detalleIds,
      });

      setTipoAccionId('');

      setDetalles([]);

      setSocioSearch('');

      return;
    }

    /**
     * ==========================================================
     * CREAR
     * ==========================================================
     */
    setForm(
      initialForm(),
    );

    setTipoAccionId('');

    setDetalles([]);

    setSocioSearch('');
  }, [
    open,
    selected,
  ]);

  /**
   * ============================================================
   * MOSTRAR NOMBRE DEL SOCIO AL EDITAR
   * ============================================================
   */
  useEffect(() => {
    if (
      !open ||
      !selected ||
      socios.length === 0
    ) {
      return;
    }

    /**
     * ID actual.
     */
    const socioId =
      Number(
        selected.socio_id,
      );

    /**
     * Buscamos al socio dentro
     * del catálogo.
     */
    const socioEncontrado =
      socios.find(
        (socio) =>
          getOptionId(
            socio,
          ) === socioId,
      );

    if (
      socioEncontrado
    ) {
      setSocioSearch(
        getSocioLabel(
          socioEncontrado,
        ),
      );

      return;
    }

    /**
     * Fallback.
     */
    setSocioSearch(
      selected.nombre_completo ||
        '',
    );
  }, [
    open,
    selected,
    socios,
  ]);

  /**
   * ============================================================
   * RESOLVER TIPO DE ACCIÓN AL EDITAR
   * ============================================================
   *
   * GET /accion/:id devuelve detallesAccion,
   * pero actualmente no devuelve el tipo de acción.
   *
   * Entonces:
   *
   * 1. recorremos tipos;
   * 2. obtenemos detalles de cada tipo;
   * 3. buscamos dónde están los detalles actuales;
   * 4. cuando encontramos coincidencia,
   *    establecemos tipoAccionId.
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

    /**
     * Detalles actuales.
     */
    const detalleIds =
      Array.isArray(
        selected.detallesAccion,
      )
        ? selected.detallesAccion
            .map(
              (item) =>
                getOptionId(
                  item,
                ),
            )
            .filter(Boolean)
        : [];

    if (
      detalleIds.length === 0
    ) {
      return;
    }

    let cancelled =
      false;

    const resolverTipoAccion =
      async () => {
        try {
          setResolvingTipo(
            true,
          );

          /**
           * Recorremos todos los tipos.
           */
          for (
            const tipo
            of tiposAccion
          ) {
            const tipoId =
              getOptionId(
                tipo,
              );

            if (
              !tipoId
            ) {
              continue;
            }

            /**
             * Consultamos detalles.
             */
            const response =
              await Servs.getDetallesAccion(
                tipoId,
              );

            if (
              !response?.ok
            ) {
              continue;
            }

            const detallesTipo =
              Array.isArray(
                response.data,
              )
                ? response.data
                : [];

            /**
             * Extraemos IDs.
             */
            const idsTipo =
              detallesTipo
                .map(
                  (detalle) =>
                    getOptionId(
                      detalle,
                    ),
                )
                .filter(Boolean);

            /**
             * Verificamos que todos
             * los detalles actuales
             * pertenezcan al tipo.
             */
            const perteneceAlTipo =
              detalleIds.every(
                (detalleId) =>
                  idsTipo.includes(
                    detalleId,
                  ),
              );

            if (
              perteneceAlTipo
            ) {
              if (
                !cancelled
              ) {
                setTipoAccionId(
                  String(
                    tipoId,
                  ),
                );
              }

              return;
            }
          }
        } finally {
          if (
            !cancelled
          ) {
            setResolvingTipo(
              false,
            );
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
   * CARGAR DETALLES DEL TIPO
   * ============================================================
   */
  useEffect(() => {
    /**
     * Sin tipo no hacemos petición.
     */
    if (
      !open ||
      !tipoAccionId
    ) {
      setDetalles([]);

      return;
    }

    let cancelled =
      false;

    const fetchDetalles =
      async () => {
        try {
          setLoadingDetalles(
            true,
          );

          const response =
            await Servs.getDetallesAccion(
              tipoAccionId,
            );

          if (
            !response?.ok
          ) {
            if (
              !cancelled
            ) {
              setDetalles([]);

              toast.error(
                response?.message ||
                  'No se pudieron cargar los detalles',
              );
            }

            return;
          }

          if (
            !cancelled
          ) {
            setDetalles(
              Array.isArray(
                response.data,
              )
                ? response.data
                : [],
            );
          }

        } finally {
          if (
            !cancelled
          ) {
            setLoadingDetalles(
              false,
            );
          }
        }
      };

    fetchDetalles();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    tipoAccionId,
  ]);

  /**
   * ============================================================
   * CAMBIAR CAMPOS
   * ============================================================
   */
  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    /**
     * Modificamos solamente
     * el campo correspondiente.
     */
    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      }),
    );

    /**
     * Eliminamos el error
     * solamente de ese campo.
     */
    setErrors(
      (previous) => ({
        ...previous,

        [name]:
          undefined,
      }),
    );
  };

  /**
   * ============================================================
   * CAMBIAR TIPO DE ACCIÓN
   * ============================================================
   */
  const handleTipoAccionChange = (
    event,
  ) => {
    const value =
      event.target.value;

    setTipoAccionId(
      value,
    );

    /**
     * Si cambia el tipo,
     * limpiamos detalles seleccionados.
     */
    setForm(
      (previous) => ({
        ...previous,

        detallesAccion:
          [],
      }),
    );

    setDetalles([]);

    setErrors(
      (previous) => ({
        ...previous,

        tipo_accion:
          undefined,

        detallesAccion:
          undefined,
      }),
    );
  };

  /**
   * ============================================================
   * SELECCIONAR SOCIO
   * ============================================================
   */
  const selectSocio = (
    socio,
  ) => {
    const id =
      getOptionId(
        socio,
      );

    if (
      !id
    ) {
      return;
    }

    /**
     * Guardamos el ID real.
     */
    setForm(
      (previous) => ({
        ...previous,

        socio_id:
          id,
      }),
    );

    /**
     * Mostramos el label.
     */
    setSocioSearch(
      getSocioLabel(
        socio,
      ),
    );

    setShowSocios(
      false,
    );

    setErrors(
      (previous) => ({
        ...previous,

        socio_id:
          undefined,
      }),
    );
  };

  /**
   * ============================================================
   * AGREGAR / QUITAR DETALLE
   * ============================================================
   */
  const toggleDetalle = (
    id,
  ) => {
    const detalleId =
      Number(id);

    if (
      !detalleId
    ) {
      return;
    }

    setForm(
      (previous) => ({
        ...previous,

        /**
         * Si ya existe:
         * lo eliminamos.
         *
         * Si no existe:
         * lo agregamos.
         */
        detallesAccion:
          previous.detallesAccion.includes(
            detalleId,
          )
            ? previous.detallesAccion.filter(
                (item) =>
                  item !==
                  detalleId,
              )
            : [
                ...previous.detallesAccion,

                detalleId,
              ],
      }),
    );

    /**
     * Quitamos error.
     */
    setErrors(
      (previous) => ({
        ...previous,

        detallesAccion:
          undefined,
      }),
    );
  };

  /**
   * ============================================================
   * VALIDAR Y GUARDAR
   * ============================================================
   */
  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    /**
     * ==========================================================
     * PASO 1
     * VALIDAR CON LA FUNCIÓN DEL SCHEMA
     * ==========================================================
     */
    const validation =
      validateAccion(
        form,
      );

    /**
     * Copiamos errores.
     */
    const newErrors = {
      ...validation.errors,
    };

    /**
     * ==========================================================
     * PASO 2
     * VALIDAR TIPO DE ACCIÓN
     * ==========================================================
     *
     * tipoAccionId NO forma parte
     * del payload del backend.
     *
     * Por eso lo validamos aquí.
     */
    if (
      !tipoAccionId
    ) {
      newErrors.tipo_accion =
        'Seleccione un tipo de acción';
    }

    /**
     * ==========================================================
     * PASO 3
     * SI EXISTEN ERRORES
     * ==========================================================
     */
    if (
      !validation.isValid ||
      !tipoAccionId
    ) {
      setErrors(
        newErrors,
      );

      toast.error(
        'Revise los campos marcados antes de guardar',
      );

      return;
    }

    try {
      setSaving(
        true,
      );

      /**
       * ========================================================
       * PASO 4
       * OBTENER PAYLOAD VALIDADO
       * ========================================================
       *
       * Esta es una parte MUY importante.
       *
       * No usamos:
       *
       * form
       *
       * directamente.
       *
       * Utilizamos:
       *
       * validation.data
       *
       * porque esos datos YA PASARON ZOD.
       */
      const payload =
        validation.data;

      /**
       * ========================================================
       * PASO 5
       * CREAR O EDITAR
       * ========================================================
       */
      const response =
        selected
          ? await Servs.update(
              selected.id,
              payload,
            )
          : await Servs.create(
              payload,
            );

      /**
       * ========================================================
       * PASO 6
       * ERROR DEL BACKEND
       * ========================================================
       */
      if (
        !response?.ok
      ) {
        toast.error(
          response?.message ||
            'Error al guardar la acción',
        );

        return;
      }

      /**
       * ========================================================
       * PASO 7
       * ÉXITO
       * ========================================================
       */
      toast.success(
        response?.message ||
          (
            selected
              ? 'Acción actualizada correctamente'
              : 'Acción registrada correctamente'
          ),
      );

      /**
       * Informamos a AccionesPage
       * para cerrar modal y actualizar tabla.
       */
      onSaved();

    } catch (error) {
      toast.error(
        error?.message ||
          'Error inesperado al guardar la acción',
      );

    } finally {
      setSaving(
        false,
      );
    }
  };

  /**
   * ============================================================
   * FILTRAR SOCIOS
   * ============================================================
   */
  const sociosFiltrados =
    useMemo(() => {
      const texto =
        socioSearch
          .toLowerCase()
          .trim();

      /**
       * Sin búsqueda mostramos
       * solamente los primeros 20.
       */
      if (
        !texto
      ) {
        return socios.slice(
          0,
          20,
        );
      }

      return socios.filter(
        (socio) =>
          getSocioLabel(
            socio,
          )
            .toLowerCase()
            .includes(
              texto,
            ),
      );
    }, [
      socios,
      socioSearch,
    ]);

  /**
   * ============================================================
   * DETALLES ASIGNADOS
   * ============================================================
   */
  const detallesAsignados =
    useMemo(
      () =>
        detalles.filter(
          (detalle) =>
            form.detallesAccion.includes(
              getOptionId(
                detalle,
              ),
            ),
        ),
      [
        detalles,
        form.detallesAccion,
      ],
    );

  /**
   * ============================================================
   * DETALLES DISPONIBLES
   * ============================================================
   */
  const detallesDisponibles =
    useMemo(
      () =>
        detalles.filter(
          (detalle) =>
            !form.detallesAccion.includes(
              getOptionId(
                detalle,
              ),
            ),
        ),
      [
        detalles,
        form.detallesAccion,
      ],
    );

  /**
   * ============================================================
   * CERRAR MODAL
   * ============================================================
   */
  const handleClose = () => {
    /**
     * Evitamos cerrar
     * mientras estamos guardando.
     */
    if (
      saving
    ) {
      return;
    }

    setShowSocios(
      false,
    );

    onClose();
  };

  /**
   * Si está cerrado,
   * no renderizamos.
   */
  if (
    !open
  ) {
    return null;
  }

  return (
    <div
      onClick={(event) => {
        /**
         * Cerrar solamente
         * al hacer click en el fondo.
         */
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-[2px] sm:p-5"
    >
      <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ======================================================
            ENCABEZADO
            ====================================================== */}

        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 bg-white px-5 py-5 sm:px-7">

          <div className="flex items-start gap-4">

            <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
              <CreditCardIcon className="h-6 w-6" />
            </div>

            <div>

              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-400">

                <span>
                  Acciones
                </span>

                <span>
                  /
                </span>

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
                Complete los datos de conexión y asigne los conceptos correspondientes.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              saving
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

        </div>

        {/* ======================================================
            FORMULARIO
            ====================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="flex min-h-0 flex-1 flex-col"
        >

          <div className="min-h-0 flex-1 overflow-y-auto">

            <div className="grid lg:grid-cols-[minmax(0,1fr)_310px]">

              {/* ==================================================
                  COLUMNA PRINCIPAL
                  ================================================== */}

              <div className="space-y-7 p-5 sm:p-7">

                {/* ================================================
                    1. SOCIO
                    ================================================ */}

                <section>

                  <div className="mb-4">

                    <h3 className="font-bold text-slate-900">
                      1. Información del socio
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Seleccione el socio propietario de la acción.
                    </p>

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
                        value={
                          socioSearch
                        }
                        disabled={
                          Boolean(
                            selected,
                          )
                        }
                        placeholder="Buscar socio por nombre o CI"
                        onFocus={() => {
                          if (
                            !selected
                          ) {
                            setShowSocios(
                              true,
                            );
                          }
                        }}
                        onChange={(event) => {
                          /**
                           * Texto de búsqueda.
                           */
                          setSocioSearch(
                            event.target.value,
                          );

                          setShowSocios(
                            true,
                          );

                          /**
                           * Si escribimos nuevamente,
                           * quitamos socio seleccionado.
                           */
                          setForm(
                            (previous) => ({
                              ...previous,

                              socio_id:
                                '',
                            }),
                          );

                          setErrors(
                            (previous) => ({
                              ...previous,

                              socio_id:
                                undefined,
                            }),
                          );
                        }}
                        className={`${inputClass(
                          Boolean(
                            errors.socio_id,
                          ),
                        )} pl-11 disabled:cursor-not-allowed disabled:bg-slate-100`}
                      />

                      {!selected && (
                        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      )}

                    </div>

                    {/* LISTADO DE SOCIOS */}

                    {showSocios &&
                      !selected && (
                        <div className="absolute left-0 right-0 z-40 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">

                          {sociosFiltrados.length ===
                          0 ? (
                            <div className="px-4 py-5 text-center text-sm text-slate-500">
                              No se encontraron socios
                            </div>
                          ) : (
                            sociosFiltrados.map(
                              (
                                socio,
                              ) => {
                                const id =
                                  getOptionId(
                                    socio,
                                  );

                                return (
                                  <button
                                    key={
                                      id
                                    }
                                    type="button"
                                    onClick={() =>
                                      selectSocio(
                                        socio,
                                      )
                                    }
                                    className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-emerald-50"
                                  >
                                    {getSocioLabel(
                                      socio,
                                    )}
                                  </button>
                                );
                              },
                            )
                          )}

                        </div>
                      )}

                    {/* ERROR SOCIO */}

                    {errors.socio_id && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">

                        <ExclamationCircleIcon className="h-4 w-4" />

                        {errors.socio_id}

                      </p>
                    )}

                  </div>

                </section>

                <div className="border-t border-slate-100" />

                {/* ================================================
                    2. DATOS DE CONEXIÓN
                    ================================================ */}

                <section>

                  <div className="mb-4">

                    <h3 className="font-bold text-slate-900">
                      2. Datos de la conexión
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Registre la ubicación, tarifa y número de medidor.
                    </p>

                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* CALLE */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Calle *
                      </label>

                      <div className="relative">

                        <MapPinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <select
                          name="calle_id"
                          value={
                            form.calle_id
                          }
                          onChange={
                            handleChange
                          }
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
                            (
                              calle,
                            ) => {
                              const id =
                                getOptionId(
                                  calle,
                                );

                              return (
                                <option
                                  key={
                                    id
                                  }
                                  value={
                                    id
                                  }
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
                        <p className="mt-1 text-xs text-red-600">
                          {errors.calle_id}
                        </p>
                      )}

                    </div>

                    {/* TARIFA */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Tarifa *
                      </label>

                      <div className="relative">

                        <BanknotesIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <select
                          name="tarifa_id"
                          value={
                            form.tarifa_id
                          }
                          onChange={
                            handleChange
                          }
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
                            (
                              tarifa,
                            ) => {
                              const id =
                                getOptionId(
                                  tarifa,
                                );

                              return (
                                <option
                                  key={
                                    id
                                  }
                                  value={
                                    id
                                  }
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
                        <p className="mt-1 text-xs text-red-600">
                          {errors.tarifa_id}
                        </p>
                      )}

                    </div>

                    {/* MEDIDOR */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Número de medidor *
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
                        <p className="mt-1 text-xs text-red-600">
                          {errors.nro_medidor}
                        </p>
                      )}

                    </div>

                    {/* ESTADO */}

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Estado *
                      </label>

                      <select
                        name="estado"
                        value={
                          form.estado
                        }
                        onChange={
                          handleChange
                        }
                        className={inputClass(
                          Boolean(
                            errors.estado,
                          ),
                        )}
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

                    </div>

                    {/* DIRECCIÓN */}

                    <div className="md:col-span-2">

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Dirección *
                      </label>

                      <input
                        name="direccion"
                        value={
                          form.direccion
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Ej. Calle principal, lote 15"
                        className={
                          inputClass(
                            Boolean(
                              errors.direccion,
                            ),
                          )
                        }
                      />

                      {errors.direccion && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.direccion}
                        </p>
                      )}

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
                          rows={3}
                          placeholder="Ingrese una observación"
                          className={`${inputClass(
                            Boolean(
                              errors.observacion,
                            ),
                          )} resize-none pl-11`}
                        />

                      </div>

                    </div>

                  </div>

                </section>

                <div className="border-t border-slate-100" />

                {/* ================================================
                    TIPO DE ACCIÓN
                    ================================================ */}

                <section>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tipo de acción *
                  </label>

                  <select
                    value={
                      tipoAccionId
                    }
                    onChange={
                      handleTipoAccionChange
                    }
                    disabled={
                      loadingSelects ||
                      resolvingTipo
                    }
                    className={inputClass(
                      Boolean(
                        errors.tipo_accion,
                      ),
                    )}
                  >

                    <option value="">
                      Seleccionar tipo de acción
                    </option>

                    {tiposAccion.map(
                      (
                        tipo,
                      ) => {
                        const id =
                          getOptionId(
                            tipo,
                          );

                        return (
                          <option
                            key={
                              id
                            }
                            value={
                              id
                            }
                          >
                            {tipo.label}
                          </option>
                        );
                      },
                    )}

                  </select>

                  {errors.tipo_accion && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.tipo_accion}
                    </p>
                  )}

                  {resolvingTipo && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-blue-600">

                      <ArrowPathIcon className="h-4 w-4 animate-spin" />

                      Identificando tipo de acción...

                    </p>
                  )}

                </section>

                {/* ================================================
                    3. DETALLES
                    ================================================ */}

                <section>

                  <div className="mb-4">

                    <h3 className="font-bold text-slate-900">
                      3. Detalles de la acción
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Seleccione los conceptos asociados al tipo.
                    </p>

                  </div>

                  {errors.detallesAccion && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errors.detallesAccion}
                    </div>
                  )}

                  {!tipoAccionId ? (
                    /**
                     * Sin tipo seleccionado.
                     */
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                      <CreditCardIcon className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        Seleccione primero un tipo de acción
                      </p>

                    </div>

                  ) : loadingDetalles ? (
                    /**
                     * Cargando.
                     */
                    <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-600">

                      <ArrowPathIcon className="h-5 w-5 animate-spin" />

                      Cargando detalles...

                    </div>

                  ) : (
                    /**
                     * Listado de detalles.
                     */
                    <div className="grid gap-5 md:grid-cols-2">

                      {/* DISPONIBLES */}

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <p className="mb-3 font-bold text-slate-800">
                          Disponibles
                        </p>

                        <div className="space-y-2">

                          {detallesDisponibles.map(
                            (
                              detalle,
                            ) => {
                              const id =
                                getOptionId(
                                  detalle,
                                );

                              return (
                                <button
                                  key={
                                    id
                                  }
                                  type="button"
                                  onClick={() =>
                                    toggleDetalle(
                                      id,
                                    )
                                  }
                                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left hover:bg-emerald-50"
                                >

                                  {getDetalleLabel(
                                    detalle,
                                  )}

                                  <PlusIcon className="h-4 w-4 text-emerald-700" />

                                </button>
                              );
                            },
                          )}

                        </div>

                      </div>

                      {/* ASIGNADOS */}

                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">

                        <p className="mb-3 font-bold text-emerald-800">
                          Asignados
                        </p>

                        <div className="space-y-2">

                          {detallesAsignados.map(
                            (
                              detalle,
                            ) => {
                              const id =
                                getOptionId(
                                  detalle,
                                );

                              return (
                                <button
                                  key={
                                    id
                                  }
                                  type="button"
                                  onClick={() =>
                                    toggleDetalle(
                                      id,
                                    )
                                  }
                                  className="flex w-full items-center justify-between rounded-lg border border-emerald-200 bg-white p-3 text-left hover:bg-red-50"
                                >

                                  {getDetalleLabel(
                                    detalle,
                                  )}

                                  <MinusIcon className="h-4 w-4 text-red-600" />

                                </button>
                              );
                            },
                          )}

                        </div>

                      </div>

                    </div>
                  )}

                </section>

              </div>

              {/* ==================================================
                  RESUMEN
                  ================================================== */}

              <aside className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0 lg:p-6">

                <div className="sticky top-0">

                  <h3 className="font-bold text-slate-900">
                    Resumen de la acción
                  </h3>

                  <div className="mt-5 space-y-4 text-sm">

                    <div>

                      <p className="text-xs text-slate-400">
                        Socio
                      </p>

                      <p className="font-semibold text-slate-800">
                        {socioSearch ||
                          'Sin seleccionar'}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Medidor
                      </p>

                      <p className="font-semibold text-slate-800">
                        {form.nro_medidor ||
                          'Sin registrar'}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Estado
                      </p>

                      <p className="font-semibold text-slate-800">
                        {form.estado}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Detalles seleccionados
                      </p>

                      <p className="text-xl font-bold text-emerald-700">
                        {
                          form
                            .detallesAccion
                            .length
                        }
                      </p>

                    </div>

                  </div>

                </div>

              </aside>

            </div>

          </div>

          {/* ======================================================
              BOTONES
              ====================================================== */}

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                saving
              }
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
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