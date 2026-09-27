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
import {
  validateAccion,
  validateAccionEdit,
} from '../schema/acciones.schema';
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

const safeData = (response) =>
  Array.isArray(response?.data) ? response.data : [];

const normalizeId = (value) => {
  if (value === null || value === undefined || value === '') return null;

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
    accion?.detallesAccion ??
    accion?.detalles_accion ??
    accion?.detalles ??
    [];

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
  const estado = String(cobro?.estado ?? '').trim().toUpperCase();
  const montoPagado = Number(cobro?.monto_pagado ?? 0);

  const tipoCobro = String(cobro?.tipo_cobro ?? '').trim().toUpperCase();

  if (tipoCobro && tipoCobro !== 'ACCION') return false;

  // Si existe cualquier monto ya pagado, ese concepto no debe poder quitarse.
  return (
    estado === 'PAGADO' ||
    (Number.isFinite(montoPagado) && montoPagado > 0)
  );
};

const resolvePaidDetalleIds = (historial, opciones, detallesSeleccionados) => {
  const seleccionados = new Set(detallesSeleccionados.map(Number));
  const cobrosPagados = safeData(historial).filter(isPaidCobro);

  if (!cobrosPagados.length) return [];

  const idsDirectos = cobrosPagados
    .map((cobro) =>
      cobro.detalle_accion_id ??
      cobro.detalleAccionId ??
      cobro.detalle_id ??
      null,
    )
    .filter((id) => id !== null && id !== undefined)
    .map(Number)
    .filter((id) => seleccionados.has(id));

  const conceptosPagados = new Set(
    cobrosPagados
      .map((cobro) => normalizeText(cobro.concepto))
      .filter(Boolean),
  );

  const idsPorConcepto = opciones
    .filter((detalle) =>
      seleccionados.has(Number(detalle.value)) &&
      conceptosPagados.has(normalizeText(detalle.label)),
    )
    .map((detalle) => Number(detalle.value));

  const resueltos = [...new Set([...idsDirectos, ...idsPorConcepto])];

  // Si la acción solo tiene un detalle y ya existe un pago de ACCIÓN,
  // ese único detalle necesariamente es el que debe quedar protegido.
  if (!resueltos.length && detallesSeleccionados.length === 1) {
    return [Number(detallesSeleccionados[0])];
  }

  return resueltos;
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
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [detallesPagadosIds, setDetallesPagadosIds] = useState([]);
  const [pagosValidados, setPagosValidados] = useState(true);

  const reset = () => {
    setForm(initialForm);
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
    if (!detallesSeleccionados.length) return [];

    const respuestas = await Promise.all(
      detallesSeleccionados.map((detalleId) =>
        Servs.getDetalleAccionById(detalleId),
      ),
    );

    return respuestas
      .map((respuesta, index) => {
        if (!respuesta?.ok || !respuesta?.data) return null;
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

    if (tipoIdDetalle === null || tipoIdDetalle === undefined) return null;

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
      Servs.getHistorialAccion(accionId, { page: 1, limit: 100 }),
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

    const accion = respuesta.data || {};
    const detallesSeleccionados = extractDetalleIds(accion);

    // El GET de la acción devuelve detallesAccion, pero no siempre incluye
    // tipo_accion_id. Para editar, consultamos directamente cada detalle:
    // GET /admin/accion/detalle/:id. Ese endpoint sí devuelve tipo_accion_id.
    // Así seleccionamos la tarjeta correcta (Normal, Premium, etc.) sin
    // depender de que el detalle siga activo en el catálogo del tipo.
    const detallesActuales = await loadCurrentDetalleData(
      detallesSeleccionados,
    );

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
      const respuestaDetalles = await Servs.getDetallesAccion(
        tipoSeleccionado,
      );

      // Además de los detalles activos del tipo, conservamos los detalles
      // que ya pertenecen a la acción aunque hoy estén inactivos. Esto evita
      // que desaparezcan al editar una acción antigua.
      opcionesDetalle = mergeDetalleOptions(
        safeData(respuestaDetalles),
        detallesActuales,
      );
    }

    // Fallback para instalaciones antiguas donde detalle/:id no devuelva
    // tipo_accion_id. En ese caso intentamos la inferencia por catálogo.
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

    // Usamos exactamente los values de los catálogos para que los selects
    // muestren los datos aunque backend use string y frontend number.
    setForm({
      socio_id: getCatalogValue(catalogosCargados.socios, accion.socio_id),
      calle_id: getCatalogValue(catalogosCargados.calles, accion.calle_id),
      tarifa_id: getCatalogValue(catalogosCargados.tarifas, accion.tarifa_id),
      nro_medidor: accion.nro_medidor ?? '',
      direccion: accion.direccion ?? '',
      observacion: accion.observacion ?? '',
      estado: accion.estado ?? 'ACTIVO',
      detallesAccion: detallesSeleccionados,
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
        ? 'No se pudo obtener el tipo de los detalles actuales. Revise la respuesta de GET /admin/accion/detalle/:id.'
        : 'Esta acción no tiene detalles asociados, por eso no se puede determinar automáticamente su tipo.',
    );
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const selectTipo = async (id) => {
    const respuesta = await Servs.getDetallesAccion(id);
    const nuevasOpciones = safeData(respuesta);

    if (!respuesta?.ok) {
      if (respuesta?.message) setMensaje(respuesta.message);
      return;
    }

    if (isEditing && detallesPagadosIds.length) {
      const idsDisponibles = new Set(
        nuevasOpciones.map((detalle) => Number(detalle.value)),
      );
      const conservaPagados = detallesPagadosIds.every((detalleId) =>
        idsDisponibles.has(detalleId),
      );

      if (!conservaPagados) {
        setMensaje(
          'No puede cambiar a ese tipo porque quitaría un detalle que ya fue pagado.',
        );
        return;
      }
    }

    setTipoId(id);
    setDetalles(nuevasOpciones);
    setForm((prev) => {
      if (!isEditing || !detallesPagadosIds.length) {
        return { ...prev, detallesAccion: [] };
      }

      const idsDisponibles = new Set(
        nuevasOpciones.map((detalle) => Number(detalle.value)),
      );
      const seleccionConservada = prev.detallesAccion.filter((detalleId) =>
        idsDisponibles.has(Number(detalleId)),
      );

      return {
        ...prev,
        detallesAccion: [
          ...new Set([...seleccionConservada, ...detallesPagadosIds]),
        ],
      };
    });
    setErrors((prev) => ({ ...prev, detallesAccion: undefined }));
    setMensaje('');
  };

  const toggleDetalle = (id) => {
    const detalleId = Number(id);

    // Única restricción de negocio para la edición:
    // un detalle que ya recibió un pago no puede desmarcarse.
    if (isEditing && detallesPagadosIds.includes(detalleId)) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      detallesAccion: prev.detallesAccion.includes(detalleId)
        ? prev.detallesAccion.filter((item) => item !== detalleId)
        : [...prev.detallesAccion, detalleId],
    }));

    setErrors((prev) => ({ ...prev, detallesAccion: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing && !pagosValidados) {
      setMensaje(
        'No se pudo validar el historial de pagos. Intente nuevamente antes de guardar.',
      );
      return;
    }

    if (
      isEditing &&
      detallesPagadosIds.some(
        (detalleId) => !form.detallesAccion.includes(detalleId),
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        detallesAccion: 'Los detalles ya pagados no pueden quitarse de la acción.',
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

    const respuesta = isEditing
      ? await Servs.update(accionId, validation.data)
      : await Servs.create(validation.data);

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
  };

  useEffect(() => {
    if (!open) return undefined;

    let active = true;

    const initialize = async () => {
      reset();
      setLoadingData(true);

      const catalogosCargados = await loadCatalogos();

      if (!active) return;

      if (accionId) {
        await loadAccion(catalogosCargados);
      }

      if (active) setLoadingData(false);
    };

    initialize();

    return () => {
      active = false;
    };
    // Se inicializa nuevamente únicamente al abrir o cambiar la acción a editar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accionId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
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
                ? 'Revise los datos actuales y modifique los campos necesarios.'
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
              {isEditing ? 'Cargando datos de la acción...' : 'Cargando catálogos...'}
            </div>
          ) : (
            <>
              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">
                    1. Tipo de acción
                  </h3>
                  <p className="text-sm text-slate-500">
                    {isEditing
                      ? 'Puede conservar o cambiar el tipo de acción.'
                      : 'Elija una carátula para continuar.'}
                  </p>
                </div>

                <TipoAccionCards
                  options={catalogos.tipos}
                  value={tipoId}
                  onChange={selectTipo}
                />

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
                      <SelectComponent
                        label="Socio"
                        name="socio_id"
                        options={catalogos.socios}
                        value={form.socio_id}
                        onChange={handleChange}
                        error={errors.socio_id}
                      />
                      <SelectComponent
                        label="Calle"
                        name="calle_id"
                        options={catalogos.calles}
                        value={form.calle_id}
                        onChange={handleChange}
                        error={errors.calle_id}
                      />
                      <SelectComponent
                        label="Tarifa de agua"
                        name="tarifa_id"
                        options={catalogos.tarifas}
                        value={form.tarifa_id}
                        onChange={handleChange}
                        error={errors.tarifa_id}
                      />
                      <ElegantInput
                        label="Número de medidor"
                        name="nro_medidor"
                        value={form.nro_medidor}
                        onChange={handleChange}
                        error={errors.nro_medidor}
                        required
                      />
                      <ElegantInput
                        label="Dirección"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        error={errors.direccion}
                        required
                      />
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

                  <section>
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900">
                        3. Detalles
                      </h3>
                      <p className="text-sm text-slate-500">
                        {isEditing
                          ? 'Puede agregar o quitar detalles pendientes. Los que ya tienen pago quedan bloqueados.'
                          : 'Seleccione los detalles que corresponden a esta acción.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {detalles.map((detalle) => {
                        const detalleId = Number(detalle.value);
                        const selected = form.detallesAccion.includes(detalleId);
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
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                              isPaid
                                ? 'cursor-not-allowed border-amber-300 bg-amber-50 text-amber-800'
                                : selected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
                            }`}
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
                      <CheckCircleIcon className="h-5 w-5" />
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
