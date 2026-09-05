import {
  PlusCircleIcon,
} from '@heroicons/react/24/outline';


export default function CobrarAdicionalesView() {

  return (

    <div className="space-y-5">

      {/* HEADER */}

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

        <div className="flex items-center gap-3">

          <div className="rounded-full bg-white p-3 text-blue-700">

            <PlusCircleIcon className="h-6 w-6" />

          </div>


          <div>

            <h2 className="font-bold text-blue-900">

              Cobros adicionales

            </h2>


            <p className="mt-1 text-sm text-blue-800/80">

              Registra conceptos extraordinarios o adicionales.

            </p>

          </div>

        </div>

      </div>


      {/* CONTENIDO */}

      <div className="grid gap-5 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="font-bold text-slate-900">

            Datos del cobro adicional

          </h3>


          <p className="mt-1 text-sm text-slate-500">

            Aquí podremos colocar socio, concepto,
            descripción y monto.

          </p>


          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">

            Esperando documentación del endpoint
            de cobros adicionales.

          </div>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="font-bold text-slate-900">

            Resumen

          </h3>


          <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">

            <p className="text-sm text-slate-500">

              Total adicional

            </p>


            <p className="mt-2 text-3xl font-bold text-blue-700">

              Bs 0,00

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}