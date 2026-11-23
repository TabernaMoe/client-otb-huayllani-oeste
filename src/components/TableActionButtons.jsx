import {
  EyeIcon,
  PencilSquareIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';

const baseButton =
  'rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40';

export default function TableActionButtons({
  onView,
  onEdit,
  onToggleStatus,
  viewTitle = 'Ver detalle',
  editTitle = 'Editar',
  toggleTitle = 'Cambiar estado',
  extra = null,
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {extra}
      {onView && (
        <button
          type="button"
          onClick={onView}
          className={baseButton}
          title={viewTitle}
          aria-label={viewTitle}
        >
          <EyeIcon className="h-5 w-5" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className={baseButton}
          title={editTitle}
          aria-label={editTitle}
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      )}
      {onToggleStatus && (
        <button
          type="button"
          onClick={onToggleStatus}
          className={baseButton}
          title={toggleTitle}
          aria-label={toggleTitle}
        >
          <PowerIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
