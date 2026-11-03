import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircleIcon,
  XMarkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import SelectComponent from '../../../components/Select';

import { validateAccionAlcantarillado } from '../schema/accionesAlcantarillado.schema';
import { AlcantarilladoServices as Servs } from '../services/accionesAlcantarillado.services';

const ESTADOS_BLOQUEADOS = new Set(['PARCIAL', 'PAGADO']);

const initialForm = {
  socio_id: '',
  calle_id: '',
  direccion: '',
  observacion: '',
  detallesAccion: [],
};

// Normalizar los detalles obtenidos del backend
const normalizarDetalles = (items = []) => {
  if (!Array.isArray(items)) return [];

  const mapa = new Map();

  for (const item of items) {
    const id = Number(
      typeof item === 'object' && item !== null
        ? (item.id ?? item.detalle_accion_id ?? item.value)
        : item,
    );

    if (!Number.isSafeInteger(id) || id <= 0) continue;

    const estado =
      typeof item === 'object' && item !== null
        ? String(item.estado ?? 'PENDIENTE').toUpperCase()
        : 'PENDIENTE';

    mapa.set(id, { id, estado });
  }

  return [...mapa.values()];
};

const normalizeForm = (data = {}) => {
  const detalles = normalizarDetalles(data.detallesAccion);

  return {
    socio_id: data.socio_id ?? '',
    calle_id: data.calle_id ?? '',
    direccion: data.direccion ?? '',
    observacion: data.observacion ?? '',
    detallesAccion: detalles.map((item) => item.id),
  };
};

// Comparar arrays de IDs sin importar el orden
const mismosIds = (actuales = [], anteriores = []) => {
  const a = new Set(actuales);
  const b = new Set(anteriores);

  return a.size === b.size && [...a].every((id) => b.has(id));
};

