import { useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  BoltIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  RectangleStackIcon,
  ScaleIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { LecturasServices } from '../services/lecturas.services';
import { validateLecturaForm } from '../schema/lecturas.schema';

const initialForm = {
  lectura_actual: '',
  observacion: '',
};

const getData = (response) =>
  response?.data || response?.dato || response || {};

const getRows = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.rows)) return response.rows;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const inputClass = (hasError = false) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

export default function LecturasPage() {
  const [acciones, setAcciones] = useState([]);
  const [selectedAccion, setSelectedAccion] = useState(null);
  const [selectedLectura, setSelectedLectura] = useState(null);
  const [detalleAccion, setDetalleAccion] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [historialOpen, setHistorialOpen] = useState(false);
  const [mode, setMode] = useState('create');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  const fetchLecturas = async () => {
    setLoading(true);
    setMessage('');

    const response = await LecturasServices.getAll(page, limit, search);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar lecturas');
      setMessageType('error');
      setAcciones([]);
      return;
    }

    setAcciones(getRows(response));
    setPagination(response);
  };

  useEffect(() => {
    fetchLecturas();
  }, [page, search]);

  const openHistorial = async (accion) => {
    setMessage('');

    const response = await LecturasServices.getById(accion.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al obtener historial');
      setMessageType('error');
      return;
    }

    setDetalleAccion(getData(response));
    setHistorialOpen(true);
  };

  const openCreate = (accion) => {
    setMode('create');
    setSelectedAccion(accion);
    setSelectedLectura(null);
    setForm(initialForm);
    setErrors({});
    setMessage('');
    setModalOpen(true);
  };

  const openEdit = async (accion) => {
    setMessage('');

    const response = await LecturasServices.getById(accion.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al obtener lectura');
      setMessageType('error');
      return;
    }

    const data = getData(response);
    const lecturas = data.lecturas || [];
    const ultimaLectura = lecturas[0];

    if (!ultimaLectura) {
      setMessage('Esta acción todavía no tiene lecturas registradas');
      setMessageType('error');
      return;
    }

    setMode('edit');
    setSelectedAccion(data);
    setSelectedLectura(ultimaLectura);

    setForm({
      lectura_actual: ultimaLectura.lectura_actual || '',
      observacion: ultimaLectura.observacion || '',
    });

    setErrors({});
    setModalOpen(true);
  };

  const openCambioMedidor = (accion) => {
    setMode('cambio');
    setSelectedAccion(accion);
    setSelectedLectura(null);
    setForm({
      lectura_actual: '',
      observacion: 'Cambio de medidor',
    });
    setErrors({});
    setMessage('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedAccion(null);
    setSelectedLectura(null);
    setForm(initialForm);
    setErrors({});
  };

  const closeHistorial = () => {
    setHistorialOpen(false);
    setDetalleAccion(null);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateLecturaForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage('Revise los campos marcados antes de guardar.');
      setMessageType('error');
      return;
    }

    setSaving(true);
    setMessage('');

    let response;

    if (mode === 'create') {
      response = await LecturasServices.create(
        selectedAccion.id,
        validation.data,
      );
    }

    if (mode === 'edit') {
      response = await LecturasServices.update(
        selectedLectura.id,
        validation.data,
      );
    }

    if (mode === 'cambio') {
      response = await LecturasServices.cambioMedidor(
        selectedAccion.id,
        validation.data,
      );
    }

    setSaving(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al guardar lectura');
      setMessageType('error');
      return;
    }

    setMessage(
      mode === 'cambio'
        ? 'Cambio de medidor registrado correctamente'
        : mode === 'edit'
          ? 'Lectura actualizada correctamente'
          : 'Lectura registrada correctamente',
    );
    setMessageType('success');

    closeModal();
    fetchLecturas();
  };

  const getModalTitle = () => {
    if (mode === 'create') return 'Registrar nueva lectura';
    if (mode === 'edit') return 'Editar última lectura';
    return 'Registrar cambio de medidor';
  };

  const getModalDescription = () => {
    if (mode === 'create') {
      return 'Ingresa la lectura actual del medidor seleccionado.';
    }

    if (mode === 'edit') {
      return 'Actualiza los datos de la última lectura registrada.';
    }

    return 'Registra la lectura inicial después del cambio de medidor.';
  };

  const getNombreSocio = (accion) =>
    accion?.nombre_completo ||
    accion?.socio?.nombre_completo ||
    accion?.socio ||
    '-';

  const getUltimaLectura = (accion) => {
    const lectura = accion?.lecturas?.[0];
    return lectura?.lectura_actual ?? '-';
  };

  const getConsumo = (accion) => {
    const lectura = accion?.lecturas?.[0];
    return Number(lectura?.consumo_m3 || 0);
  };

  const resumen = useMemo(() => {
    const conLectura = acciones.filter(
      (accion) => Array.isArray(accion?.lecturas) && accion.lecturas.length > 0,
    ).length;

    const sinLectura = acciones.length - conLectura;

    const consumoVisible = acciones.reduce(
      (sum, accion) => sum + getConsumo(accion),
      0,
    );

    return {
      total: acciones.length,
      conLectura,
      sinLectura,
      consumoVisible,
    };
  }, [acciones]);

  const totalPages = Number(pagination?.totalPages || 1);

  const messageClasses =
    messageType === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-red-200 bg-red-50 text-red-700';

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Inicio</span>
              <span>/</span>
              <span>Agua</span>
              <span>/</span>
              <span className="text-emerald-700">Lecturas</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de lecturas
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Registra lecturas, revisa historiales y controla cambios de medidor.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLecturas}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <ArrowPathIcon
              className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar datos
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Acciones visibles"
            value={resumen.total}
            icon={RectangleStackIcon}
            iconClass="bg-slate-100 text-slate-700"
          />

          <MetricCard
            label="Con lectura"
            value={resumen.conLectura}
            icon={CheckCircleIcon}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Sin lectura"
            value={resumen.sinLectura}
            icon={DocumentTextIcon}
            iconClass="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Consumo visible"
            value={`${resumen.consumoVisible} m³`}
            icon={ChartBarIcon}
            iconClass="bg-blue-50 text-blue-700"
          />
        </div>

        {message && (
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${messageClasses}`}
          >
            {messageType === 'success' ? (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            )}

            <span>{message}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  1
                </span>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Acciones y medidores
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Busca una acción para registrar o consultar sus lecturas.
                  </p>
                </div>
              </div>

              <div className="relative w-full xl:w-96">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  placeholder="Buscar acción, socio o medidor"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setSearch('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Limpiar búsqueda"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-275 w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Acción</th>
                  <th className="px-4 py-4">Socio</th>
                  <th className="px-4 py-4">Medidor</th>
                  <th className="px-4 py-4">Calle</th>
                  <th className="px-4 py-4">Tarifa</th>
                  <th className="px-4 py-4">Última lectura</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Cargando lecturas...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : acciones.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                          <DocumentTextIcon className="h-8 w-8" />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-700">
                          No hay acciones disponibles
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                          No se encontraron acciones con los criterios actuales.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  acciones.map((accion) => (
                    <tr
                      key={accion.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4">
                        <div className="flex min-w-44 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                            <BoltIcon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              Acción #{accion.codigo_interno || accion.id}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              Registro de consumo de agua
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                          <span className="font-semibold text-slate-700">
                            {getNombreSocio(accion)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                          {accion.nro_medidor || 'Sin medidor'}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPinIcon className="h-4 w-4 text-slate-400" />
                          {accion.nombre_calle || '-'}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-600">
                          {accion.nombre_tarifa || '-'}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          <ScaleIcon className="h-4 w-4" />
                          {getUltimaLectura(accion)} m³
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openHistorial(accion)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                            title="Ver historial"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openCreate(accion)}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            title="Nueva lectura"
                          >
                            <PlusIcon className="h-4 w-4" />
                            Lectura
                          </button>

                          <button
                            type="button"
                            onClick={() => openEdit(accion)}
                            className="rounded-lg border border-amber-200 p-2 text-amber-700 transition hover:bg-amber-50"
                            title="Editar última lectura"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openCambioMedidor(accion)}
                            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                            title="Cambio de medidor"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">
                {acciones.length}
              </span>{' '}
              acciones
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((previous) => previous - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
                {page}
              </span>

              <span className="px-1 text-sm text-slate-400">
                de {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  loading ||
                  (pagination?.totalPages
                    ? page >= pagination.totalPages
                    : acciones.length < limit)
                }
                onClick={() => setPage((previous) => previous + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Página siguiente"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                  {mode === 'cambio' ? (
                    <ArrowPathIcon className="h-6 w-6" />
                  ) : (
                    <DocumentTextIcon className="h-6 w-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Lecturas</span>
                    <span>/</span>
                    <span className="text-emerald-700">
                      {mode === 'create'
                        ? 'Nueva'
                        : mode === 'edit'
                          ? 'Editar'
                          : 'Cambio de medidor'}
                    </span>
                  </div>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {getModalTitle()}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {getModalDescription()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 p-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <InfoBox
                      label="Acción"
                      value={`#${selectedAccion?.codigo_interno || selectedAccion?.id || '-'}`}
                    />

                    <InfoBox
                      label="Socio"
                      value={getNombreSocio(selectedAccion)}
                    />

                    <InfoBox
                      label="Medidor"
                      value={selectedAccion?.nro_medidor || '-'}
                    />
                  </div>
                </div>

                {message && messageType === 'error' && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <section>
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      1
                    </span>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Datos de lectura
                      </h3>

                      <p className="mt-0.5 text-sm text-slate-500">
                        Registra el valor actual y una observación opcional.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Lectura actual
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <ScaleIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                          type="number"
                          name="lectura_actual"
                          min="0"
                          step="0.01"
                          value={form.lectura_actual}
                          onChange={handleChange}
                          placeholder="Ej. 150"
                          className={`${inputClass(
                            Boolean(errors.lectura_actual),
                          )} pl-11`}
                        />
                      </div>

                      {errors.lectura_actual && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                          <ExclamationCircleIcon className="h-4 w-4" />
                          {errors.lectura_actual}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Observación
                      </label>

                      <textarea
                        name="observacion"
                        value={form.observacion}
                        onChange={handleChange}
                        placeholder="Ingrese una observación"
                        rows="4"
                        className={`${inputClass()} resize-none`}
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      Guardar lectura
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {historialOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeHistorial();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                  <ChartBarIcon className="h-6 w-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Lecturas</span>
                    <span>/</span>
                    <span className="text-emerald-700">Historial</span>
                  </div>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Historial de lecturas
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Acción #{detalleAccion?.codigo_interno || detalleAccion?.id} ·{' '}
                    {getNombreSocio(detalleAccion)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeHistorial}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <HistoryMetric
                  label="Medidor"
                  value={detalleAccion?.nro_medidor || '-'}
                  icon={ScaleIcon}
                />

                <HistoryMetric
                  label="Calle"
                  value={detalleAccion?.nombre_calle || '-'}
                  icon={MapPinIcon}
                />

                <HistoryMetric
                  label="Tarifa"
                  value={detalleAccion?.nombre_tarifa || '-'}
                  icon={BoltIcon}
                />
              </div>

              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-212.5 w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80">
                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">Periodo</th>
                      <th className="px-4 py-3">Anterior</th>
                      <th className="px-4 py-3">Actual</th>
                      <th className="px-4 py-3">Consumo</th>
                      <th className="px-4 py-3">Observación</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(detalleAccion?.lecturas || []).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-14 text-center">
                          <DocumentTextIcon className="mx-auto h-8 w-8 text-slate-300" />
                          <p className="mt-3 text-sm font-medium text-slate-500">
                            No hay lecturas registradas
                          </p>
                        </td>
                      </tr>
                    ) : (
                      detalleAccion.lecturas.map((lectura) => (
                        <tr
                          key={lectura.id}
                          className="transition hover:bg-slate-50/80"
                        >
                          <td className="px-4 py-4 font-semibold text-slate-600">
                            #{String(lectura.id).padStart(4, '0')}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {lectura.periodo_id}
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            {lectura.lectura_anterior}
                          </td>

                          <td className="px-4 py-4 font-bold text-slate-900">
                            {lectura.lectura_actual}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                              {lectura.consumo_m3} m³
                            </span>
                          </td>

                          <td className="max-w-64 px-4 py-4 text-slate-500">
                            {lectura.observacion || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={closeHistorial}
                  className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Cerrar historial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MetricCard({ label, value, icon: Icon, iconClass }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className={`rounded-full p-3 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}

function InfoBox({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-slate-800">
        {value || '-'}
      </p>
    </div>
  );
}

function HistoryMetric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2 text-emerald-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value || '-'}</p>
        </div>
      </div>
    </div>
  );
}