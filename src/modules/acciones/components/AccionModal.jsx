import { useEffect, useState } from 'react';

import {
  ArrowPathIcon,
  CheckCircleIcon,
  LockClosedIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';
import { CallesServices } from '../../calles/services/calles.services';
import { validateAccion, validateAccionEdit } from '../schema/acciones.schema';
import { AccionesServices as Servs } from '../services/acciones.services';
import TipoAccionCards from './TipoAccionCards';

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

const estadoOptions = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'PASIVO', label: 'Pasivo' },
  { value: 'ANULADO', label: 'Anulado' },
];

const EDITABLE_FIELDS = [
  'calle_id',
  'tarifa_id',
  'nro_medidor',
  'direccion',
  'observacion',
  'estado',
  'detallesAccion',
];

const safeData = (response) =>
  Array.isArray(response?.data) ? response.data : [];

const normalizeId = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
};

const getCatalogValue = (options, rawValue) => {
  const id = normalizeId(rawValue);

  if (id === null) return '';

  const option = options.find((item) => normalizeId(item.value) === id);

  return option?.value ?? rawValue;
};

const extractDetalleIds = (accion) => {
  const rawDetalles =
    accion?.detallesAccion ?? accion?.detalles_accion ?? accion?.detalles ?? [];

  if (!Array.isArray(rawDetalles)) return [];

  return rawDetalles
    .map((detalle) => {
      if (typeof detalle === 'object' && detalle !== null) {
        return normalizeId(
          detalle.value ??
            detalle.id ??
            detalle.detalle_accion_id ??
            detalle.detalleAccionId,
        );
      }

      return normalizeId(detalle);
    })
    .filter((id) => id !== null);
};

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLocaleLowerCase('es');

const isPaidCobro = (cobro) => {
  const estado = String(cobro?.estado ?? '')
    .trim()
    .toUpperCase();

  const montoPagado = Number(cobro?.monto_pagado ?? 0);

  const tipoCobro = String(cobro?.tipo_cobro ?? '')
    .trim()
    .toUpperCase();

  if (tipoCobro && tipoCobro !== 'ACCION') {
    return false;
  }

  return (
    estado === 'PAGADO' || (Number.isFinite(montoPagado) && montoPagado > 0)
  );
};

const resolvePaidDetalleIds = (historial, opciones, detallesSeleccionados) => {
  const seleccionados = new Set(detallesSeleccionados.map(Number));

  const cobrosPagados = safeData(historial).filter(isPaidCobro);

  if (!cobrosPagados.length) return [];

  const idsDirectos = cobrosPagados
    .map(
      (cobro) =>
        cobro.detalle_accion_id ??
        cobro.detalleAccionId ??
        cobro.detalle_id ??
        null,
    )
    .filter((id) => id !== null && id !== undefined)
    .map(Number)
    .filter((id) => seleccionados.has(id));

  const conceptosPagados = new Set(
    cobrosPagados.map((cobro) => normalizeText(cobro.concepto)).filter(Boolean),
  );

  const idsPorConcepto = opciones
    .filter(
      (detalle) =>
        seleccionados.has(Number(detalle.value)) &&
        conceptosPagados.has(normalizeText(detalle.label)),
    )
    .map((detalle) => Number(detalle.value));

  const resueltos = [...new Set([...idsDirectos, ...idsPorConcepto])];

  if (!resueltos.length && detallesSeleccionados.length === 1) {
    return [Number(detallesSeleccionados[0])];
  }

  return resueltos;
};

/**
 * Compara dos arrays de IDs sin importar el orden.
 *
 * [1, 2] === [2, 1]
 */
const arraysAreEqual = (arrayA = [], arrayB = []) => {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  const a = [...arrayA].map(Number).sort((x, y) => x - y);

  const b = [...arrayB].map(Number).sort((x, y) => x - y);

  return a.every((value, index) => value === b[index]);
};

