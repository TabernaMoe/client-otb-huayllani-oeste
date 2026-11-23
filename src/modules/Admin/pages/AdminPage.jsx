import { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import StatusBadge from '../../../components/StatusBadge';
import TableActionButtons from '../../../components/TableActionButtons';
import UsuariosRolesTabs from '../../../components/UsuariosRolesTabs';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import { usePaginatedList } from '../../../hooks/usePaginatedList';
import { getApiErrorMessage } from '../../../services/error';
import UsuarioModal from '../components/UsuarioModal';
import { AdminServices } from '../services/admin.services';

export default function AdminPage() {
  const [roles, setRoles] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const list = usePaginatedList(AdminServices.getAll, {
    errorMessage: 'No se pudieron cargar los usuarios',
  });
  const { submitting, run } = useAsyncSubmit();

  useEffect(() => {
    AdminServices.getRoles()
      .then((response) => setRoles(response.data))
      .catch((error) =>
        toast.error(getApiErrorMessage(error, 'No se pudieron cargar los roles')),
      );
  }, []);

  const handleEdit = useCallback(async (id) => {
    try {
      const response = await AdminServices.getById(id);
      if (!response.data) {
        toast.error('Error: No se encontró el usuario solicitado');
        return;
      }
      setModalUser(response.data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo obtener el usuario'));
    }
  }, []);

  const handleSave = async (payload) => {
    const isEditing = Boolean(modalUser?.id);
    await run(
      () =>
        isEditing
          ? AdminServices.update(modalUser.id, payload)
          : AdminServices.create(payload),
      {
        successMessage: isEditing ? 'Usuario actualizado' : 'Usuario creado',
        errorMessage: 'No se pudo guardar el usuario',
        onSuccess: async () => {
          setModalUser(null);
          await list.reload();
        },
      },
    );
  };

  const handleToggleStatus = async () => {
    if (!statusTarget) return;
    await run(() => AdminServices.toggleStatus(statusTarget.id), {
      successMessage: 'Estado actualizado',
      errorMessage: 'No se pudo cambiar el estado',
      onSuccess: async () => {
        setStatusTarget(null);
        await list.reload();
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_completo',
        header: 'Usuario',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">
              {row.original.nombre_completo}
            </p>
            <p className="text-xs text-slate-500">
              CI {row.original.cedula_identidad || '—'}
            </p>
          </div>
        ),
      },
      { accessorKey: 'cargo', header: 'Cargo' },
      { accessorKey: 'nombre_rol', header: 'Rol' },
      {
        accessorKey: 'estado_usuario',
        header: 'Estado',
        cell: ({ getValue }) => <StatusBadge value={Boolean(getValue())} />,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <TableActionButtons
            onEdit={() => handleEdit(row.original.id)}
            onToggleStatus={() => setStatusTarget(row.original)}
            editTitle="Editar usuario"
            toggleTitle="Cambiar estado"
          />
        ),
      },
    ],
    [handleEdit],
  );

  return (
    <section className="space-y-5">
      <PageHeader
        title="Usuarios"
        description="Administra las personas con acceso al sistema y el rol asignado."
        action={
          <button
            type="button"
            onClick={() => setModalUser({})}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <PlusIcon className="h-5 w-5" /> Nuevo usuario
          </button>
        }
      />

      <UsuariosRolesTabs />

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

      <UsuarioModal
        open={modalUser !== null}
        user={modalUser?.id ? modalUser : null}
        roles={roles}
        saving={submitting}
        onClose={() => setModalUser(null)}
        onSave={handleSave}
      />

      <ConfirmModal
        open={Boolean(statusTarget)}
        title="Cambiar estado"
        message={
          statusTarget
            ? `¿Deseas cambiar el estado de ${statusTarget.nombre_completo}?`
            : ''
        }
        loading={submitting}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleToggleStatus}
      />
    </section>
  );
}
