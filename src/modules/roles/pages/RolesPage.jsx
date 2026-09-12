import { useEffect, useMemo, useState } from 'react';
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import UsuariosRolesTabs from '../../../components/UsuariosRolesTabs';
import RoleModal from '../components/RoleModal';
import { RolesServices } from '../services/roles.services';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await RolesServices.getAllRoles({ page, limit });
      setRoles(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudieron cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, [page, limit]);

  useEffect(() => {
    RolesServices.getAllPermisos()
      .then((response) => setPermisos(response.data))
      .catch((error) => toast.error(error.response?.data?.message || 'No se pudieron cargar los permisos'));
  }, []);

  const edit = async (id) => {
    try {
      const response = await RolesServices.getById(id);
      setModal(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo obtener el rol');
    }
  };

  const save = async (payload) => {
    try {
      setSaving(true);
      if (modal?.id) await RolesServices.update(modal.id, payload);
      else await RolesServices.create(payload);
      toast.success(modal?.id ? 'Rol actualizado' : 'Rol creado');
      setModal(null);
      await loadRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo guardar el rol');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'nombre_rol',
      header: 'Rol',
      cell: ({ getValue }) => <span className="font-semibold text-slate-900">{getValue()}</span>,
    },
    {
      accessorKey: 'permisos',
      header: 'Permisos',
      cell: ({ getValue }) => (
        <div className="flex max-w-2xl flex-wrap gap-1.5">
          {getValue().map((permission) => (
            <span key={permission.nombre_permiso} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {permission.nombre_permiso}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button type="button" onClick={() => edit(row.original.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800" title="Editar rol">
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Roles y permisos"
        description="Define qué acciones puede realizar cada perfil dentro del sistema."
        action={(
          <button type="button" onClick={() => setModal({})} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
            <PlusIcon className="h-5 w-5" /> Nuevo rol
          </button>
        )}
      />

      <UsuariosRolesTabs />

      <DataTable
        data={roles}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(value) => { setLimit(value); setPage(1); }}
      />

      <RoleModal
        open={modal !== null}
        role={modal?.id ? modal : null}
        permisos={permisos}
        saving={saving}
        onClose={() => setModal(null)}
        onSave={save}
      />
    </section>
  );
}
