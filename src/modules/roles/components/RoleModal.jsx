import { useEffect, useMemo, useState } from 'react';
import ElegantInput from '../../../components/ElegantInput';
import FormModal from '../../../components/FormModal';
import { validateRole } from '../schema/roles.schema';

const emptyForm = { nombre_rol: '', permisos: [] };

export default function RoleModal({ open, role, permisos, saving, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(role || emptyForm);
    setErrors({});
    setSearch('');
  }, [open, role]);

  const visiblePermissions = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return permisos;
    return permisos.filter((item) => `${item.nombre_permiso} ${item.codigo_permiso}`.toLowerCase().includes(value));
  }, [permisos, search]);

  const togglePermission = (id) => {
    setForm((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(id)
        ? prev.permisos.filter((permissionId) => permissionId !== id)
        : [...prev.permisos, id],
    }));
    setErrors((prev) => ({ ...prev, permisos: '' }));
  };

  const submit = (event) => {
    event.preventDefault();
    const validation = validateRole(form);
    if (!validation.success) return setErrors(validation.errors);
    onSave(validation.data);
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={role ? 'Editar rol' : 'Nuevo rol'}
      description="Define el nombre del rol y los permisos que tendrá dentro del sistema."
    >
      <form onSubmit={submit} className="space-y-5">
        <ElegantInput
          label="Nombre del rol"
          name="nombre_rol"
          value={form.nombre_rol}
          onChange={({ target }) => {
            setForm((prev) => ({ ...prev, nombre_rol: target.value }));
            setErrors((prev) => ({ ...prev, nombre_rol: '' }));
          }}
          error={errors.nombre_rol}
          required
        />

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-700">Permisos</label>
            <span className="text-xs text-slate-500">{form.permisos.length} seleccionados</span>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar permiso..."
            className="mb-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <div className="grid max-h-72 gap-2 overflow-y-auto rounded-2xl border border-slate-200 p-3 md:grid-cols-2">
            {visiblePermissions.map((permission) => (
              <label key={permission.id} className="flex cursor-pointer gap-3 rounded-xl p-3 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={form.permisos.includes(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-800">{permission.nombre_permiso}</span>
                  <span className="block text-xs text-slate-400">{permission.codigo_permiso}</span>
                </span>
              </label>
            ))}
          </div>

          {errors.permisos && <p className="mt-2 text-sm font-medium text-red-500">{errors.permisos}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            {saving ? 'Guardando...' : role ? 'Guardar cambios' : 'Crear rol'}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