export default function AccionAlcantarilladoModal({
  open,
  onClose,
  onCreated,
  id,
}) {
  const isEditing = id !== null && id !== undefined && id !== '';

  const [catalogos, setCatalogos] = useState({
    socios: [],
    calles: [],
  });

  const [detalles, setDetalles] = useState([]);

  // Detalles originalmente asociados, incluyendo sus estados
  const [detallesOriginales, setDetallesOriginales] = useState([]);

  const [form, setForm] = useState(initialForm);
  const formOriginal = useRef(null);

  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('error');

  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errorCarga, setErrorCarga] = useState(false);

  // Información de los estados por ID
  const estadosPorDetalle = useMemo(() => {
    return new Map(detallesOriginales.map((item) => [item.id, item.estado]));
  }, [detallesOriginales]);

  // Combinar catálogo con detalles existentes
  // para mostrar incluso los que ya no aparecen en el catálogo
  const opcionesDetalles = useMemo(() => {
    const mapa = new Map();

    for (const detalle of detalles) {
      const value = Number(detalle.value);

      if (!Number.isSafeInteger(value) || value <= 0) continue;

      mapa.set(value, {
        value,
        label: detalle.label,
      });
    }

    for (const detalle of detallesOriginales) {
      if (!mapa.has(detalle.id)) {
        mapa.set(detalle.id, {
          value: detalle.id,
          label: `Detalle #${detalle.id}`,
        });
      }
    }

    return [...mapa.values()];
  }, [detalles, detallesOriginales]);

  const reset = () => {
    setForm({ ...initialForm, detallesAccion: [] });
    setDetalles([]);
    setDetallesOriginales([]);
    setCatalogos({ socios: [], calles: [] });
    setErrors({});
    setMensaje('');
    setSaving(false);
    setErrorCarga(false);
    formOriginal.current = null;
  };

  const close = () => {
    if (saving) return;

    reset();
    onClose?.();
  };

  // Cargar catálogos y acción
  useEffect(() => {
    if (!open) return;

    let activo = true;

    const cargarDatos = async () => {
      setLoadingData(true);
      setErrorCarga(false);
      setMensaje('');
      setErrors({});
      setForm({ ...initialForm, detallesAccion: [] });
      setDetallesOriginales([]);
      formOriginal.current = null;

      try {
        const [
          sociosResponse,
          callesResponse,
          detallesResponse,
          accionResponse,
        ] = await Promise.all([
          Servs.getSocios(),
          Servs.getCalles(),
          Servs.getDetalle(),
          isEditing ? Servs.getId({ id }) : Promise.resolve(null),
        ]);

        if (!activo) return;

        const fallo = [
          sociosResponse,
          callesResponse,
          detallesResponse,
          ...(isEditing ? [accionResponse] : []),
        ].find((response) => !response?.ok);

        if (fallo) {
          throw new Error(fallo.message || 'No se pudieron cargar los datos.');
        }

        setCatalogos({
          socios: sociosResponse.data ?? [],
          calles: callesResponse.data ?? [],
        });

        setDetalles(detallesResponse.data ?? []);

        if (isEditing) {
          const accion = accionResponse.data;

          const detallesAsignados = normalizarDetalles(accion.detallesAccion);

          const formulario = normalizeForm(accion);

          setDetallesOriginales(detallesAsignados);
          setForm(formulario);

          // Guardar estado original para detectar cambios
          formOriginal.current = {
            ...formulario,
            detallesAccion: [...formulario.detallesAccion],
          };
        }
      } catch (error) {
        if (activo) {
          setErrorCarga(true);
          setTipoMensaje('error');
          setMensaje(error.message || 'Error al cargar información.');
        }
      } finally {
        if (activo) setLoadingData(false);
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [open, id, isEditing]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setMensaje('');
  };

  // Seleccionar o quitar detalle
  const toggleDetalle = (idDetalle) => {
    const detalleId = Number(idDetalle);

    if (!Number.isSafeInteger(detalleId) || detalleId <= 0) {
      return;
    }

    const estado = estadosPorDetalle.get(detalleId);

    // Impedir modificar detalles con pagos
    if (ESTADOS_BLOQUEADOS.has(estado)) {
      return;
    }

    setForm((prev) => {
      const seleccionado = prev.detallesAccion.includes(detalleId);

      return {
        ...prev,
        detallesAccion: seleccionado
          ? prev.detallesAccion.filter((item) => item !== detalleId)
          : [...prev.detallesAccion, detalleId],
      };
    });

    setErrors((prev) => ({
      ...prev,
      detallesAccion: undefined,
    }));

    setMensaje('');
  };

  // Construir el payload de creación o actualización
  const construirPayload = (dataValidada) => {
    // CREAR: enviar todos los datos
    if (!isEditing) {
      return {
        ...dataValidada,
        socio_id: Number(form.socio_id),
        calle_id: Number(form.calle_id),
        detallesAccion: [...form.detallesAccion],
      };
    }

    // EDITAR: enviar solamente los campos modificados
    const original = formOriginal.current;
    const payload = {};

    if (!original) {
      throw new Error('No se encontró el formulario original.');
    }

    if (String(form.socio_id) !== String(original.socio_id)) {
      payload.socio_id = Number(form.socio_id);
    }

    if (String(form.calle_id) !== String(original.calle_id)) {
      payload.calle_id = Number(form.calle_id);
    }

    if (form.direccion !== original.direccion) {
      payload.direccion = dataValidada.direccion;
    }

    if (form.observacion !== original.observacion) {
      payload.observacion = dataValidada.observacion;
    }

    // Solo enviar detallesAccion cuando cambie la selección.
    // Se envía el conjunto final de IDs para que el backend
    // pueda identificar agregados y eliminados.
    if (!mismosIds(form.detallesAccion, original.detallesAccion)) {
      payload.detallesAccion = [...form.detallesAccion];
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving || errorCarga) return;

    const validation = validateAccionAlcantarillado(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setMensaje('');

    try {
      const payload = construirPayload(validation.data);

      if (isEditing && Object.keys(payload).length === 0) {
        setTipoMensaje('info');
        setMensaje('No se detectaron cambios para guardar.');
        return;
      }

      const respuesta = isEditing
        ? await Servs.update({ id, payload })
        : await Servs.create({ payload });

      if (!respuesta.ok) {
        throw new Error(respuesta.message || 'No se pudo guardar la acción.');
      }

      await onCreated?.();
      reset();
      onClose?.();
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(error.message || 'Ocurrió un error al guardar.');
    } finally {
      setSaving(false);
    }
  };

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
              {isEditing
                ? 'Editar acción de alcantarillado'
                : 'Registrar acción de alcantarillado'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? 'Actualice los datos y detalles permitidos.'
                : 'Complete los datos y seleccione los detalles.'}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={saving}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        <div className="p-6">
          {loadingData ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Cargando información...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* DATOS PRINCIPALES */}
              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">
                    1. Datos de la acción
                  </h3>

                  <p className="text-sm text-slate-500">
                    Información principal del socio y su ubicación.
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

                  <ElegantInput
                    label="Dirección"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    error={errors.direccion}
                    required
                  />
                </div>
              </section>

              {/* DETALLES DE ACCIÓN */}
              <section>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">
                    2. Detalles de la acción
                  </h3>

                  <p className="text-sm text-slate-500">
                    Seleccione los detalles correspondientes. Los detalles con
                    pagos parciales o completos no pueden quitarse.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {opcionesDetalles.map((detalle) => {
                    const detalleId = Number(detalle.value);

                    const selected = form.detallesAccion.includes(detalleId);

                    const estado = estadosPorDetalle.get(detalleId);

                    const bloqueado = ESTADOS_BLOQUEADOS.has(estado);

                    const esNuevo = isEditing && selected && !estado;

                    const fueQuitado = isEditing && !selected && estado;

                    return (
                      <button
                        key={detalleId}
                        type="button"
                        onClick={() => toggleDetalle(detalleId)}
                        disabled={bloqueado || saving}
                        aria-pressed={selected}
                        title={
                          bloqueado
                            ? `Este detalle está ${estado.toLowerCase()} y no puede modificarse`
                            : undefined
                        }
                        className={`flex min-h-12 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          bloqueado
                            ? 'cursor-not-allowed border-amber-300 bg-amber-50 text-amber-800'
                            : selected
                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
                        } disabled:opacity-80`}
                      >
                        {bloqueado ? (
                          <LockClosedIcon className="h-5 w-5 shrink-0" />
                        ) : selected ? (
                          <CheckCircleIcon className="h-5 w-5 shrink-0" />
                        ) : null}

                        <span>{detalle.label}</span>

                        {estado && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              bloqueado
                                ? 'bg-amber-200 text-amber-900'
                                : selected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {estado}
                          </span>
                        )}

                        {esNuevo && (
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                            NUEVO
                          </span>
                        )}

                        {fueQuitado && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                            SE QUITARÁ
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {opcionesDetalles.length === 0 && (
                  <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                    No hay detalles disponibles.
                  </p>
                )}

                {form.detallesAccion.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircleIcon className="h-5 w-5" />

                    <span className="font-medium">
                      {form.detallesAccion.length} detalles seleccionados
                    </span>
                  </div>
                )}

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

              {/* MENSAJES */}
              {mensaje && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    tipoMensaje === 'error'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {mensaje}
                </div>
              )}

              {/* ACCIONES */}
              <footer className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={close}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving || errorCarga}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-5 w-5" />

                  {saving
                    ? 'Guardando...'
                    : isEditing
                      ? 'Guardar cambios'
                      : 'Registrar acción'}
                </button>
              </footer>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
