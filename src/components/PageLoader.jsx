export default function PageLoader({ message = 'Cargando vista...' }) {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}