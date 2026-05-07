import { useEffect } from 'react';

export default function ConfirmModal({
  open,
  title = 'Confirmación',
  message = '¿Estás seguro?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Card */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className=" w-[92%] max-w-md">
          <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{message}</p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                disabled={loading}
                className={[
                  'rounded-xl px-4 py-2 text-white disabled:opacity-60',
                  danger
                    ? 'bg-[#bb9457] hover:bg-[#a67c3f]'
                    : 'bg-green-900 hover:bg-green-800',
                ].join(' ')}
              >
                {loading ? 'Procesando...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
