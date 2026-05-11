import clsx from 'clsx';

export default function ElegantTextarea({
  label,
  name,
  value,
  onChange,
  placeholder = 'Escriba aquí...',
  error,
  disabled = false,
  required = false,
  rows = 5,
  maxLength,
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={clsx(
            'w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200',
            'placeholder:text-slate-400',
            'focus:ring-4',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100',
            disabled && 'cursor-not-allowed bg-slate-100 text-slate-400',
          )}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        {error ? (
          <p className="text-sm font-medium text-red-500">{error}</p>
        ) : (
          <span />
        )}

        {maxLength && (
          <p className="text-xs text-slate-400">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
