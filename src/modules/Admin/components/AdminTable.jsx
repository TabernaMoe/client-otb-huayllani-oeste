import { useMemo } from 'react';

import DataTable from '../../../components/DataTable';

export default function AdminTable({
  usuarios = [],
  loading,
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'nombre_usuario',
        header: 'Usuario',
        cell: (info) => info.row.original.nombre_usuario,
      },
      {
        accessorKey: 'rol',
        header: 'Rol',
        cell: (info) => info.row.original.rol,
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: (info) => info.row.original.estado,
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onEdit(row.original)}
              className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => onDelete(row.original)}
              className="rounded-xl bg-red-700 px-3 py-2 text-white hover:bg-red-800"
            >
              Deshabilitar
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <DataTable
      data={usuarios}
      columns={columns}
      loading={loading}
      page={page}
      totalPages={totalPages}
      totalItems={totalItems}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
    />
  );
}