/**
 * Devuelve solamente los campos modificados.
 *
 * Ejemplo:
 *
 * original:
 * {
 *   calle_id: 1,
 *   tarifa_id: 1,
 *   direccion: 'A'
 * }
 *
 * current:
 * {
 *   calle_id: 1,
 *   tarifa_id: 2,
 *   direccion: 'A'
 * }
 *
 * resultado:
 * {
 *   tarifa_id: 2
 * }
 */
const getChangedFields = (original, current) => {
  if (!original) return {};

  const changes = {};

  EDITABLE_FIELDS.forEach((field) => {
    if (field === 'detallesAccion') {
      if (
        !arraysAreEqual(
          original.detallesAccion ?? [],
          current.detallesAccion ?? [],
        )
      ) {
        changes.detallesAccion = (current.detallesAccion ?? []).map(Number);
      }

      return;
    }

    /*
     * Los selects pueden devolver string:
     *
     * "2"
     *
     * mientras la API puede devolver:
     *
     * 2
     *
     * Para los IDs normalizamos antes de comparar.
     */
    if (field === 'calle_id' || field === 'tarifa_id') {
      const originalValue = normalizeId(original[field]);
      const currentValue = normalizeId(current[field]);

      if (originalValue !== currentValue) {
        changes[field] = currentValue;
      }

      return;
    }

    /*
     * Normalizamos nro_medidor para evitar que:
     *
     * null
     * ''
     *
     * sean detectados como modificación cuando
     * representan lo mismo para el formulario.
     */
    if (field === 'nro_medidor') {
      const originalValue = original[field] ?? '';
      const currentValue = current[field] ?? '';

      if (String(originalValue) !== String(currentValue)) {
        changes[field] = currentValue === '' ? null : currentValue;
      }

      return;
    }

    if (original[field] !== current[field]) {
      changes[field] = current[field];
    }
  });

  return changes;
};

