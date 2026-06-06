import {
  PencilSquareIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';

export default function AdminTable({
  usuarios = [],
  loading = false,
  onEdit,
  onToggleStatus,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
        Cargando usuarios...
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
        No hay usuarios registrados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 font-semibold">Usuario</th>
            <th className="px-4 py-3 font-semibold">Rol</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 text-right font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => {
            const nombreRol =
              usuario.rol?.nombre_rol ||
              usuario.nombre_rol ||
              usuario.rol ||
              'Sin rol';

            return (
              <tr
                key={usuario.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-600">
                  {usuario.id}
                </td>

                <td className="px-4 py-3 font-semibold text-slate-800">
                  {usuario.nombre_usuario}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {nombreRol}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      usuario.estado
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {usuario.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(usuario)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      title="Editar usuario"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleStatus(usuario)}
                      className={`rounded-xl border p-2 transition ${
                        usuario.estado
                          ? 'border-red-200 text-red-700 hover:bg-red-50'
                          : 'border-green-200 text-green-700 hover:bg-green-50'
                      }`}
                      title={
                        usuario.estado
                          ? 'Deshabilitar usuario'
                          : 'Habilitar usuario'
                      }
                    >
                      <PowerIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}