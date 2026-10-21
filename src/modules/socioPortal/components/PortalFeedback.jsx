export function PortalError({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
      {message}
    </div>
  );
}

export function PortalLoading({ text = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
        {text}
      </div>
    </div>
  );
}

export function PortalEmpty({
  title = 'No hay registros',
  description = 'No existen datos para mostrar.',
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
