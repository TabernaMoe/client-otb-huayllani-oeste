import { useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { RolesServices } from '../services/roles.services';
import { validateRoleForm } from '../schema/roles.schema';

const initialForm = {
  nombre_rol: '',
  permisos: [],
};

const inputClass = (hasError = false) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

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
  const [messageType, setMessageType] = useState('success');

  const normalizePermissionId = (permission) => {
    if (typeof permission === 'number') return permission;
    if (typeof permission === 'string') return Number(permission);

    const id = Number(
      permission?.id ||
        permission?.permiso_id ||
        permission?.id_permiso,
    );

    return Number.isNaN(id) ? null : id;
  };

  const fetchRoles = async () => {
    setLoading(true);
    setMessage('');

    const response = await RolesServices.getAll(page, limit, search);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar roles');
      setMessageType('error');
      setRoles([]);
      return;
    }

    setRoles(
      response.data ||
        response.roles ||
        response.items ||
        [],
    );

    setPagination(
      response.pagination ||
        response.meta ||
        response,
    );
  };

  const fetchPermissions = async () => {
    const response = await RolesServices.getPermissions();

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar permisos');
      setMessageType('error');
      return;
    }

    setPermissions(
      response.data ||
        response.permisos ||
        response.permissions ||
        [],
    );
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
      setMessageType('error');
      return;
    }

    const roleData = response.data || response.dato || role;

    const rawPermissions =
      roleData.permisos ||
      roleData.permissions ||
      roleData.auth_permisos ||
      [];

    const permissionIds = rawPermissions
      .map((permission) =>
        normalizePermissionId(permission),
      )
      .filter((id) => id !== null);

    setSelectedRole(roleData);

    setForm({
      nombre_rol:
        roleData.nombre_rol ||
        roleData.nombre ||
        '',
      permisos: permissionIds,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedRole(null);
    setForm(initialForm);
    setErrors({});
    setSearchPerms('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }));

    setMessage('');
  };

  const handlePermissionChange = (permissionId) => {
    const id = Number(permissionId);

    setForm((previous) => {
      const exists = previous.permisos.includes(id);

      return {
        ...previous,
        permisos: exists
          ? previous.permisos.filter(
              (permisoId) => permisoId !== id,
            )
          : [...previous.permisos, id],
      };
    });

    setErrors((previous) => ({
      ...previous,
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateRoleForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage('Revise los campos marcados antes de guardar.');
      setMessageType('error');
      return;
    }

    const payload = buildPayload();

    setSaving(true);
    setMessage('');

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
      setMessageType('error');
      return;
    }

    setMessage(
      selectedRole
        ? 'Rol actualizado correctamente'
        : 'Rol creado correctamente',
    );
    setMessageType('success');

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
      setMessageType('error');
      return;
    }

    setMessage('Rol eliminado correctamente');
    setMessageType('success');
    fetchRoles();
  };

  const filteredPermissions = useMemo(() => {
    const text = searchPerms.trim().toLowerCase();

    if (!text) return permissions;

    return permissions.filter((permission) => {
      const codigo = String(
        permission.codigo_permiso || '',
      ).toLowerCase();

      const nombre = String(
        permission.nombre_permiso || '',
      ).toLowerCase();

      return codigo.includes(text) || nombre.includes(text);
    });
  }, [permissions, searchPerms]);

  const assignedPermissions = filteredPermissions.filter(
    (permission) =>
      form.permisos.includes(Number(permission.id)),
  );

  const availablePermissions = filteredPermissions.filter(
    (permission) =>
      !form.permisos.includes(Number(permission.id)),
  );

  const resumen = useMemo(() => {
    const totalPermisos = roles.reduce((sum, role) => {
      const rolePermissions =
        role.permisos ||
        role.permissions ||
        role.auth_permisos ||
        [];

      return sum + rolePermissions.length;
    }, 0);

    return {
      totalRoles: roles.length,
      totalPermisos,
      permisosSistema: permissions.length,
      promedio:
        roles.length > 0
          ? Math.round(totalPermisos / roles.length)
          : 0,
    };
  }, [roles, permissions]);

  const totalPages = Number(
    pagination?.totalPages || 1,
  );

  const messageClasses =
    messageType === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="space-y-5">
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Inicio</span>
              <span>/</span>
              <span>Seguridad</span>
              <span>/</span>
              <span className="text-emerald-700">
                Roles y permisos
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión de roles y permisos
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra los roles del sistema y define los permisos asignados.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo rol
          </button>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Roles visibles"
            value={resumen.totalRoles}
            icon={UserGroupIcon}
            iconClass="bg-slate-100 text-slate-700"
          />

          <MetricCard
            label="Permisos asignados"
            value={resumen.totalPermisos}
            icon={CheckBadgeIcon}
            iconClass="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Permisos disponibles"
            value={resumen.permisosSistema}
            icon={KeyIcon}
            iconClass="bg-blue-50 text-blue-700"
          />

          <MetricCard
            label="Promedio por rol"
            value={resumen.promedio}
            icon={ShieldCheckIcon}
            iconClass="bg-amber-50 text-amber-700"
          />
        </div>

        {message && (
          <div
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${messageClasses}`}
          >
            {messageType === 'error' ? (
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
            )}

            <span>{message}</span>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 lg:px-6">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">
                  1
                </span>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Roles registrados
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Consulta, edita y elimina los roles configurados.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full sm:w-80">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setPage(1);
                      setSearch(event.target.value);
                    }}
                    placeholder="Buscar rol por nombre"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setPage(1);
                        setSearch('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={fetchRoles}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <ArrowPathIcon
                    className={`h-4 w-4 ${
                      loading ? 'animate-spin' : ''
                    }`}
                  />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-225 w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-4 py-4">Código</th>
                  <th className="px-4 py-4">Permisos</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
                        <p className="mt-3 text-sm font-medium text-slate-500">
                          Cargando roles...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                          <ShieldCheckIcon className="h-8 w-8" />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-700">
                          No hay roles registrados
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-slate-500">
                          Crea un nuevo rol y asigna los permisos que necesite.
                        </p>
                      </div>
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
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-4">
                          <div className="flex min-w-60 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                              <ShieldCheckIcon className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                {role.nombre_rol || role.nombre}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                Rol de acceso al sistema
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-semibold text-slate-600">
                            #{String(role.id).padStart(4, '0')}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex max-w-xl flex-wrap gap-2">
                            {rolePermissions.length > 0 ? (
                              rolePermissions
                                .slice(0, 4)
                                .map((permission, index) => (
                                  <span
                                    key={
                                      permission.id ||
                                      permission.codigo_permiso ||
                                      index
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                  >
                                    <KeyIcon className="h-3.5 w-3.5" />

                                    {permission.codigo_permiso ||
                                      permission.nombre_permiso ||
                                      permission.nombre ||
                                      `Permiso ${permission}`}
                                  </span>
                                ))
                            ) : (
                              <span className="text-sm text-slate-400">
                                Sin permisos asignados
                              </span>
                            )}

                            {rolePermissions.length > 4 && (
                              <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                +{rolePermissions.length - 4}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(role)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(role)}
                              className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                              title="Eliminar rol"
                            >
                              <TrashIcon className="h-4 w-4" />
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

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <p className="text-sm text-slate-500">
              Mostrando{' '}
              <span className="font-semibold text-slate-700">
                {roles.length}
              </span>{' '}
              roles
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() =>
                  setPage((previous) => previous - 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-700">
                {page}
              </span>

              <span className="px-1 text-sm text-slate-400">
                de {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  loading ||
                  (pagination?.totalPages
                    ? page >= pagination.totalPages
                    : roles.length < limit)
                }
                onClick={() =>
                  setPage((previous) => previous + 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="hidden rounded-full bg-emerald-50 p-3 text-emerald-700 sm:block">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Roles</span>
                    <span>/</span>
                    <span className="text-emerald-700">
                      {selectedRole ? 'Editar' : 'Nuevo'}
                    </span>
                  </div>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selectedRole
                      ? 'Editar rol y permisos'
                      : 'Registrar nuevo rol'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Define el nombre del rol y selecciona los permisos que tendrá.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(92vh-90px)] overflow-y-auto"
            >
              <div className="space-y-6 p-6">
                {message && messageType === 'error' && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <section>
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      1
                    </span>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Información del rol
                      </h3>

                      <p className="mt-0.5 text-sm text-slate-500">
                        Ingresa un nombre descriptivo para identificar el rol.
                      </p>
                    </div>
                  </div>

                  <div className="max-w-xl">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nombre del rol
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <ShieldCheckIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        name="nombre_rol"
                        value={form.nombre_rol}
                        onChange={handleChange}
                        placeholder="Ej. Secretaria, Tesorero, Auxiliar"
                        className={`${inputClass(
                          Boolean(errors.nombre_rol),
                        )} pl-11`}
                      />
                    </div>

                    {errors.nombre_rol && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                        <ExclamationCircleIcon className="h-4 w-4" />
                        {errors.nombre_rol}
                      </p>
                    )}
                  </div>
                </section>

                <section>
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                        2
                      </span>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          Permisos del sistema
                        </h3>

                        <p className="mt-0.5 text-sm text-slate-500">
                          Selecciona los permisos que tendrá asignado este rol.
                        </p>
                      </div>
                    </div>

                    <div className="relative w-full md:w-80">
                      <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={searchPerms}
                        onChange={(event) =>
                          setSearchPerms(event.target.value)
                        }
                        placeholder="Buscar permiso"
                        className={`${inputClass()} pl-11 pr-11`}
                      />

                      {searchPerms && (
                        <button
                          type="button"
                          onClick={() => setSearchPerms('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {errors.permisos && (
                    <p className="mb-3 flex items-center gap-1 text-xs font-medium text-red-600">
                      <ExclamationCircleIcon className="h-4 w-4" />
                      {errors.permisos}
                    </p>
                  )}

                  <div className="grid gap-4 lg:grid-cols-2">
                    <PermissionPanel
                      title="Permisos asignados"
                      description="Permisos que actualmente pertenecen al rol."
                      count={assignedPermissions.length}
                      permissions={assignedPermissions}
                      selected
                      onToggle={handlePermissionChange}
                    />

                    <PermissionPanel
                      title="Permisos disponibles"
                      description="Permisos que puedes añadir al rol."
                      count={availablePermissions.length}
                      permissions={availablePermissions}
                      selected={false}
                      onToggle={handlePermissionChange}
                    />
                  </div>
                </section>
              </div>

              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      {selectedRole
                        ? 'Guardar cambios'
                        : 'Registrar rol'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function MetricCard({ label, value, icon: Icon, iconClass }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className={`rounded-full p-3 ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}

function PermissionPanel({
  title,
  description,
  count,
  permissions,
  selected,
  onToggle,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        selected
          ? 'border-emerald-200 bg-emerald-50/40'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h4
            className={`text-sm font-bold ${
              selected ? 'text-emerald-900' : 'text-slate-800'
            }`}
          >
            {title}
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            selected
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      </div>

      <div className="grid max-h-95 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {permissions.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <KeyIcon className="mx-auto h-7 w-7 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-400">
              No hay permisos para mostrar
            </p>
          </div>
        ) : (
          permissions.map((permission) => (
            <label
              key={permission.id}
              className={`cursor-pointer rounded-xl border p-3 transition ${
                selected
                  ? 'border-emerald-200 bg-white hover:bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() =>
                    onToggle(Number(permission.id))
                  }
                  className="mt-1 h-4 w-4 accent-emerald-700"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {permission.nombre_permiso}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {permission.codigo_permiso}
                  </p>
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}