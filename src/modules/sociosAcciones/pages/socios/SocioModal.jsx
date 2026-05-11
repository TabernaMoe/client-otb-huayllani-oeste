import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SocioServices as Servs } from '../../services/socio.services';
import Select from '../../../../components/Select';
import ElegantInput from '../../../../components/ElegantInput';
import ElegantTextarea from '../../../../components/ElegantTextarea';

const initialForm = {
  user_id: '',
  ci_socio: '',
  ci_expedido_socio: 'CB',

  nombres_socio: '',
  primer_apellido_socio: '',
  segundo_apellido_socio: '',

  numero_celular_socio: '',
  numero_telefono_socio: '',

  genero_socio: 'masculino',
  estado_accion: 'activo',

  direccion_socio: '',
};

const opcionesGenero = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
];

const opcionesDepartamento = [
  { value: 'CB', label: 'Cochabamba' },
  { value: 'LP', label: 'La Paz' },
  { value: 'SC', label: 'Santa Cruz' },
];
const opcionesEstadoAccion = [
  { value: 'PASIVO', label: 'Pasivo' },
  { value: 'ACTIVO', label: 'Activo' },
];
export default function SocioModal({ open, onClose, socio, onSuccess }) {
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (socio) {
      setForm({
        user_id: socio.user_id || '',
        ci_socio: socio.ci_socio || '',
        ci_expedido_socio: socio.ci_expedido_socio || 'CB',

        nombres_socio: socio.nombres_socio || '',
        primer_apellido_socio: socio.primer_apellido_socio || '',
        segundo_apellido_socio: socio.segundo_apellido_socio || '',

        numero_celular_socio: socio.numero_celular_socio || '',
        numero_telefono_socio: socio.numero_telefono_socio || '',

        genero_socio: socio.genero_socio || 'masculino',
        estado_accion: socio.estado_accion || 'activo',

        direccion_socio: socio.direccion_socio || '',
      });
    }
    // CREAR
    else {
      setForm(initialForm);
    }
  }, [socio, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,

        user_id: Number(form.user_id),
        ci_socio: Number(form.ci_socio),
      };

      const response = socio
        ? await Servs.update(socio.id, payload)
        : await Servs.create(payload);

      if (!response.ok) {
        toast.error(response.message || 'Error al guardar');
        return;
      }

      toast.success(
        socio
          ? 'Socio actualizado correctamente'
          : 'Socio registrado correctamente',
      );

      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 p-4
      "
    >
      <div
        className="
          max-h-[95vh]
          w-full max-w-5xl
          overflow-y-auto
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
        "
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {socio ? 'Editar socio' : 'Registrar socio'}
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-slate-100
              px-4 py-2
              hover:bg-slate-200
            "
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ElegantInput
              type="text"
              label="Ingrese nombre del socio"
              name="nombres_socio"
              value={form.nombres_socio}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <ElegantInput
              label="Ingrese primer apellido"
              type="text"
              name="primer_apellido_socio"
              value={form.primer_apellido_socio}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <ElegantInput
              label="Ingrese segundo apellido"
              type="text"
              name="segundo_apellido_socio"
              value={form.segundo_apellido_socio}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <Select
              label="Ingrese genero"
              name="genero_socio"
              placeholder="Seleccione un genero"
              value={form.genero_socio}
              options={opcionesGenero}
              onChange={handleChange}
            />

            <ElegantInput
              label={'Ingrese cedula de identidad'}
              type="number"
              name="ci_socio"
              placeholder="CI"
              value={form.ci_socio}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <Select
              label="Seleccione un departamento "
              name="ci_expedido_socio"
              placeholder="Seleccione un genero"
              value={form.ci_expedido_socio}
              options={opcionesDepartamento}
              onChange={handleChange}
            />

            <ElegantInput
              label={'Ingreso numero de celular'}
              type="text"
              name="numero_celular_socio"
              placeholder="Celular"
              value={form.numero_celular_socio}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <ElegantInput
              label={'Ingreso numero de telefono'}
              type="text"
              name="numero_telefono_socio"
              placeholder="Teléfono"
              value={form.numero_telefono_socio}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <Select
              label="Seleccione estado de la accion "
              name="estado_accion"
              placeholder="Seleccione un estado"
              value={form.estado_accion}
              options={opcionesEstadoAccion}
              onChange={handleChange}
            />

            <ElegantTextarea
              name="direccion_socio"
              placeholder="Dirección"
              value={form.direccion_socio}
              onChange={handleChange}
              className="
                min-h-30
                rounded-xl border p-3
                md:col-span-2
              "
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border border-slate-300
                px-6 py-3
                hover:bg-slate-100
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-emerald-800
                px-6 py-3
                text-white
                hover:bg-emerald-900
                disabled:opacity-50
              "
            >
              {loading ? 'Guardando...' : socio ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
