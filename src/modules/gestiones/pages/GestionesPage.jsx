import { useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { GestionesServices } from '../services/gestiones.services';
import { validateGestionForm } from '../schema/gestiones.schema';

const initialForm = { anio: '' };

const inputClass = (hasError = false) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

export default function GestionesPage() {
  const [gestiones, setGestiones] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const fetchGestiones = async () => {
    setLoading(true);
    setMessage('');

    const response = await GestionesServices.getAll();

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar gestiones');
      setMessageType('error');
      setGestiones([]);
      return;
    }

    setGestiones(response.data || response.gestiones || response.items || []);
  };

  useEffect(() => {
    fetchGestiones();
  }, []);

  const openModal = () => {
    setForm(initialForm);
    setErrors({});
    setMessage('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setForm(initialForm);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateGestionForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage('Revise los campos marcados antes de guardar.');
      setMessageType('error');
      return;
    }

    setSaving(true);
    setMessage('');

    const response = await GestionesServices.create({
      anio: Number(form.anio),
    });

    setSaving(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al crear gestión');
      setMessageType('error');
      return;
    }

    setMessage('Gestión creada correctamente');
    setMessageType('success');
    closeModal();
    fetchGestiones();
  };

  const handleDelete = async (gestion) => {
    const id = gestion.id || gestion.gestion_id;
    const anio = gestion.anio || gestion.gestion;

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar la gestión ${anio}?`,
    );

    if (!confirmDelete) return;

    setMessage('');

    const response = await GestionesServices.delete(id);

    if (!response.ok) {
      setMessage(response.message || 'Error al eliminar gestión');
      setMessageType('error');
      return;
    }

    setMessage('Gestión eliminada correctamente');
    setMessageType('success');
    fetchGestiones();
  };

  const resumen = useMemo(() => {
    const activas = gestiones.filter(
      (gestion) => (gestion.estado ?? gestion.is_active ?? true) === true,
    ).length;

    const anios = gestiones
      .map((gestion) => Number(gestion.anio || gestion.gestion))
      .filter(Boolean);

    return {
      total: gestiones.length,
      activas,
      inactivas: gestiones.length - activas,
      ultima: anios.length ? Math.max(...anios) : '-',
    };
  }, [gestiones]);

  const messageClasses =
    messageType === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Inicio</span><span>/</span><span>Configuración</span><span>/</span>
              <span className="text-emerald-700">Gestiones</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de periodos anuales
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra las gestiones anuales utilizadas por el sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva gestión
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total de gestiones" value={resumen.total} icon={CalendarDaysIcon} iconClass="bg-slate-100 text-slate-700" />
          <MetricCard label="Gestiones activas" value={resumen.activas} icon={CheckCircleIcon} iconClass="bg-emerald-50 text-emerald-700" />
          <MetricCard label="Gestiones inactivas" value={resumen.inactivas} icon={CalendarDaysIcon} iconClass="bg-amber-50 text-amber-700" />
          <MetricCard label="Última gestión" value={resumen.ultima} icon={CalendarDaysIcon} iconClass="bg-blue-50 text-blue-700" />
        </div>

        {message && (
          <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${messageClasses}`}>
            {messageType === 'error' ? (
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">1</span>
                <div>
                  <h2 className="font-bold text-slate-900">Gestiones registradas</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Consulta y administra los periodos disponibles.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchGestiones}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-180 w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Gestión</th>
                  <th className="px-4 py-4">Código</th>
                  <th className="px-4 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
                        <p className="mt-3 text-sm font-medium text-slate-500">Cargando gestiones...</p>
                      </div>
                    </td>
                  </tr>
                ) : gestiones.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                          <CalendarDaysIcon className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 font-bold text-slate-700">No hay gestiones registradas</h3>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">Registra una nueva gestión para comenzar.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  gestiones.map((gestion) => {
                    const id = gestion.id || gestion.gestion_id;
                    const anio = gestion.anio || gestion.gestion;
                    const estado = gestion.estado ?? gestion.is_active ?? true;
                    const estadoBadgeClassName = estado
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-100 text-slate-600';
                    const estadoDotClassName = estado ? 'bg-emerald-500' : 'bg-slate-400';
                    const estadoLabel = estado ? 'Activa' : 'Inactiva';

                    return (
                      <tr key={id} className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                          <div className="flex min-w-56 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                              <CalendarDaysIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">Gestión {anio}</p>
                              <p className="mt-0.5 text-xs text-slate-500">Periodo anual del sistema</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-600">#{String(id).padStart(4, '0')}</span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${estadoBadgeClassName}`}>
                            <span className={`h-2 w-2 rounded-full ${estadoDotClassName}`} />
                            {estadoLabel}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleDelete(gestion)}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                              title="Eliminar gestión"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 bg-white px-5 py-4 lg:px-6">
            <p className="text-sm text-slate-500">
              Total de registros: <span className="font-semibold text-slate-700">{gestiones.length}</span>
            </p>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                  <CalendarDaysIcon className="h-6 w-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Gestiones</span><span>/</span><span className="text-emerald-700">Nueva</span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">Registrar nueva gestión</h2>
                  <p className="mt-1 text-sm text-slate-500">Define el año que estará disponible en el sistema.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
                aria-label="Cerrar modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 p-6">
                {message && messageType === 'error' && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="font-medium">{message}</p>
                  </div>
                )}

                <section>
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">1</span>
                    <div>
                      <h3 className="font-bold text-slate-900">Información de la gestión</h3>
                      <p className="mt-0.5 text-sm text-slate-500">Ingresa el año correspondiente al nuevo periodo.</p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Año <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <CalendarDaysIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        name="anio"
                        min="2000"
                        max="2100"
                        value={form.anio}
                        onChange={handleChange}
                        placeholder="Ej. 2026"
                        className={`${inputClass(Boolean(errors.anio))} pl-11`}
                      />
                    </div>

                    {errors.anio && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                        <ExclamationCircleIcon className="h-4 w-4" />
                        {errors.anio}
                      </p>
                    )}
                  </div>
                </section>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-white p-2 text-blue-700">
                      <CalendarDaysIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">Información</h4>
                      <p className="mt-1 text-xs leading-5 text-blue-800/80">
                        La gestión será utilizada para organizar registros y operaciones por año.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                      Registrar gestión
                    </>
                  )}
                </button>
              </div>
            </form>
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}