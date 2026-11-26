import { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import SearchFilterBar from '../../../components/SearchFilterBar';
import TableActionButtons from '../../../components/TableActionButtons';
import UsuariosRolesTabs from '../../../components/UsuariosRolesTabs';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { getApiErrorMessage } from '../../../services/error';
import RoleModal from '../components/RoleModal';
import { RolesServices } from '../services/roles.services';

export default function RolesPage() {
  const [permisos, setPermisos] = useState([]);
  const [modalRole, setModalRole] = useState(null);

  const list = usePaginatedList(RolesServices.getAllRoles, {
    errorMessage: 'No se pudieron cargar los roles',
  });
  const { submitting, run } = useAsyncSubmit();

  useEffect(() => {
    RolesServices.getAllPermisos()
      .then((response) => setPermisos(response.data))
      .catch((error) =>
        toast.error(getApiErrorMessage(error, 'No se pudieron cargar los permisos')),
      );
  }, []);

  const handleEdit = useCallback(async (id) => {
    try {
      const response = await RolesServices.getById(id);
      if (!response.data) {
        toast.error('Error: No se encontró el rol solicitado');
        return;
      }
      setModalRole(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo obtener el rol'));
    }
  }, []);

  const handleSave = async (payload) => {
    const isEditing = Boolean(modalRole?.id);
    await run(
      () =>
        isEditing
          ? RolesServices.update(modalRole.id, payload)
          : RolesServices.create(payload),
      {
        successMessage: isEditing ? 'Rol actualizado' : 'Rol creado',
        errorMessage: 'No se pudo guardar el rol',
        onSuccess: async () => {
          setModalRole(null);
          await list.reload();
        },
      },
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_rol',
        header: 'Rol',
        cell: ({ getValue }) => (
          <span className="font-semibold text-slate-900">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'permisos',
        header: 'Permisos',
        cell: ({ getValue }) => {
          const items = Array.isArray(getValue()) ? getValue() : [];
          return (
            <div className="flex max-w-2xl flex-wrap gap-1.5">
              {items.map((permission) => (
                <span
                  key={permission.nombre_permiso}
                  className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                >
                  {permission.nombre_permiso}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => handleEdit(row.original.id)}
            editTitle="Editar rol"
          />
        ),
      },
    ],
    [handleEdit],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Roles y permisos"
        description="Define qué acciones puede realizar cada perfil dentro del sistema."
        action={
          <button
            type="button"
            onClick={() => setModalRole({})}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" /> Nuevo rol
          </button>
        }
      />

      <UsuariosRolesTabs />

      <SearchFilterBar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Buscar rol..."
      />

      <DataTable
        data={list.items}
        columns={columns}
        loading={list.loading}
        page={list.page}
        limit={list.limit}
        totalPages={list.totalPages}
        totalItems={list.total}
        onPageChange={list.setPage}
        onLimitChange={list.setLimit}
      />

      <RoleModal
        open={modalRole !== null}
        role={modalRole?.id ? modalRole : null}
        permisos={permisos}
        saving={submitting}
        onClose={() => setModalRole(null)}
        onSave={handleSave}
      />
    </section>
  );
}
