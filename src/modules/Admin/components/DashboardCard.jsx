export default function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </article>
  );
}