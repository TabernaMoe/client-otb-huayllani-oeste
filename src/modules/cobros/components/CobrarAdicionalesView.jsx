import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function CobrarAdicionalesView() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <CurrencyDollarIcon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-bold text-slate-900">Cobros adicionales</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        La documentación actual no define un endpoint para registrar cobros adicionales.
      </p>
    </div>
  );
}
