import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function QuickActionCard({
  title,
  description,
  to,
  icon: Icon,
}) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <Icon className="h-7 w-7" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <ArrowRightIcon className="mt-1 h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
      </div>
    </Link>
  );
}