import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchFilterBar({
  search = '',
  onSearchChange,
  placeholder = 'Buscar...',
  children = null,
}) {
  return (
    <div
      className={`grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
        children ? 'md:grid-cols-[1fr_220px]' : ''
      }`}
    >
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </div>
      {children}
    </div>
  );
}
