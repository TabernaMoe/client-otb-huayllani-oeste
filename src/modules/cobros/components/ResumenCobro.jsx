import {
  formatMoney,
} from '../utils/cobros.utils';


export default function ResumenCobro({
  cantidad = 0,
  total = 0,
}) {

  return (

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <h3 className="text-sm font-bold text-slate-900">

        Resumen del cobro

      </h3>


      <div className="mt-4 space-y-4">

        <div className="flex items-center justify-between gap-3">

          <span className="text-sm text-slate-500">

            Conceptos seleccionados

          </span>


          <span className="text-sm font-bold text-slate-900">

            {cantidad}

          </span>

        </div>


        <div className="flex items-center justify-between gap-3">

          <span className="text-sm text-slate-500">

            Monto pendiente

          </span>


          <span className="text-sm font-bold text-emerald-700">

            {
              formatMoney(
                total,
              )
            }

          </span>

        </div>

      </div>


      <div className="mt-5 border-t border-slate-100 pt-5">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

          Total a cobrar

        </p>


        <p className="mt-2 text-2xl font-bold text-emerald-700">

          {
            formatMoney(
              total,
            )
          }

        </p>

      </div>

    </div>
  );
}