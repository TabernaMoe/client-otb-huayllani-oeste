import { useCallback, useEffect, useState } from 'react';
import { PlusCircleIcon, TagIcon } from '@heroicons/react/24/outline';
import ElegantInput from '../../../components/ElegantInput';
import ElegantTextarea from '../../../components/ElegantTextarea';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { EgresosServices } from '../services/egresos.services';
import { validateCategoriaEgreso } from '../schema/egresos.schema';

const initialForm = {
  nombre_gasto: '',
  descripcion: '',
};

export default function CategoriasEgresoView() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const { submitting, run } = useAsyncSubmit();

  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    const response = await EgresosServices.getCategorias();
    setCategorias(Array.isArray(response?.data) ? response.data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateCategoriaEgreso(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    await run(() => EgresosServices.createCategoria(validation.data), {
      successMessage: (res) => res?.message || 'Categoría creada correctamente',
      errorMessage: 'No se pudo crear la categoría',
      onSuccess: async () => {
        setForm(initialForm);
        setErrors({});
        await cargarCategorias();
      },
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <PlusCircleIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nuevo tipo de egreso</h2>
            <p className="mt-1 text-sm text-slate-500">
              Crea categorías para ordenar y clasificar los gastos de la OTB.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <ElegantInput
            label="Nombre de la categoría"
            name="nombre_gasto"
            value={form.nombre_gasto}
            onChange={handleChange}
            placeholder="Ej: Mantenimiento y reparaciones"
            error={errors.nombre_gasto}
            required
            icon={<TagIcon className="h-5 w-5" />}
          />

          <ElegantTextarea
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe qué gastos pertenecen a esta categoría"
            error={errors.descripcion}
            required
            rows={4}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Crear tipo de egreso'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-bold text-slate-900">Tipos de egreso registrados</h2>
          <p className="mt-1 text-sm text-slate-500">
            Estas categorías estarán disponibles al registrar un nuevo egreso.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Categoría</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-slate-500">Cargando...</td>
                </tr>
              ) : categorias.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-slate-500">No hay tipos de egreso registrados</td>
                </tr>
              ) : (
                categorias.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">{categoria.nombre_gasto}</td>
                    <td className="px-6 py-4 text-slate-600">{categoria.descripcion}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
