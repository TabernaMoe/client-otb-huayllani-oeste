
/*import { useEffect, useMemo, useState } from 'react';
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
*/





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
  `w-full rounded-xl border bg-white px-4 py-3.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50'
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

    setModalOpen(false);
    setSelectedAccion(null);
    setSelectedLectura(null);
    setForm(initialForm);
    setErrors({});
    fetchLecturas();
  };

  const getModalTitle = () => {
    if (mode === 'create') return 'Registrar lectura';
    if (mode === 'edit') return 'Editar lectura';
    return 'Cambio de medidor';
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

  const tieneLectura = (accion) =>
    Array.isArray(accion?.lecturas) && accion.lecturas.length > 0;

  const resumen = useMemo(() => {
    const conLectura = acciones.filter(tieneLectura).length;
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
      <div className="mx-auto w-full max-w-7xl space-y-4 px-3 py-3 sm:space-y-5 sm:px-5 sm:py-5 lg:px-6">
        {/* HEADER */}
        <header className="rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 py-5 text-white shadow-lg shadow-blue-950/10 sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">
                Lectura de agua
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Gestión de lecturas
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-blue-100">
                Selecciona un socio, revisa su medidor y registra la lectura
                desde cualquier dispositivo.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchLecturas}
              disabled={loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15 disabled:opacity-50 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-2.5"
              title="Actualizar datos"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden text-sm font-semibold sm:inline">
                Actualizar
              </span>
            </button>
          </div>

          {/* STEPPER VISUAL */}
          <div className="mt-5 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2">
            <StepDot active done label="Buscar" number="1" />
            <div className="h-0.5 rounded-full bg-white/35" />
            <StepDot active label="Socio" number="2" />
            <div className="h-0.5 rounded-full bg-white/20" />
            <StepDot label="Lectura" number="3" />
          </div>
        </header>

        {/* MOBILE SUMMARY */}
        <div className="grid grid-cols-3 gap-2 sm:hidden">
          <CompactMetric label="Total" value={resumen.total} />
          <CompactMetric label="Leídos" value={resumen.conLectura} />
          <CompactMetric label="Pendientes" value={resumen.sinLectura} />
        </div>

        {/* DESKTOP SUMMARY */}
        <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
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

        {/* SEARCH */}
        <div className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:static sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <UserIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">
                Seleccionar socio
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Busca por acción, nombre o número de medidor
              </p>
            </div>
          </div>

          <div className="relative mt-3">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Buscar socio o medidor..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Limpiar búsqueda"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="space-y-3 lg:hidden">
          {loading ? (
            <LoadingCard />
          ) : acciones.length === 0 ? (
            <EmptyState />
          ) : (
            acciones.map((accion) => (
              <MobileAccionCard
                key={accion.id}
                accion={accion}
                nombre={getNombreSocio(accion)}
                ultimaLectura={getUltimaLectura(accion)}
                conLectura={tieneLectura(accion)}
                onCreate={() => openCreate(accion)}
                onHistory={() => openHistorial(accion)}
                onEdit={() => openEdit(accion)}
                onCambio={() => openCambioMedidor(accion)}
              />
            ))
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Acciones y medidores
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Selecciona una acción para registrar o consultar lecturas.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                {acciones.length} visibles
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
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
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Cargando lecturas...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : acciones.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16">
                      <EmptyState compact />
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
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <BoltIcon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              Acción #{accion.codigo_interno || accion.id}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Registro de agua
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
                        <ReadingBadge value={getUltimaLectura(accion)} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <IconButton
                            onClick={() => openHistorial(accion)}
                            title="Ver historial"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>

                          <button
                            type="button"
                            onClick={() => openCreate(accion)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                          >
                            <PlusIcon className="h-4 w-4" />
                            Lectura
                          </button>

                          <IconButton
                            onClick={() => openEdit(accion)}
                            title="Editar última lectura"
                            className="text-amber-700"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </IconButton>

                          <IconButton
                            onClick={() => openCambioMedidor(accion)}
                            title="Cambio de medidor"
                            className="text-red-600"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          loading={loading}
          disabledNext={
            pagination?.totalPages
              ? page >= pagination.totalPages
              : acciones.length < limit
          }
          count={acciones.length}
          onPrev={() => setPage((previous) => previous - 1)}
          onNext={() => setPage((previous) => previous + 1)}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[92vh] sm:max-w-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                    3
                  </span>
                  <span>REGISTRAR LECTURA</span>
                </div>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {getModalTitle()}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {getModalDescription()}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
                <SocioSummary
                  accion={selectedAccion}
                  nombre={getNombreSocio(selectedAccion)}
                />

                {message && messageType === 'error' && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Lectura actual
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <ScaleIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      inputMode="decimal"
                      name="lectura_actual"
                      min="0"
                      step="0.01"
                      value={form.lectura_actual}
                      onChange={handleChange}
                      placeholder="Ej. 2680.00"
                      className={`${inputClass(
                        Boolean(errors.lectura_actual),
                      )} pl-12 pr-14 text-lg font-bold`}
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      m³
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Ingresa solamente el valor que muestra el medidor.
                  </p>

                  {errors.lectura_actual && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      {errors.lectura_actual}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    Observación
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      Opcional
                    </span>
                  </label>

                  <textarea
                    name="observacion"
                    value={form.observacion}
                    onChange={handleChange}
                    placeholder="Ej. Medidor con acceso dificultoso..."
                    rows="4"
                    className={`${inputClass()} resize-none`}
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Volver
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {historialOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeHistorial();
            }
          }}
        >
          <div className="flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[92vh] sm:max-w-5xl sm:rounded-3xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                  Historial
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Lecturas del socio
                </h2>
                <p className="mt-1 truncate text-sm text-slate-500">
                  Acción #{detalleAccion?.codigo_interno || detalleAccion?.id} ·{' '}
                  {getNombreSocio(detalleAccion)}
                </p>
              </div>

              <button
                type="button"
                onClick={closeHistorial}
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Cerrar historial"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="grid gap-3 sm:grid-cols-3">
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

              {/* HISTORY MOBILE */}
              <div className="mt-5 space-y-3 sm:hidden">
                {(detalleAccion?.lecturas || []).length === 0 ? (
                  <EmptyState compact />
                ) : (
                  detalleAccion.lecturas.map((lectura) => (
                    <article
                      key={lectura.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-400">
                            PERIODO
                          </p>
                          <p className="mt-1 font-bold text-slate-900">
                            {lectura.periodo_id}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          {lectura.consumo_m3} m³
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <MiniInfo
                          label="Anterior"
                          value={`${lectura.lectura_anterior} m³`}
                        />
                        <MiniInfo
                          label="Actual"
                          value={`${lectura.lectura_actual} m³`}
                          strong
                        />
                      </div>

                      {lectura.observacion && (
                        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                          {lectura.observacion}
                        </p>
                      )}
                    </article>
                  ))
                )}
              </div>

              {/* HISTORY DESKTOP */}
              <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 sm:block">
                <table className="w-full min-w-[760px] text-left text-sm">
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
                          No hay lecturas registradas
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
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
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
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
              <button
                type="button"
                onClick={closeHistorial}
                className="w-full rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-800 sm:ml-auto sm:block sm:w-auto"
              >
                Cerrar historial
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StepDot({ active = false, done = false, label, number }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
          active
            ? 'bg-white text-blue-800 shadow-sm'
            : 'bg-white/15 text-blue-100 ring-1 ring-white/20'
        }`}
      >
        {done ? <CheckCircleIcon className="h-5 w-5" /> : number}
      </div>
      <span
        className={`mt-1 hidden text-[10px] font-semibold sm:block ${
          active ? 'text-white' : 'text-blue-200'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function CompactMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
      <p className="text-lg font-extrabold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, iconClass }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}

function MobileAccionCard({
  accion,
  nombre,
  ultimaLectura,
  conLectura,
  onCreate,
  onHistory,
  onEdit,
  onCambio,
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <UserIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-extrabold text-slate-900">
                  {nombre}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Acción #{accion.codigo_interno || accion.id}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  conLectura
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {conLectura ? 'Con lectura' : 'Pendiente'}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniInfo
                label="Medidor"
                value={accion.nro_medidor || 'Sin medidor'}
              />
              <MiniInfo label="Calle" value={accion.nombre_calle || '-'} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Última lectura
            </p>
            <p className="mt-1 text-lg font-extrabold text-slate-900">
              {ultimaLectura} <span className="text-sm text-slate-400">m³</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-700/15 transition active:scale-[0.98]"
          >
            <PlusIcon className="h-4 w-4" />
            Registrar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/60">
        <MobileActionButton onClick={onHistory} icon={EyeIcon}>
          Historial
        </MobileActionButton>

        <MobileActionButton onClick={onEdit} icon={PencilSquareIcon}>
          Editar
        </MobileActionButton>

        <MobileActionButton onClick={onCambio} icon={ArrowPathIcon}>
          Medidor
        </MobileActionButton>
      </div>
    </article>
  );
}

function MobileActionButton({ onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 items-center justify-center gap-1.5 px-2 py-3 text-xs font-bold text-slate-600 transition active:bg-slate-100"
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function MiniInfo({ label, value, strong = false }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 truncate text-xs ${
          strong ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'
        }`}
      >
        {value || '-'}
      </p>
    </div>
  );
}

function ReadingBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
      <ScaleIcon className="h-4 w-4" />
      {value} m³
    </span>
  );
}

function IconButton({
  onClick,
  title,
  children,
  className = 'text-slate-600',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 ${className}`}
    >
      {children}
    </button>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
      <p className="mt-3 text-sm font-semibold text-slate-500">
        Cargando socios...
      </p>
    </div>
  );
}

function EmptyState({ compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? 'py-6' : 'rounded-2xl border border-slate-200 bg-white px-5 py-10 shadow-sm'
      }`}
    >
      <div className="rounded-full bg-slate-100 p-4 text-slate-400">
        <DocumentTextIcon className="h-8 w-8" />
      </div>

      <h3 className="mt-4 font-bold text-slate-700">
        No hay acciones disponibles
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        No se encontraron socios con los criterios actuales.
      </p>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  loading,
  disabledNext,
  count,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-5">
      <p className="text-xs text-slate-500 sm:text-sm">
        <span className="font-bold text-slate-700">{count}</span> registros
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={onPrev}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-blue-50 px-3 text-sm font-bold text-blue-700">
          {page}
        </span>

        <span className="hidden px-1 text-sm text-slate-400 sm:inline">
          de {totalPages}
        </span>

        <button
          type="button"
          disabled={loading || disabledNext}
          onClick={onNext}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página siguiente"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SocioSummary({ accion, nombre }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
          <UserIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-900">
                {nombre}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Acción #{accion?.codigo_interno || accion?.id || '-'}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
              Activo
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <SummaryRow label="Calle" value={accion?.nombre_calle || '-'} />
            <SummaryRow label="Medidor" value={accion?.nro_medidor || '-'} />
            <SummaryRow label="Tarifa" value={accion?.nombre_tarifa || '-'} />
            <SummaryRow
              label="Anterior"
              value={
                accion?.lecturas?.[0]?.lectura_actual != null
                  ? `${accion.lecturas[0].lectura_actual} m³`
                  : '-'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 truncate font-bold text-slate-700">{value}</p>
    </div>
  );
}

function HistoryMetric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2 text-blue-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 truncate font-bold text-slate-900">{value || '-'}</p>
        </div>
      </div>
    </div>
  );
}