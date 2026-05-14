import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

import AdminModal from '../components/AdminModal';
import AdminTable from '../components/AdminTable';
import { AdminServices } from '../service/admin.services';

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchUsuarios = async () => {
    try {
      setLoading(true);

      const response = await AdminServices.getAll(
        pagination.page,
        pagination.limit,
        searchInput,
      );

      if (!response.ok) {
        toast.error(response.message || 'Error al cargar usuarios');
        return;
      }

      setUsuarios(response.data || []);

      setPagination((prev) => ({
        ...prev,
        page: response?.pagination?.page || prev.page,
        totalItems: response?.pagination?.totalItems || 0,
        totalPages: response?.pagination?.totalPages || 1,
      }));
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [pagination.page, pagination.limit, searchInput]);

  const handleCreate = () => {
    setSelectedUser(null);
    setOpenModal(true);
  };

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setOpenModal(true);
  };

  const handleAskDelete = (usuario) => {
    setSelectedUser(usuario);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await AdminServices.delete(selectedUser.id);

      if (!response.ok) {
        toast.error(response.message || 'Error al deshabilitar usuario');
        return;
      }

      toast.success('Usuario deshabilitado correctamente');
      setOpenDelete(false);
      setSelectedUser(null);
      fetchUsuarios();
    } catch (error) {
      toast.error(error.message || 'Error inesperado');
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de usuarios
          </h1>
          <p className="text-sm text-slate-500">
            Administra usuarios, roles y permisos del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="rounded-xl bg-emerald-800 px-10 py-2 text-white hover:bg-emerald-900"
        >
          Nuevo usuario
        </button>
      </div>

      <div className="mb-6 rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="w-full md:max-w-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Buscar usuario
          </label>

          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Buscar..."
              value={searchInput}
              onChange={(e) => {
                setPagination((prev) => ({ ...prev, page: 1 }));
                setSearchInput(e.target.value);
              }}
              className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900"
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AdminTable
        usuarios={usuarios}
        loading={loading}
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        limit={pagination.limit}
        onPageChange={(newPage) =>
          setPagination((prev) => ({
            ...prev,
            page: newPage,
          }))
        }
        onLimitChange={(newLimit) =>
          setPagination((prev) => ({
            ...prev,
            page: 1,
            limit: Number(newLimit),
          }))
        }
        onEdit={handleEdit}
        onDelete={handleAskDelete}
      />

      <AdminModal
        open={openModal}
        user={selectedUser}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchUsuarios();
        }}
      />

      {openDelete && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold">Confirmar acción</h2>

            <p className="mt-4">
              ¿Deseas deshabilitar al usuario:{' '}
              <strong>{selectedUser.nombre_usuario}</strong>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenDelete(false)}
                className="rounded-xl border px-4 py-2"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-red-700 px-4 py-2 text-white"
              >
                Deshabilitar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}