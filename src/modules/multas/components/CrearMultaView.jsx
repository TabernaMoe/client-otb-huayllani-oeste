import {
  useState,
} from 'react';

import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import ElegantInput
  from '../../../components/ElegantInput';

import {
  MultasServices,
} from '../services/multas.services';

import {
  validateCreateMulta,
} from '../schemas/multas.schema';


const initialForm = {

  nombre_multa:
    '',

  precio:
    '',
};


export default function CrearMultaView({
  onCreated,
}) {

  // =========================================================
  // FORM
  // =========================================================

  const [
    form,
    setForm,
  ] = useState(
    initialForm,
  );


  // =========================================================
  // ERRORES ZOD
  // =========================================================

  const [
    errors,
    setErrors,
  ] = useState({});


  // =========================================================
  // LOADING
  // =========================================================

  const [
    saving,
    setSaving,
  ] = useState(false);


  // =========================================================
  // MENSAJE
  // =========================================================

  const [
    message,
    setMessage,
  ] = useState('');


  const [
    messageType,
    setMessageType,
  ] = useState(
    'success',
  );


  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange =
    (
      event,
    ) => {

      const {
        name,
        value,
      } = event.target;


      setForm(
        (
          previous,
        ) => ({

          ...previous,

          [name]:
            value,
        }),
      );


      setErrors(
        (
          previous,
        ) => ({

          ...previous,

          [name]:
            undefined,
        }),
      );


      setMessage('');
    };


  // =========================================================
  // CREATE
  // =========================================================

  const handleSubmit =
    async (
      event,
    ) => {

      event.preventDefault();


      // ======================================================
      // VALIDAR
      // ======================================================

      const validation =
        validateCreateMulta(
          form,
        );


      if (
        !validation.isValid
      ) {

        setErrors(
          validation.errors,
        );


        setMessage(
          'Revise los datos ingresados.',
        );


        setMessageType(
          'error',
        );


        return;
      }


      try {

        setSaving(
          true,
        );


        setMessage('');


        // ====================================================
        // POST
        // ====================================================

        const response =
          await MultasServices.create(
            validation.data,
          );


        if (
          !response?.ok
        ) {

          setMessage(
            response?.message ||
            'No se pudo registrar la multa.',
          );


          setMessageType(
            'error',
          );


          return;
        }


        setMessage(
          response?.message ||
          'Multa registrada correctamente.',
        );


        setMessageType(
          'success',
        );


        setErrors({});


        setForm(
          initialForm,
        );


        /**
         * Opcional:
         *
         * después de crear,
         * cambiar a Listar Multas.
         */
        window.setTimeout(
          () => {

            onCreated?.();

          },
          600,
        );

      } catch (error) {

        console.error(
          'ERROR CREANDO MULTA:',
          error,
        );


        setMessage(
          error?.message ||
          'Ocurrió un error al registrar la multa.',
        );


        setMessageType(
          'error',
        );

      } finally {

        setSaving(
          false,
        );
      }
    };


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">

      {/* =====================================================
          FORMULARIO
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-start gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

            <PlusCircleIcon className="h-6 w-6" />

          </div>


          <div>

            <h2 className="text-lg font-bold text-slate-900">

              Crear nueva multa

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              Registra un nuevo concepto de multa
              y el precio correspondiente.

            </p>

          </div>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <ElegantInput
              label="Nombre de la multa"
              name="nombre_multa"
              value={
                form.nombre_multa
              }
              onChange={
                handleChange
              }
              placeholder="Ej: Basura en la calle"
              error={
                errors.nombre_multa
              }
              required
              icon={
                <TagIcon className="h-5 w-5" />
              }
            />


            <ElegantInput
              label="Precio"
              name="precio"
              type="number"
              value={
                form.precio
              }
              onChange={
                handleChange
              }
              placeholder="Ej: 200"
              error={
                errors.precio
              }
              required
              icon={
                <CurrencyDollarIcon className="h-5 w-5" />
              }
            />

          </div>


          {message && (

            <div
              className={`
                mt-5 rounded-xl
                border px-4 py-3
                text-sm font-medium

                ${
                  messageType ===
                  'error'

                    ? 'border-red-200 bg-red-50 text-red-700'

                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                }
              `}
            >

              {message}

            </div>

          )}


          <div className="mt-6 flex justify-end">

            <button
              type="submit"
              disabled={
                saving
              }
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >

              <CheckCircleIcon className="h-5 w-5" />


              {
                saving
                  ? 'Registrando...'
                  : 'Registrar multa'
              }

            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          AYUDA
      ====================================================== */}

      <aside className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <h3 className="font-bold text-blue-900">

          ¿Qué estás creando?

        </h3>


        <p className="mt-2 text-sm leading-6 text-blue-800/80">

          Aquí solamente creas el catálogo de multas.
          Todavía no estás aplicando la multa a ningún socio
          ni a ninguna acción.

        </p>


        <div className="mt-5 rounded-xl bg-white p-4">

          <p className="text-xs font-semibold uppercase text-slate-400">

            Ejemplo

          </p>


          <p className="mt-2 font-semibold text-slate-800">

            Basura en la calle

          </p>


          <p className="mt-1 text-sm text-emerald-700">

            Bs 200,00

          </p>

        </div>

      </aside>

    </div>
  );
}