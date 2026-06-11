import { useEffect, useState } from 'react';

import InputField from '../../../components/InputField';
import PasswordField from '../../../components/PasswordField';
import { RolesServices } from '../../roles/services/roles.services';
import { validateUsuarioForm } from '../schema/admin.schema';

const initialForm = {
  nombre_usuario: '',
  contrasenia_usuario: '',
  rol_id: '',
};

export default function AdminForm({
  user,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const isEdit = Boolean(user);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState('');

  const loadRoles = async () => {
    setLoadingRoles(true);
    setRolesError('');

    const response = await RolesServices.getForSelect();

    setLoadingRoles(false);

    if (!response.ok) {
      setRolesError(response.message || 'Error al cargar roles');
      return;
    }

    setRoles(response.data || response.roles || response.items || []);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (!user) {
      setForm(initialForm);
      return;
    }

    setForm({
      nombre_usuario: user.nombre_usuario || '',
      contrasenia_usuario: '',
      rol_id: user.rol_id || user.rol?.id || '',
    });
  }, [user]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateUsuarioForm(form, isEdit);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const payload = {
      nombre_usuario: form.nombre_usuario.trim(),
      rol_id: Number(form.rol_id),
    };

    if (form.contrasenia_usuario.trim()) {
      payload.contrasenia_usuario = form.contrasenia_usuario.trim();
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField
        label="Nombre de usuario"
        name="nombre_usuario"
        value={form.nombre_usuario}
        onChange={handleChange}
        placeholder="Ej. secretaria_01"
        error={errors.nombre_usuario}
      />

      <PasswordField
        label={isEdit ? 'Nueva contraseña opcional' : 'Contraseña'}
        name="contrasenia_usuario"
        value={form.contrasenia_usuario}
        onChange={handleChange}
        placeholder={
          isEdit
            ? 'Déjalo vacío si no quieres cambiarla'
            : 'Ingrese la contraseña'
        }
        error={errors.contrasenia_usuario}
      />

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Rol
        </label>

        <select
          name="rol_id"
          value={form.rol_id}
          onChange={handleChange}
          disabled={loadingRoles}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
        >
          <option value="">
            {loadingRoles ? 'Cargando roles...' : 'Seleccione un rol'}
          </option>

          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre_rol || rol.nombre || `Rol ${rol.id}`}
            </option>
          ))}
        </select>

        {errors.rol_id && (
          <p className="mt-1 text-sm text-red-600">{errors.rol_id}</p>
        )}

        {rolesError && (
          <p className="mt-1 text-sm text-red-600">{rolesError}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-sky-800 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-900 disabled:opacity-60"
        >
          {loading ? 'Guardando...' : 'Guardar usuario'}
        </button>
      </div>
    </form>
  );
}