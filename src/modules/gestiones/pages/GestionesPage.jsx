import { useEffect, useState } from 'react';
import {
  CalendarDaysIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { GestionesServices } from '../services/gestiones.services';
import { validateGestionForm } from '../schema/gestiones.schema';

const initialForm = {
  anio: '',
};

export default function GestionesPage() {
  const [gestiones, setGestiones] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const fetchGestiones = async () => {
    setLoading(true);
    setMessage('');

    const response = await GestionesServices.getAll();

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar gestiones');
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
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(initialForm);
    setErrors({});
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

    const validation = validateGestionForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setMessage('');

    const payload = {
      anio: Number(form.anio),
    };

    const response = await GestionesServices.create(payload);

    setSaving(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al crear gestión');
      return;
    }

    setMessage('Gestión creada correctamente');
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
      return;
    }

    setMessage('Gestión eliminada correctamente');
    fetchGestiones();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-red-50 p-3 text-red-800">
            <CalendarDaysIcon className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Gestiones
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Administra las gestiones anuales del sistema.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-900"
        >
          <PlusIcon className="h-5 w-5" />
          Nueva gestión
        </button>
      </div>

      {message && (
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {message}
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        {loading ? (
          <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
            Cargando gestiones...
          </div>
        ) : gestiones.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
            No hay gestiones registradas
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Gestión</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {gestiones.map((gestion) => {
                  const id = gestion.id || gestion.gestion_id;
                  const anio = gestion.anio || gestion.gestion;
                  const estado = gestion.estado ?? gestion.is_active ?? true;

                  return (
                    <tr
                      key={id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-slate-600">{id}</td>

                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {anio}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            estado
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {estado ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDelete(gestion)}
                            className="rounded-xl border border-red-200 p-2 text-red-700 transition hover:bg-red-50"
                            title="Eliminar gestión"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Nueva gestión
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Registra una nueva gestión anual.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Año
                </label>

                <input
                  type="number"
                  name="anio"
                  value={form.anio}
                  onChange={handleChange}
                  placeholder="Ej. 2026"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100"
                />

                {errors.anio && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.anio}
                  </p>
                )}
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
                  className="rounded-2xl bg-red-800 px-5 py-3 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-60"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}