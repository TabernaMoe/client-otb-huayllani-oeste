import { useEffect, useState } from 'react';
import ElegantInput from '../../../components/ElegantInput';
import SelectComponent from '../../../components/Select';
import FormModal from '../../../components/FormModal';
import { validateUsuario } from '../schema/admin.schema';

const emptyForm = {
  cargo: '',
  cedula_identidad: '',
  ci_expedido: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  contrasenia: '',
  rol_id: null,
};

export default function UsuarioModal({ open, user, roles, saving, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(user ? { ...user, contrasenia: '' } : emptyForm);
  }, [open, user]);

  const change = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const submit = (event) => {
    event.preventDefault();
    const validation = validateUsuario(form);
    if (!validation.success) return setErrors(validation.errors);
    onSave(validation.data);
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={user ? 'Editar usuario' : 'Nuevo usuario'}
      description="Completa los datos de la persona administrativa y asigna su rol."
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <ElegantInput label="Cargo" name="cargo" value={form.cargo} onChange={change} error={errors.cargo} required />
          <SelectComponent label="Rol" name="rol_id" value={form.rol_id} options={roles} onChange={change} error={errors.rol_id} />
          <ElegantInput label="Cédula de identidad" name="cedula_identidad" value={form.cedula_identidad} onChange={change} error={errors.cedula_identidad} required />
          <ElegantInput label="Expedido" name="ci_expedido" value={form.ci_expedido} onChange={change} error={errors.ci_expedido} placeholder="Ej. CB, LP, SC" required />
          <ElegantInput label="Nombre" name="nombre" value={form.nombre} onChange={change} error={errors.nombre} required />
          <ElegantInput label="Apellido paterno" name="apellido_paterno" value={form.apellido_paterno} onChange={change} error={errors.apellido_paterno} required />
          <ElegantInput label="Apellido materno" name="apellido_materno" value={form.apellido_materno} onChange={change} error={errors.apellido_materno} required />
          <ElegantInput label="Contraseña" name="contrasenia" type="password" value={form.contrasenia} onChange={change} error={errors.contrasenia} required />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {saving ? 'Guardando...' : user ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
