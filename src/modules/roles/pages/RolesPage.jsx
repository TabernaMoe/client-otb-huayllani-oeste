import { useEffect, useMemo, useState } from 'react';
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { RolesServices } from '../services/roles.services';
import { validateRoleForm } from '../schema/roles.schema';

const initialForm = {
  nombre_rol: '',
  permisos: [],
};

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [selectedRole, setSelectedRole] = useState(null);
  const [search, setSearch] = useState('');
  const [searchPerms, setSearchPerms] = useState('');

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const normalizePermissionId = (permission) => {
    if (typeof permission === 'number') return permission;
    if (typeof permission === 'string') return Number(permission);

    const id = Number(permission?.id || permission?.permiso_id || permission?.id_permiso);

    return Number.isNaN(id) ? null : id;
  };

  const fetchRoles = async () => {
    setLoading(true);
    setMessage('');

    const response = await RolesServices.getAll(page, limit, search);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar roles');
      return;
    }

    setRoles(response.data || response.roles || response.items || []);
    setPagination(response.pagination || response.meta || response);
  };

  const fetchPermissions = async () => {
    const response = await RolesServices.getPermissions();

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar permisos');
      return;
    }

    setPermissions(response.data || response.permisos || response.permissions || []);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [page, search]);

  const openCreateModal = () => {
    setSelectedRole(null);
    setForm(initialForm);
    setErrors({});
    setMessage('');
    setSearchPerms('');
    setModalOpen(true);
  };

  const openEditModal = async (role) => {
    setMessage('');
    setErrors({});
    setSearchPerms('');

    const response = await RolesServices.getById(role.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al obtener el rol');
      return;
    }

    const roleData = response.data || response.dato || role;

    const rawPermissions =
      roleData.permisos ||
      roleData.permissions ||
      roleData.auth_permisos ||
      [];

    const permissionIds = rawPermissions
      .map((permission) => normalizePermissionId(permission))
      .filter((id) => id !== null);

    setSelectedRole(roleData);

    setForm({
      nombre_rol: roleData.nombre_rol || roleData.nombre || '',
      permisos: permissionIds,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRole(null);
    setForm(initialForm);
    setErrors({});
    setSearchPerms('');
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

  const handlePermissionChange = (permissionId) => {
    const id = Number(permissionId);

    setForm((prev) => {
      const exists = prev.permisos.includes(id);

      return {
        ...prev,
        permisos: exists
          ? prev.permisos.filter((permisoId) => permisoId !== id)
          : [...prev.permisos, id],
      };
    });

    setErrors((prev) => ({
      ...prev,
      permisos: '',
    }));
  };

  const buildPayload = () => {
    const permisos = form.permisos
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    return {
      nombre_rol: form.nombre_rol.trim(),
      permisos,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateRoleForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const payload = buildPayload();

    setSaving(true);

    const response = selectedRole
      ? await RolesServices.update(selectedRole.id, payload)
      : await RolesServices.create(payload);

    setSaving(false);

    if (!response.ok) {
      setMessage(
        response.errors?.[0]?.message ||
          response.message ||
          'Error al guardar el rol',
      );
      return;
    }

    setMessage(
      selectedRole
        ? 'Rol actualizado correctamente'
        : 'Rol creado correctamente',
    );

    closeModal();
    fetchRoles();
  };

  const handleDelete = async (role) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar el rol "${role.nombre_rol}"?`,
    );

    if (!confirmDelete) return;

    const response = await RolesServices.delete(role.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al eliminar el rol');
      return;
    }

    setMessage('Rol eliminado correctamente');
    fetchRoles();
  };

  const filteredPermissions = useMemo(() => {
    const text = searchPerms.trim().toLowerCase();

    if (!text) return permissions;

    return permissions.filter((permission) => {
      const codigo = String(permission.codigo_permiso || '').toLowerCase();
      const nombre = String(permission.nombre_permiso || '').toLowerCase();

      return codigo.includes(text) || nombre.includes(text);
    });
  }, [permissions, searchPerms]);

  const assignedPermissions = filteredPermissions.filter((permission) =>
    form.permisos.includes(Number(permission.id)),
  );

  const availablePermissions = filteredPermissions.filter(
    (permission) => !form.permisos.includes(Number(permission.id)),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Roles y permisos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra los roles del sistema y los permisos asociados.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-900"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo rol
        </button>
      </div>

      {message && (
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {message}
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Buscar rol..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100 md:max-w-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
                <th className="px-4 py-3 font-semibold">Permisos</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center">
                    Cargando roles...
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center">
                    No hay roles registrados
                  </td>
                </tr>
              ) : (
                roles.map((role) => {
                  const rolePermissions =
                    role.permisos ||
                    role.permissions ||
                    role.auth_permisos ||
                    [];

                  return (
                    <tr
                      key={role.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">{role.id}</td>

                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {role.nombre_rol || role.nombre}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {rolePermissions.length > 0 ? (
                            rolePermissions.slice(0, 4).map((permission, index) => (
                              <span
                                key={permission.id || permission.codigo_permiso || index}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                              >
                                {permission.codigo_permiso ||
                                  permission.nombre_permiso ||
                                  permission.nombre ||
                                  `Permiso ${permission}`}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">
                              Sin permisos
                            </span>
                          )}

                          {rolePermissions.length > 4 && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              +{rolePermissions.length - 4}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(role)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            title="Editar"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(role)}
                            className="rounded-xl border border-red-200 p-2 text-sky-700 hover:bg-sky-50"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-5 w-5" />
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
                  : roles.length < limit
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
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-800">
                {selectedRole ? 'Editar rol' : 'Nuevo rol'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Selecciona los permisos que tendrá este rol.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nombre del rol
                </label>

                <input
                  type="text"
                  name="nombre_rol"
                  value={form.nombre_rol}
                  onChange={handleChange}
                  placeholder="Ej. Secretaria, Tesorero, Auxiliar"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
                />

                {errors.nombre_rol && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nombre_rol}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Permisos del sistema
                    </p>
                    <p className="text-xs text-slate-400">
                      Los permisos asignados aparecen marcados en azul. Los
                      disponibles están vacíos.
                    </p>
                  </div>

                  <input
                    type="text"
                    value={searchPerms}
                    onChange={(e) => setSearchPerms(e.target.value)}
                    placeholder="Buscar permiso..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100 md:max-w-sm"
                  />
                </div>

                {errors.permisos && (
                  <p className="mb-3 text-sm text-red-600">
                    {errors.permisos}
                  </p>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl border border-sky-200 bg-sky-50/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-sky-900">
                        Permisos asignados
                      </h3>

                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                        {assignedPermissions.length}
                      </span>
                    </div>

                    <div className="grid max-h-[360px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {assignedPermissions.length === 0 ? (
                        <div className="col-span-full rounded-2xl border border-dashed border-sky-200 bg-white p-6 text-center text-sm text-slate-400">
                          Este rol aún no tiene permisos asignados.
                        </div>
                      ) : (
                        assignedPermissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="group relative cursor-pointer rounded-2xl border border-sky-700 bg-sky-100 p-3 shadow-sm transition hover:bg-sky-200"
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked
                                onChange={() =>
                                  handlePermissionChange(Number(permission.id))
                                }
                                className="mt-1 h-4 w-4 accent-sky-800"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-800">
                                  {permission.nombre_permiso}
                                </p>
                                <p className="truncate text-xs text-sky-800">
                                  {permission.codigo_permiso}
                                </p>
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-700">
                        Permisos disponibles
                      </h3>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {availablePermissions.length}
                      </span>
                    </div>

                    <div className="grid max-h-[360px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {availablePermissions.length === 0 ? (
                        <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
                          No hay permisos disponibles.
                        </div>
                      ) : (
                        availablePermissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-sky-300 hover:bg-slate-50"
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={() =>
                                  handlePermissionChange(Number(permission.id))
                                }
                                className="mt-1 h-4 w-4 accent-sky-800"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {permission.nombre_permiso}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                  {permission.codigo_permiso}
                                </p>
                              </div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
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
                  className="rounded-2xl bg-sky-800 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-900 disabled:opacity-60"
                >
                  {saving ? 'Guardando...' : 'Guardar rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}