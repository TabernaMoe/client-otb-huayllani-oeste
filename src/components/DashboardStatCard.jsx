export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  iconClass = 'bg-emerald-50 text-emerald-700',
  valueClass = 'text-slate-900',
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className={`mt-2 text-2xl font-black ${valueClass}`}>
            {value}
          </p>
        </div>

        {Icon && (
          <div className={`rounded-2xl p-3 ${iconClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </article>
  );
}