import { QrCodeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatMoney, getQrImageSrc } from '../utils/cobros.utils';

export default function QrPagoModal({ pago, onClose }) {
  if (!pago) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <QrCodeIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Pago mediante QR</h2>
              <p className="text-xs text-slate-500">Escanea el código para realizar el pago.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <p className="text-sm text-slate-500">Monto</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{formatMoney(pago.monto)}</p>
          <div className="mx-auto mt-5 max-w-72 rounded-2xl border border-slate-200 p-4">
            <img src={getQrImageSrc(pago.qrImage)} alt="Código QR" className="w-full" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
