export default function InputField({
  label,
  error,
  value,
  errorMode = 'message', // 'border' | 'message'
  className = '',
  ...props
}) {
  const base =
    'w-full rounded-xl border px-3 py-2 text-sm shadow-sm ' +
    'focus:outline-none focus:ring-2 min-w-[130px]';

  const normal =
    'border-slate-300 text-slate-700 focus:border-emerald-600 focus:ring-emerald-600';

  const danger =
    'border-red-500 text-red-700 focus:border-red-500 focus:ring-red-500';

  const showError = Boolean(error);
  const showMessage = showError && errorMode === 'message';

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        {...props}
        value={value ?? ''}
        aria-invalid={showError}
        className={`${base} ${showError ? danger : normal}`}
      />

      {showMessage && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
