import AdminForm from './AdminForm';

export default function AdminModal({
  open,
  user,
  loading = false,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            {user ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {user
              ? 'Actualiza los datos del usuario seleccionado.'
              : 'Registra un nuevo usuario para el sistema.'}
          </p>
        </div>

        <AdminForm
          user={user}
          loading={loading}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}