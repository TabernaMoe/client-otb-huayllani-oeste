export default function InfoCard({
  icon: Icon,
  label,
  value,
  iconClass = 'bg-emerald-50 text-emerald-700',
  children,
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`rounded-2xl p-3 ${iconClass}`}>
          <Icon className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          {value && (
            <p className="mt-1 truncate text-xl font-black text-slate-900">
              {value}
            </p>
          )}

          {children}
        </div>
      </div>
    </article>
  );
}