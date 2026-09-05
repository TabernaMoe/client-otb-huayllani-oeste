import {
  QrCodeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  formatMoney,
  getQrImageSrc,
} from '../utils/cobros.utils';


export default function QrPagoModal({
  open,
  pago,
  onClose,
}) {

  if (
    !open ||
    !pago
  ) {

    return null;
  }


  return (

    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

              <QrCodeIcon className="h-6 w-6" />

            </div>


            <div>

              <h2 className="font-bold text-slate-900">

                Pago mediante QR

              </h2>


              <p className="text-xs text-slate-500">

                Escanee el código para realizar el pago.

              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
          >

            <XMarkIcon className="h-5 w-5" />

          </button>

        </div>


        {/* ===================================================
            BODY
        ==================================================== */}

        <div className="p-6">

          <div className="mb-5 text-center">

            <p className="text-xs font-semibold uppercase text-slate-400">

              Monto a pagar

            </p>


            <p className="mt-1 text-3xl font-bold text-emerald-700">

              {
                formatMoney(
                  pago.amount,
                )
              }

            </p>

          </div>


          <div className="mx-auto flex max-w-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">

            <img
              src={
                getQrImageSrc(
                  pago.qrImage,
                )
              }
              alt="Código QR"
              className="w-full"
            />

          </div>


          <div className="mt-5 flex justify-center">

            <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">

              {
                pago.estado ||
                'PENDIENTE'
              }

            </span>

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
            className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >

            Cerrar

          </button>

        </div>

      </div>

    </div>
  );
}