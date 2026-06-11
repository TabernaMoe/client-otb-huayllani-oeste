import clsx from 'clsx';

export default function ElegantInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = 'Ingrese un valor',
  error,
  disabled = false,
  required = false,
  autoComplete = 'off',
  icon,
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-sky-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={clsx(
            'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200',
            'placeholder:text-slate-400',
            'focus:ring-4',
            icon ? 'pl-12' : 'pl-4',
            error
              ? 'border-red-400 focus:border-sky-500 focus:ring-sky-100'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100',
            disabled && 'cursor-not-allowed bg-slate-100 text-slate-400',
          )}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-sky-500">{error}</p>
      )}
    </div>
  );
}
