export default function ModalFooter({
  onCancel,
  saving = false,
  submitLabel = 'Guardar',
  savingLabel = 'Guardando...',
  cancelLabel = 'Cancelar',
}) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {saving ? savingLabel : submitLabel}
      </button>
    </div>
  );
}
