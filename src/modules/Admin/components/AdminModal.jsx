import AdminForm from './AdminForm';

export default function AdminModal({ open, user, onClose, onSuccess }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {user ? 'Editar usuario' : 'Crear usuario'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 hover:bg-slate-200"
          >
            X
          </button>
        </div>

        <AdminForm user={user} onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </div>
  );
}