import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { LecturasServices } from '../services/lecturas.services';
import { validateLecturaForm } from '../schema/lecturas.schema';

const initialForm = {
  lectura_actual: '',
  observacion: '',
};

const getData = (response) => response?.data || response?.dato || response || {};

const getRows = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.rows)) return response.rows;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

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

  const fetchLecturas = async () => {
    setLoading(true);
    setMessage('');

    const response = await LecturasServices.getAll(page, limit, search);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar lecturas');
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
      return;
    }

    const data = getData(response);
    const lecturas = data.lecturas || [];
    const ultimaLectura = lecturas[0];

    if (!ultimaLectura) {
      setMessage('Esta acción todavía no tiene lecturas registradas');
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLecturaForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
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
      return;
    }

    closeModal();
    fetchLecturas();
  };

  const getModalTitle = () => {
    if (mode === 'create') return 'Nueva lectura';
    if (mode === 'edit') return 'Editar lectura';
    return 'Cambio de medidor';
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

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">
            <DocumentTextIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Lecturas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Registra lecturas, revisa historial y controla cambios de medidor.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {message}
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Buscar acción, socio o medidor..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Socio</th>
                <th className="px-4 py-3 font-semibold">Medidor</th>
                <th className="px-4 py-3 font-semibold">Calle</th>
                <th className="px-4 py-3 font-semibold">Tarifa</th>
                <th className="px-4 py-3 font-semibold">Última lectura</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    Cargando lecturas...
                  </td>
                </tr>
              ) : acciones.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    No hay acciones disponibles
                  </td>
                </tr>
              ) : (
                acciones.map((accion) => (
                  <tr
                    key={accion.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-bold">
                      {accion.codigo_interno || accion.id}
                    </td>

                    <td className="px-4 py-3">{getNombreSocio(accion)}</td>

                    <td className="px-4 py-3">
                      {accion.nro_medidor || '-'}
                    </td>

                    <td className="px-4 py-3">
                      {accion.nombre_calle || '-'}
                    </td>

                    <td className="px-4 py-3">
                      {accion.nombre_tarifa || '-'}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {getUltimaLectura(accion)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openHistorial(accion)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                          title="Ver historial"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openCreate(accion)}
                          className="rounded-xl border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                          title="Nueva lectura"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(accion)}
                          className="rounded-xl border border-amber-200 p-2 text-amber-700 hover:bg-amber-50"
                          title="Editar última lectura"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openCambioMedidor(accion)}
                          className="rounded-xl border border-red-200 p-2 text-red-700 hover:bg-red-50"
                          title="Cambio de medidor"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-slate-500">
              Página {page}
              {pagination.totalPages ? ` de ${pagination.totalPages}` : ''}
            </span>

            <button
              type="button"
              disabled={
                pagination.totalPages
                  ? page >= pagination.totalPages
                  : acciones.length < limit
              }
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {getModalTitle()}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Acción #{selectedAccion?.codigo_interno || selectedAccion?.id}{' '}
                  - {getNombreSocio(selectedAccion)}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Lectura actual
                </label>

                <input
                  type="number"
                  name="lectura_actual"
                  value={form.lectura_actual}
                  onChange={handleChange}
                  placeholder="Ej. 150"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />

                {errors.lectura_actual && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lectura_actual}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Observación
                </label>

                <textarea
                  name="observacion"
                  value={form.observacion}
                  onChange={handleChange}
                  placeholder="Opcional"
                  rows="3"
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {historialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Historial de lecturas
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Acción #{detalleAccion?.codigo_interno || detalleAccion?.id} -{' '}
                  {getNombreSocio(detalleAccion)}
                </p>
              </div>

              <button
                type="button"
                onClick={closeHistorial}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Medidor</p>
                <p className="mt-1 text-lg font-bold">
                  {detalleAccion?.nro_medidor || '-'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Calle</p>
                <p className="mt-1 text-lg font-bold">
                  {detalleAccion?.nombre_calle || '-'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Tarifa</p>
                <p className="mt-1 text-lg font-bold">
                  {detalleAccion?.nombre_tarifa || '-'}
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Periodo</th>
                    <th className="px-4 py-3 font-semibold">Anterior</th>
                    <th className="px-4 py-3 font-semibold">Actual</th>
                    <th className="px-4 py-3 font-semibold">Consumo</th>
                    <th className="px-4 py-3 font-semibold">Observación</th>
                  </tr>
                </thead>

                <tbody>
                  {(detalleAccion?.lecturas || []).length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
                        No hay lecturas registradas
                      </td>
                    </tr>
                  ) : (
                    detalleAccion.lecturas.map((lectura) => (
                      <tr
                        key={lectura.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">{lectura.id}</td>
                        <td className="px-4 py-3">{lectura.periodo_id}</td>
                        <td className="px-4 py-3">
                          {lectura.lectura_anterior}
                        </td>
                        <td className="px-4 py-3">
                          {lectura.lectura_actual}
                        </td>
                        <td className="px-4 py-3 font-bold">
                          {lectura.consumo_m3}
                        </td>
                        <td className="px-4 py-3">
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
                className="rounded-2xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}