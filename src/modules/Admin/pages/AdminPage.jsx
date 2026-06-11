import { useEffect, useState } from 'react';
import {
  PlusIcon,
} from '@heroicons/react/24/outline';

import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import { AdminServices } from '../services/admin.services';

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState(true);

  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [message, setMessage] = useState('');

  const fetchUsuarios = async () => {
    setLoading(true);
    setMessage('');

    const response = await AdminServices.getAll(page, limit, search, estado);

    setLoading(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al cargar usuarios');
      return;
    }

    const data =
      response.data ||
      response.usuarios ||
      response.users ||
      response.items ||
      [];

    const paginationData =
      response.pagination ||
      response.meta ||
      null;

    setUsuarios(data);
    setPagination(paginationData);
  };

  useEffect(() => {
    fetchUsuarios();
  }, [page, search, estado]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    setMessage('');

    const response = selectedUser
      ? await AdminServices.update(selectedUser.id, payload)
      : await AdminServices.create(payload);

    setSaving(false);

    if (!response.ok) {
      setMessage(response.message || 'Error al guardar usuario');
      return;
    }

    setMessage(
      selectedUser
        ? 'Usuario actualizado correctamente'
        : 'Usuario creado correctamente',
    );

    handleCloseModal();
    fetchUsuarios();
  };

  const handleToggleStatus = async (user) => {
    const accion = user.estado ? 'deshabilitar' : 'habilitar';

    const confirm = window.confirm(
      `¿Seguro que deseas ${accion} al usuario "${user.nombre_usuario}"?`,
    );

    if (!confirm) return;

    setMessage('');

    const response = await AdminServices.toggleStatus(user.id);

    if (!response.ok) {
      setMessage(response.message || 'Error al cambiar estado del usuario');
      return;
    }

    setMessage('Estado del usuario actualizado correctamente');
    fetchUsuarios();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de usuarios
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra los usuarios del sistema y sus roles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-900"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo usuario
        </button>
      </div>

      {message && (
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {message}
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Buscar usuario..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100 md:max-w-sm"
          />

          <select
            value={String(estado)}
            onChange={(e) => {
              setPage(1);
              setEstado(e.target.value === 'true');
            }}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-700 focus:ring-4 focus:ring-sky-100"
          >
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        <AdminTable
          usuarios={usuarios}
          loading={loading}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
        />

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
            {pagination?.totalPages ? ` de ${pagination.totalPages}` : ''}
          </span>

          <button
            type="button"
            disabled={
              pagination?.totalPages
                ? page >= pagination.totalPages
                : usuarios.length < limit
            }
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      <AdminModal
        open={modalOpen}
        user={selectedUser}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
}