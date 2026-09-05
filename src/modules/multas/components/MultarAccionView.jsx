import {
  useEffect,
  useState,
} from 'react';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import SelectComponent
  from '../../../components/Select';

import {
  CobrosServices,
} from '../../cobros/services/cobros.services';

import {
  validateAsignarMulta,
} from '../schemas/multas.schema';

const initialForm = {

  accion_id:
    null,

  multa_id:
    null,
};


export default function MultarAccionView() {

  // =========================================================
  // OPTIONS
  // =========================================================

  const [
    acciones,
    setAcciones,
  ] = useState([]);


  const [
    multas,
    setMultas,
  ] = useState([]);


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
  // ERRORS
  // =========================================================

  const [
    errors,
    setErrors,
  ] = useState({});


  // =========================================================
  // LOADING
  // =========================================================

  const [
    loadingAcciones,
    setLoadingAcciones,
  ] = useState(false);


  const [
    loadingMultas,
    setLoadingMultas,
  ] = useState(false);


  const [
    saving,
    setSaving,
  ] = useState(false);


  // =========================================================
  // MESSAGE
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
  // CARGAR ACCIONES
  // =========================================================

  const cargarAcciones =
    async () => {

      try {

        setLoadingAcciones(
          true,
        );


        const response =
          await CobrosServices.getAcciones({

            page:
              1,

            limit:
              100,
          });


        if (
          !response?.ok
        ) {

          setAcciones([]);

          return;
        }


        /**
         * El endpoint de acciones
         * devuelve objetos de acción.
         *
         * Los transformamos al formato:
         *
         * {
         *   value,
         *   label
         * }
         *
         * que necesita SelectComponent.
         */
        const options =
          (
            Array.isArray(
              response.data,
            )
              ? response.data
              : []
          ).map(
            (
              accion,
            ) => ({

              value:
                Number(
                  accion.id,
                ),

              label:
                [
                  accion.codigo_interno
                    ? `Acción ${accion.codigo_interno}`
                    : `Acción ${accion.id}`,

                  accion.nombre_completo,

                  accion.nro_medidor
                    ? `Medidor ${accion.nro_medidor}`
                    : null,
                ]
                  .filter(
                    Boolean,
                  )
                  .join(' - '),
            }),
          );


        setAcciones(
          options,
        );

      } catch (error) {

        console.error(
          'ERROR ACCIONES:',
          error,
        );


        setAcciones([]);

      } finally {

        setLoadingAcciones(
          false,
        );
      }
    };


  // =========================================================
  // CARGAR MULTAS
  // =========================================================

  const cargarMultas =
    async () => {

      try {

        setLoadingMultas(
          true,
        );


        const response =
          await CobrosServices.getMultas();


        if (
          !response?.ok
        ) {

          setMultas([]);

          return;
        }


        /**
         * Este endpoint ya devuelve:
         *
         * {
         *   value: 1,
         *   label: "Perros en la calle"
         * }
         *
         * así que NO necesitamos map.
         */
        setMultas(
          Array.isArray(
            response.data,
          )
            ? response.data
            : [],
        );

      } catch (error) {

        console.error(
          'ERROR MULTAS:',
          error,
        );


        setMultas([]);

      } finally {

        setLoadingMultas(
          false,
        );
      }
    };


  // =========================================================
  // PRIMERA CARGA
  // =========================================================

  useEffect(
    () => {

      cargarAcciones();

      cargarMultas();

    },
    [],
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
  // ASIGNAR MULTA
  // =========================================================

  const handleSubmit =
    async (
      event,
    ) => {

      event.preventDefault();


      // ======================================================
      // 1. ZOD
      // ======================================================

      const validation =
        validateAsignarMulta(
          form,
        );


      if (
        !validation.isValid
      ) {

        setErrors(
          validation.errors,
        );


        setMessage(
          'Seleccione una acción y una multa.',
        );


        setMessageType(
          'error',
        );


        return;
      }


      // ======================================================
      // 2. CONFIRMAR
      // ======================================================

      const confirmAssign =
        window.confirm(
          '¿Desea asignar esta multa a la acción seleccionada?',
        );


      if (
        !confirmAssign
      ) {

        return;
      }


      try {

        setSaving(
          true,
        );


        setMessage('');


        // ====================================================
        // 3. POST
        //
        // URL:
        // /admin/cobro/multas/:accionId
        //
        // BODY:
        // { multa_id }
        // ====================================================

        const response =
          await CobrosServices.asignarMulta(

            validation.data
              .accionId,

            validation.data
              .payload,
          );


        if (
          !response?.ok
        ) {

          setMessage(
            response?.message ||
            'No se pudo asignar la multa.',
          );


          setMessageType(
            'error',
          );


          return;
        }


        setErrors({});


        setMessage(
          response?.message ||
          'Multa asignada correctamente.',
        );


        setMessageType(
          'success',
        );


        setForm(
          initialForm,
        );

      } catch (error) {

        console.error(
          'ERROR ASIGNANDO MULTA:',
          error,
        );


        setMessage(
          error?.message ||
          'Ocurrió un error al asignar la multa.',
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

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">

      {/* =====================================================
          FORM
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-start gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">

            <ExclamationTriangleIcon className="h-6 w-6" />

          </div>


          <div>

            <h2 className="text-lg font-bold text-slate-900">

              Multar una acción

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              Seleccione la acción que recibirá la multa
              y el tipo de multa que desea aplicar.

            </p>

          </div>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* ACCIÓN */}

            <SelectComponent
              label="Acción"
              placeholder={
                loadingAcciones
                  ? 'Cargando acciones...'
                  : 'Buscar y seleccionar acción...'
              }
              name="accion_id"
              options={
                acciones
              }
              value={
                form.accion_id
              }
              onChange={
                handleChange
              }
              error={
                errors.accion_id
              }
              isDisabled={
                loadingAcciones
              }
            />


            {/* MULTA */}

            <SelectComponent
              label="Multa"
              placeholder={
                loadingMultas
                  ? 'Cargando multas...'
                  : 'Buscar y seleccionar multa...'
              }
              name="multa_id"
              options={
                multas
              }
              value={
                form.multa_id
              }
              onChange={
                handleChange
              }
              error={
                errors.multa_id
              }
              isDisabled={
                loadingMultas
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

              {
                message
              }

            </div>

          )}


          <div className="mt-6 flex justify-end">

            <button
              type="submit"
              disabled={
                saving ||
                loadingAcciones ||
                loadingMultas
              }
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <ExclamationTriangleIcon className="h-5 w-5" />


              {
                saving
                  ? 'Asignando...'
                  : 'Asignar multa'
              }

            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          EXPLICACIÓN
      ====================================================== */}

      <aside className="rounded-2xl border border-amber-100 bg-amber-50 p-5">

        <div className="flex items-start gap-3">

          <InformationCircleIcon className="h-6 w-6 shrink-0 text-amber-700" />


          <div>

            <h3 className="font-bold text-amber-900">

              Asignación de multa

            </h3>


            <p className="mt-2 text-sm leading-6 text-amber-800/80">

              La multa se asignará directamente a la acción
              seleccionada y generará el cobro correspondiente.

            </p>

          </div>

        </div>


        <div className="mt-5 space-y-3">

          <InfoRow
            label="Acción"
            value={
              acciones.find(
                (
                  option,
                ) =>
                  option.value ===
                  form.accion_id,
              )
                ?.label ||
              'No seleccionada'
            }
          />


          <InfoRow
            label="Multa"
            value={
              multas.find(
                (
                  option,
                ) =>
                  option.value ===
                  form.multa_id,
              )
                ?.label ||
              'No seleccionada'
            }
          />

        </div>


        {form.accion_id &&
          form.multa_id && (

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-white p-3 text-sm font-semibold text-emerald-700">

            <CheckCircleIcon className="h-5 w-5" />

            Listo para asignar

          </div>

        )}

      </aside>

    </div>
  );
}


function InfoRow({
  label,
  value,
}) {

  return (

    <div className="rounded-xl bg-white p-4">

      <p className="text-xs font-semibold uppercase text-slate-400">

        {label}

      </p>


      <p className="mt-1 text-sm font-semibold text-slate-800">

        {value}

      </p>

    </div>
  );
}