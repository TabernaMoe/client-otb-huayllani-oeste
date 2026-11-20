export default function PortalStatGrid({ items = [], columns = 'sm:grid-cols-3' }) {
  return (
    <div className={`grid grid-cols-1 gap-3 ${columns}`}>
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {item.label}
          </p>
          <p
            className={`mt-1.5 text-xl font-black ${
              item.valueClass || 'text-slate-900'
            }`}
          >
            {item.value}
          </p>
          {item.helper && (
            <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
          )}
        </article>
      ))}
    </div>
  );
}
