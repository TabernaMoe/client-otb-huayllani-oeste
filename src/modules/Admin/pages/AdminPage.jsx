import { useEffect, useMemo, useState } from 'react';
import { PencilSquareIcon, PlusIcon, PowerIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import ConfirmModal from '../../../components/ConfirmModal';
import PageHeader from '../../../components/PageHeader';
import UsuariosRolesTabs from '../../../components/UsuariosRolesTabs';
import UsuarioModal from '../components/UsuarioModal';
import { AdminServices } from '../services/admin.services';

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await AdminServices.getAll({ page, limit });
      setUsuarios(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, [page, limit]);

  useEffect(() => {
    AdminServices.getRoles()
      .then((response) => setRoles(response.data))
      .catch((error) => toast.error(error.response?.data?.message || 'No se pudieron cargar los roles'));
  }, []);

  const edit = async (id) => {
    try {
      const response = await AdminServices.getById(id);
      setModal(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo obtener el usuario');
    }
  };

  const save = async (payload) => {
    try {
      setSaving(true);
      if (modal?.id) await AdminServices.update(modal.id, payload);
      else await AdminServices.create(payload);
      toast.success(modal?.id ? 'Usuario actualizado' : 'Usuario creado');
      setModal(null);
      await loadUsuarios();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    try {
      setSaving(true);
      await AdminServices.toggleStatus(confirm.id);
      toast.success('Estado actualizado');
      setConfirm(null);
      await loadUsuarios();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo cambiar el estado');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'nombre_completo',
      header: 'Usuario',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-slate-900">{row.original.nombre_completo}</p>
          <p className="text-xs text-slate-500">CI {row.original.cedula_identidad}</p>
        </div>
      ),
    },
    { accessorKey: 'cargo', header: 'Cargo' },
    { accessorKey: 'nombre_rol', header: 'Rol' },
    {
      accessorKey: 'estado_usuario',
      header: 'Estado',
      cell: ({ getValue }) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getValue() ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {getValue() ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => edit(row.original.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Editar">
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setConfirm(row.original)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Cambiar estado">
            <PowerIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Usuarios"
        description="Administra las personas con acceso al sistema y el rol asignado."
        action={(
          <button type="button" onClick={() => setModal({})} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <PlusIcon className="h-5 w-5" /> Nuevo usuario
          </button>
        )}
      />

      <UsuariosRolesTabs />

      <DataTable
        data={usuarios}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(value) => { setLimit(value); setPage(1); }}
      />

      <UsuarioModal
        open={modal !== null}
        user={modal?.id ? modal : null}
        roles={roles}
        saving={saving}
        onClose={() => setModal(null)}
        onSave={save}
      />

      <ConfirmModal
        open={Boolean(confirm)}
        title="Cambiar estado"
        message={confirm ? `¿Deseas cambiar el estado de ${confirm.nombre_completo}?` : ''}
        loading={saving}
        onClose={() => setConfirm(null)}
        onConfirm={toggleStatus}
      />
    </section>
  );
}
