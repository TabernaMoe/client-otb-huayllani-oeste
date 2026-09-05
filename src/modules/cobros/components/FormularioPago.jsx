import {
  BanknotesIcon,
  CreditCardIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';

import ElegantInput
  from '../../../components/ElegantInput';

import SelectComponent
  from '../../../components/Select';


const metodoPagoOptions = [

  {
    value:
      'QR',

    label:
      'QR',
  },

  {
    value:
      'EFECTIVO',

    label:
      'Efectivo',
  },
];


export default function FormularioPago({
  form,
  errors = {},
  saving = false,
  onChange,
  onSubmit,
}) {

  return (

    <form
      onSubmit={
        onSubmit
      }
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <h3 className="text-sm font-bold text-slate-900">

        Registrar pago

      </h3>


      <p className="mt-1 text-xs text-slate-500">

        Complete los datos para procesar el pago.

      </p>


      <div className="mt-5 space-y-4">

        {/* ===================================================
            MÉTODO
        ==================================================== */}

        <SelectComponent
          label="Método de pago"
          placeholder="Seleccione método"
          name="metodo_pago"
          options={
            metodoPagoOptions
          }
          value={
            form.metodo_pago
          }
          onChange={
            onChange
          }
          error={
            errors.metodo_pago
          }
        />


        {/* ===================================================
            MONTO
        ==================================================== */}

        <ElegantInput
          label="Monto a pagar"
          name="monto"
          type="number"
          value={
            form.monto
          }
          onChange={
            onChange
          }
          placeholder="Ingrese el monto"
          error={
            errors.monto
          }
          required
          icon={
            <BanknotesIcon className="h-5 w-5" />
          }
        />


        {errors.socio_id && (

          <p className="text-sm font-medium text-red-500">

            {
              errors.socio_id
            }

          </p>

        )}


        {/* ===================================================
            BOTÓN
        ==================================================== */}

        <button
          type="submit"
          disabled={
            saving ||
            form.cobros.length ===
            0
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {form.metodo_pago ===
          'QR' ? (

            <QrCodeIcon className="h-5 w-5" />

          ) : (

            <CreditCardIcon className="h-5 w-5" />

          )}


          {
            saving

              ? 'Procesando...'

              : form.metodo_pago ===
                'QR'

                ? 'Generar QR'

                : 'Confirmar pago'
          }

        </button>

      </div>

    </form>
  );
}