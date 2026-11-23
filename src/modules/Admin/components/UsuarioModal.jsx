import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import ModalFooter from '../../../components/ModalFooter';
import SelectComponent from '../../../components/Select';
import { validateUsuario } from '../schema/admin.schema';

const EMPTY_FORM = {
  cargo: '',
  cedula_identidad: '',
  ci_expedido: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  contrasenia: '',
  rol_id: null,
};

export default function UsuarioModal({
  open,
  user,
  roles,
  saving,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(user?.id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(user ? { ...EMPTY_FORM, ...user, contrasenia: '' } : EMPTY_FORM);
  }, [open, user]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateUsuario(form, { isEditing });
    if (!validation.success) {
      setErrors(validation.errors);
      toast.error(validation.message);
      return;
    }
    onSave(validation.data);
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar usuario' : 'Nuevo usuario'}
      description="Completa los datos de la persona administrativa y asigna su rol."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <ElegantInput
            label="Cargo"
            name="cargo"
            value={form.cargo}
            onChange={handleChange}
            error={errors.cargo}
            required
          />
          <SelectComponent
            label="Rol"
            name="rol_id"
            value={form.rol_id}
            options={roles}
            onChange={handleChange}
            error={errors.rol_id}
          />
          <ElegantInput
            label="Cédula de identidad"
            name="cedula_identidad"
            value={form.cedula_identidad}
            onChange={handleChange}
            error={errors.cedula_identidad}
            required
          />
          <ElegantInput
            label="Expedido"
            name="ci_expedido"
            value={form.ci_expedido}
            onChange={handleChange}
            error={errors.ci_expedido}
            placeholder="Ej. CB, LP, SC"
            required
          />
          <ElegantInput
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
          />
          <ElegantInput
            label="Apellido paterno"
            name="apellido_paterno"
            value={form.apellido_paterno}
            onChange={handleChange}
            error={errors.apellido_paterno}
            required
          />
          <ElegantInput
            label="Apellido materno"
            name="apellido_materno"
            value={form.apellido_materno}
            onChange={handleChange}
            error={errors.apellido_materno}
            required
          />
          <ElegantInput
            label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            name="contrasenia"
            type="password"
            value={form.contrasenia}
            onChange={handleChange}
            error={errors.contrasenia}
            required={!isEditing}
          />
        </div>

        <ModalFooter
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? 'Guardar cambios' : 'Crear usuario'}
        />
      </form>
    </FormModal>
  );
}
