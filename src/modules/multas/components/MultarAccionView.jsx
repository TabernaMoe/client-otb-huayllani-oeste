import { useEffect, useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import SelectComponent from '../../../components/Select';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { CobrosServices } from '../../cobros/services/cobros.services';
import { validateAsignarMulta } from '../schemas/multas.schema';

const INITIAL_FORM = { accion_id: null, multa_id: null };

export default function MultarAccionView() {
  const [acciones, setAcciones] = useState([]);
  const [multas, setMultas] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const { submitting, run } = useAsyncSubmit();

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [accionesResponse, multasResponse] = await Promise.all([
          CobrosServices.getAcciones({ page: 1, limit: 100 }),
          CobrosServices.getMultas(),
        ]);

        setAcciones(
          (accionesResponse?.data ?? []).map((accion) => ({
            value: Number(accion.id),
            label: `${accion.codigo_interno} - ${accion.nombre_completo} - Medidor ${accion.nro_medidor || 'S/N'}`,
          })),
        );
        setMultas(multasResponse?.data ?? []);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateAsignarMulta(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }

    await run(
      () =>
        CobrosServices.asignarMulta(
          validation.data.accionId,
          validation.data.payload,
        ),
      {
        successMessage: (res) => res?.message || 'Multa asignada correctamente',
        errorMessage: 'No se pudo asignar la multa',
        onSuccess: () => {
          setForm(INITIAL_FORM);
          setErrors({});
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
          <ExclamationTriangleIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Multar una acción</h2>
          <p className="mt-1 text-sm text-slate-500">
            Selecciona la acción y la multa que deseas asignar.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <SelectComponent
            label="Acción"
            name="accion_id"
            options={acciones}
            value={form.accion_id}
            onChange={handleChange}
            error={errors.accion_id}
            isDisabled={loading}
            placeholder={loading ? 'Cargando acciones...' : 'Seleccionar acción'}
          />

          <SelectComponent
            label="Multa"
            name="multa_id"
            options={multas}
            value={form.multa_id}
            onChange={handleChange}
            error={errors.multa_id}
            isDisabled={loading}
            placeholder={loading ? 'Cargando multas...' : 'Seleccionar multa'}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || submitting}
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {submitting ? 'Asignando...' : 'Asignar multa'}
          </button>
        </div>
      </form>
    </div>
  );
}