export default function AccionModal({
  open,
  accionId = null,
  onClose,
  onCreated,
}) {
  const isEditing = Boolean(accionId);

  const [catalogos, setCatalogos] = useState({
    socios: [],
    calles: [],
    tarifas: [],
    tipos: [],
  });

  const [detalles, setDetalles] = useState([]);

  const [tipoId, setTipoId] = useState('');

  const [form, setForm] = useState(initialForm);

  /**
   * Copia original de los datos.
   *
   * Solo se usa cuando estamos editando.
   */
  const [originalForm, setOriginalForm] = useState(null);

  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState('');

  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [detallesPagadosIds, setDetallesPagadosIds] = useState([]);

  const [pagosValidados, setPagosValidados] = useState(true);

  const reset = () => {
    setForm(initialForm);
    setOriginalForm(null);

    setTipoId('');
    setDetalles([]);

    setErrors({});
    setMensaje('');

    setSaving(false);
    setLoadingData(false);

    setDetallesPagadosIds([]);

    setPagosValidados(!accionId);
  };

  const close = () => {
    reset();
    onClose();
  };

  const loadCatalogos = async () => {
    const [socios, calles, tarifas, tipos] = await Promise.all([
      Servs.getSocios(),
      CallesServices.getAll(),
      Servs.getTarifas(),
      Servs.getTiposAccion(),
    ]);

    const catalogosCargados = {
      socios: safeData(socios),

      calles: safeData(calles).map((item) => ({
        value: item.id,
        label: item.nombre_calle,
      })),

      tarifas: safeData(tarifas),

      tipos: safeData(tipos),
    };

    setCatalogos(catalogosCargados);

    if (!catalogosCargados.tipos.length && tipos?.message) {
      setMensaje(tipos.message);
    }

    return catalogosCargados;
  };

  const normalizeDetalleOption = (detalle, fallbackId = null) => {
    const id = normalizeId(
      detalle?.value ??
        detalle?.id ??
        detalle?.detalle_accion_id ??
        detalle?.detalleAccionId ??
        fallbackId,
    );

    if (id === null) return null;

    return {
      ...detalle,

      value: id,

      label:
        detalle?.label ??
        detalle?.nombre_accion ??
        detalle?.nombre ??
        `Detalle ${id}`,
    };
  };

  const mergeDetalleOptions = (opciones = [], detallesActuales = []) => {
    const merged = new Map();

    [...opciones, ...detallesActuales].forEach((detalle) => {
      const normalizado = normalizeDetalleOption(detalle);

      if (!normalizado) return;

      merged.set(Number(normalizado.value), normalizado);
    });

    return [...merged.values()];
  };

  const loadCurrentDetalleData = async (detallesSeleccionados) => {
    if (!detallesSeleccionados.length) {
      return [];
    }

    const respuestas = await Promise.all(
      detallesSeleccionados.map((detalleId) =>
        Servs.getDetalleAccionById(detalleId),
      ),
    );

    return respuestas
      .map((respuesta, index) => {
        if (!respuesta?.ok || !respuesta?.data) {
          return null;
        }

        return normalizeDetalleOption(
          respuesta.data,
          detallesSeleccionados[index],
        );
      })
      .filter(Boolean);
  };

  const resolveTipoFromCurrentDetalles = (detallesActuales, tipos) => {
    const tipoIdDetalle = detallesActuales
      .map((detalle) =>
        normalizeId(
          detalle?.tipo_accion_id ??
            detalle?.tipoAccionId ??
            detalle?.tipo_id ??
            detalle?.tipoAccion?.id,
        ),
      )
      .find((id) => id !== null);

    if (tipoIdDetalle === null || tipoIdDetalle === undefined) {
      return null;
    }

    return getCatalogValue(tipos, tipoIdDetalle);
  };

  const findTipoForDetalles = async (tipos, detallesSeleccionados) => {
    if (!tipos.length || !detallesSeleccionados.length) {
      return null;
    }

    const idsSeleccionados = detallesSeleccionados.map(Number);

    const resultados = await Promise.all(
      tipos.map(async (tipo) => {
        const respuesta = await Servs.getDetallesAccion(tipo.value);

        return {
          tipo,
          detalles: safeData(respuesta),
        };
      }),
    );

    return (
      resultados.find(({ detalles: opciones }) => {
        const idsDisponibles = opciones.map((item) => Number(item.value));

        return idsSeleccionados.every((id) => idsDisponibles.includes(id));
      }) ||
      resultados.find(({ detalles: opciones }) => {
        const idsDisponibles = opciones.map((item) => Number(item.value));

        return idsSeleccionados.some((id) => idsDisponibles.includes(id));
      }) ||
      null
    );
  };

  const loadAccion = async (catalogosCargados) => {
    const [respuesta, historial] = await Promise.all([
      Servs.getById(accionId),

      Servs.getHistorialAccion(accionId, {
        page: 1,
        limit: 100,
      }),
    ]);

    if (!respuesta?.ok) {
      setMensaje(respuesta?.message || 'No se pudo obtener la acción');

      return;
    }

    if (!historial?.ok) {
      setPagosValidados(false);

      setMensaje(
        historial?.message ||
          'No se pudo validar qué detalles de la acción ya fueron pagados.',
      );
    } else {
      setPagosValidados(true);
    }

    /**
     * Tu API devuelve:
     *
     * {
     *   ok: true,
     *   dato: {...}
     * }
     *
     * Pero por compatibilidad dejamos también
     * soporte para response.data.
     */
    const accion = respuesta.dato ?? respuesta.data ?? {};

    const detallesSeleccionados = extractDetalleIds(accion);

    const detallesActuales = await loadCurrentDetalleData(
      detallesSeleccionados,
    );

    /**
     * Ahora tu API ya devuelve directamente:
     *
     * tipo_accion_id
     *
     * por ejemplo:
     *
     * tipo_accion_id: 1
     */
    const tipoDirecto =
      accion.tipo_accion_id ??
      accion.tipoAccionId ??
      accion.tipo_id ??
      accion.tipoAccion?.id ??
      null;

    let tipoSeleccionado =
      tipoDirecto !== null && tipoDirecto !== undefined
        ? getCatalogValue(catalogosCargados.tipos, tipoDirecto)
        : resolveTipoFromCurrentDetalles(
            detallesActuales,
            catalogosCargados.tipos,
          );

    let opcionesDetalle = [];

    if (tipoSeleccionado) {
      const respuestaDetalles = await Servs.getDetallesAccion(tipoSeleccionado);

      opcionesDetalle = mergeDetalleOptions(
        safeData(respuestaDetalles),
        detallesActuales,
      );
    }

    if (!tipoSeleccionado) {
      const coincidencia = await findTipoForDetalles(
        catalogosCargados.tipos,
        detallesSeleccionados,
      );

      if (coincidencia) {
        tipoSeleccionado = coincidencia.tipo.value;

        opcionesDetalle = mergeDetalleOptions(
          coincidencia.detalles,
          detallesActuales,
        );
      }
    }

    /**
     * Formulario que será utilizado visualmente.
     */
    const formData = {
      socio_id: getCatalogValue(catalogosCargados.socios, accion.socio_id),

      calle_id: getCatalogValue(catalogosCargados.calles, accion.calle_id),

      tarifa_id: getCatalogValue(catalogosCargados.tarifas, accion.tarifa_id),

      nro_medidor: accion.nro_medidor ?? '',

      direccion: accion.direccion ?? '',

      observacion: accion.observacion ?? '',

      estado: accion.estado ?? 'ACTIVO',

      detallesAccion: detallesSeleccionados.map(Number),
    };

    /**
     * Estado actual del formulario.
     */
    setForm(formData);

    /**
     * IMPORTANTE:
     *
     * Guardamos una copia independiente
     * para poder comparar después.
     */
    setOriginalForm({
      ...formData,

      detallesAccion: [...formData.detallesAccion],
    });

    if (tipoSeleccionado) {
      setTipoId(tipoSeleccionado);

      setDetalles(opcionesDetalle);

      setDetallesPagadosIds(
        resolvePaidDetalleIds(
          historial,
          opcionesDetalle,
          detallesSeleccionados,
        ),
      );

      return;
    }

    setTipoId('');
    setDetalles(detallesActuales);
    setDetallesPagadosIds([]);

    setMensaje(
      detallesSeleccionados.length
        ? 'No se pudo obtener el tipo de los detalles actuales.'
        : 'Esta acción no tiene detalles asociados.',
    );
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  /**
   * En creación se puede seleccionar tipo.
   *
   * En edición NO permitimos modificarlo.
   */
  const selectTipo = async (id) => {
    if (isEditing) {
      return;
    }

    const respuesta = await Servs.getDetallesAccion(id);

    const nuevasOpciones = safeData(respuesta);

    if (!respuesta?.ok) {
      if (respuesta?.message) {
        setMensaje(respuesta.message);
      }

      return;
    }

    setTipoId(id);

    setDetalles(nuevasOpciones);

    setForm((prev) => ({
      ...prev,
      detallesAccion: [],
    }));

    setErrors((prev) => ({
      ...prev,
      detallesAccion: undefined,
    }));

    setMensaje('');
  };

  const toggleDetalle = (id) => {
    const detalleId = Number(id);

    if (isEditing && detallesPagadosIds.includes(detalleId)) {
      return;
    }

    setForm((prev) => ({
      ...prev,

      detallesAccion: prev.detallesAccion.includes(detalleId)
        ? prev.detallesAccion.filter((item) => item !== detalleId)
        : [...prev.detallesAccion, detalleId],
    }));

    setErrors((prev) => ({
      ...prev,
      detallesAccion: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && !pagosValidados) {
      setMensaje(
        'No se pudo validar el historial de pagos. Intente nuevamente antes de guardar.',
      );

      return;
    }

    /**
     * No permitimos quitar detalles ya pagados.
     */
    if (
      isEditing &&
      detallesPagadosIds.some(
        (detalleId) => !form.detallesAccion.includes(detalleId),
      )
    ) {
      setErrors((prev) => ({
        ...prev,

        detallesAccion:
          'Los detalles ya pagados no pueden quitarse de la acción.',
      }));

      return;
    }

    const validation = isEditing
      ? validateAccionEdit(form)
      : validateAccion(form);

    if (!validation.isValid) {
      setErrors(validation.errors);

      return;
    }

    setSaving(true);
    setMensaje('');

    try {
      let payload;

      /**
       * CREACIÓN
       *
       * Mandamos todos los datos.
       */
      if (!isEditing) {
        payload = validation.data;
      }

      /**
       * EDICIÓN
       *
       * Mandamos solamente las propiedades
       * realmente modificadas.
       */
      if (isEditing) {
        payload = getChangedFields(originalForm, validation.data);

        console.log('FORM ORIGINAL:', originalForm);

        console.log('FORM ACTUAL:', validation.data);

        console.log('CAMBIOS A ENVIAR:', payload);

        /**
         * El usuario abrió la modal
         * y presionó guardar sin cambiar nada.
         */
        if (Object.keys(payload).length === 0) {
          setMensaje('No realizó ningún cambio.');

          setSaving(false);

          return;
        }
      }

      const respuesta = isEditing
        ? await Servs.update(accionId, payload)
        : await Servs.create(payload);

      if (!respuesta?.ok) {
        setMensaje(
          respuesta?.message ||
            `No se pudo ${isEditing ? 'actualizar' : 'registrar'} la acción`,
        );

        setSaving(false);

        return;
      }

      await onCreated?.();

      setSaving(false);

      close();
    } catch (error) {
      console.error(error);

      setMensaje(error?.message || 'Ocurrió un error al guardar la acción.');

      setSaving(false);
    }
  };

  useEffect(() => {
    if (!open) return undefined;

    let active = true;

    const initialize = async () => {
      reset();

      setLoadingData(true);

      try {
        const catalogosCargados = await loadCatalogos();

        if (!active) return;

        if (accionId) {
          await loadAccion(catalogosCargados);
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setMensaje('No se pudieron cargar los datos.');
        }
      } finally {
        if (active) {
          setLoadingData(false);
        }
      }
    };

    initialize();

    return () => {
      active = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accionId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              {isEditing ? 'Editar acción' : 'Nueva acción'}
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {isEditing ? 'Actualizar acción' : 'Registrar acción'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? 'Modifique únicamente los datos necesarios.'
                : 'Seleccione el tipo y complete los datos del registro.'}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        <div className="p-6">
          {loadingData ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-sm font-medium text-slate-500">
              <ArrowPathIcon className="h-5 w-5 animate-spin" />

              {isEditing
                ? 'Cargando datos de la acción...'
                : 'Cargando catálogos...'}
            </div>
          ) : (
            <>
              {/* TIPO DE ACCIÓN */}
              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">
                    1. Tipo de acción
                  </h3>

                  <p className="text-sm text-slate-500">
                    {isEditing
                      ? 'El tipo de acción no puede modificarse.'
                      : 'Seleccione el tipo de acción.'}
                  </p>
                </div>

                <div
                  className={isEditing ? 'pointer-events-none opacity-60' : ''}
                >
                  <TipoAccionCards
                    options={catalogos.tipos}
                    value={tipoId}
                    onChange={selectTipo}
                  />
                </div>

                {!catalogos.tipos.length && (
                  <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                    No se encontraron tipos de acción para mostrar.
                  </p>
                )}
              </section>

              {tipoId && (
                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-7 border-t border-slate-200 pt-7"
                >
                  {/* DATOS */}
                  <section>
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900">
                        2. Datos de la acción
                      </h3>

                      <p className="text-sm text-slate-500">
                        Información principal del socio y del medidor.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {/* SOCIO */}
                      <div
                        className={
                          isEditing ? 'pointer-events-none opacity-60' : ''
                        }
                      >
                        <SelectComponent
                          label="Socio"
                          name="socio_id"
                          options={catalogos.socios}
                          value={form.socio_id}
                          onChange={handleChange}
                          error={errors.socio_id}
                        />
                      </div>

                      {/* CALLE */}
                      <SelectComponent
                        label="Calle"
                        name="calle_id"
                        options={catalogos.calles}
                        value={form.calle_id}
                        onChange={handleChange}
                        error={errors.calle_id}
                      />

                      {/* TARIFA */}
                      <SelectComponent
                        label="Tarifa de agua"
                        name="tarifa_id"
                        options={catalogos.tarifas}
                        value={form.tarifa_id}
                        onChange={handleChange}
                        error={errors.tarifa_id}
                      />

                      {/* MEDIDOR */}
                      <ElegantInput
                        label="Número de medidor"
                        name="nro_medidor"
                        value={form.nro_medidor}
                        onChange={handleChange}
                        error={errors.nro_medidor}
                      />

                      {/* DIRECCIÓN */}
                      <ElegantInput
                        label="Dirección"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        error={errors.direccion}
                        required
                      />

                      {/* ESTADO */}
                      <SelectComponent
                        label="Estado"
                        name="estado"
                        options={estadoOptions}
                        value={form.estado}
                        onChange={handleChange}
                        error={errors.estado}
                      />
                    </div>
                  </section>

                  {/* DETALLES */}
                  <section>
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900">
                        3. Detalles
                      </h3>

                      <p className="text-sm text-slate-500">
                        {isEditing
                          ? 'Puede agregar o quitar detalles. Los detalles pagados permanecen bloqueados.'
                          : 'Seleccione los detalles que corresponden a esta acción.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {detalles.map((detalle) => {
                        const detalleId = Number(detalle.value);

                        const selected =
                          form.detallesAccion.includes(detalleId);

                        const isPaid =
                          isEditing && detallesPagadosIds.includes(detalleId);

                        return (
                          <button
                            key={detalle.value}
                            type="button"
                            onClick={() => toggleDetalle(detalle.value)}
                            disabled={isPaid}
                            title={
                              isPaid
                                ? 'Este detalle ya fue pagado y no puede quitarse'
                                : undefined
                            }
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                px-4
                                py-2
                                text-sm
                                font-medium
                                transition

                                ${
                                  isPaid
                                    ? 'cursor-not-allowed border-amber-300 bg-amber-50 text-amber-800'
                                    : selected
                                      ? 'border-emerald-600 bg-emerald-600 text-white'
                                      : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
                                }
                              `}
                          >
                            {isPaid && <LockClosedIcon className="h-4 w-4" />}

                            <span>{detalle.label}</span>

                            {isPaid && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                Pagado
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {errors.detallesAccion && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        {errors.detallesAccion}
                      </p>
                    )}
                  </section>

                  {/* OBSERVACIÓN */}
                  <section>
                    <ElegantTextarea
                      label="Observación"
                      name="observacion"
                      value={form.observacion}
                      onChange={handleChange}
                      error={errors.observacion}
                      rows={3}
                      maxLength={500}
                    />
                  </section>

                  {mensaje && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {mensaje}
                    </div>
                  )}

                  {/* FOOTER */}
                  <footer className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                    <button
                      type="button"
                      onClick={close}
                      disabled={saving}
                      className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      ) : (
                        <CheckCircleIcon className="h-5 w-5" />
                      )}

                      {saving
                        ? isEditing
                          ? 'Guardando...'
                          : 'Registrando...'
                        : isEditing
                          ? 'Guardar cambios'
                          : 'Registrar acción'}
                    </button>
                  </footer>
                </form>
              )}

              {mensaje && !tipoId && (
                <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {mensaje}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
