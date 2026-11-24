import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchFilterBar({
  search,
  value,
  onSearchChange,
  onChange,
  onSubmit,
  placeholder = 'Buscar...',
  label,
  children = null,
}) {
  const inputValue = search ?? value ?? '';
  const handleChange = onSearchChange ?? onChange;
  const resolvedLabel = label ?? (children ? 'Buscar' : null);

  const content = (
    <div
      className={`grid items-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
        children ? 'md:grid-cols-[1fr_220px]' : ''
      }`}
    >
      <div className="w-full">
        {resolvedLabel && (
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            {resolvedLabel}
          </label>
        )}
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 h-5 w-5 text-slate-400" />
          <input
            value={inputValue}
            onChange={(event) => handleChange?.(event.target.value)}
            placeholder={placeholder}
            className="h-[46px] w-full rounded-[14px] border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>
      {children}
    </div>
  );

  if (!onSubmit) return content;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(inputValue);
      }}
    >
      {content}
    </form>
  );
}
