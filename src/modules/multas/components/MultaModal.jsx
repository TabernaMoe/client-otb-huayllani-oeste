import {
  useEffect,
  useState,
} from 'react';

import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import ElegantInput
  from '../../../components/ElegantInput';

import {
  MultasServices as Servs,
} from '../services/multas.services';

import {
  validateCreateMulta,
  validateEditMulta,
} from '../schemas/multas.schema';


/**
 * ============================================================
 * FORMULARIO INICIAL
 * ============================================================
 */
const initialForm = {

  nombre_multa:
    '',

  precio:
    '',
};


export default function MultaModal({
  open,
  mode = 'create',
  multa = null,
  onClose,
  onSaved,
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
  // INTERFAZ
  // =========================================================

  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState('');


  // =========================================================
  // ¿ESTAMOS EDITANDO?
  // =========================================================

  const isEdit =
    mode === 'edit';


  // =========================================================
  // CARGAR DATOS AL ABRIR
  // =========================================================

  useEffect(
    () => {

      if (
        !open
      ) {

        return;
      }


      setErrors({});

      setMessage('');


      /**
       * EDITAR
       */
      if (
        isEdit &&
        multa
      ) {

        setForm({

          nombre_multa:
            multa.nombre_multa || '',

          precio:
            multa.precio ?? '',
        });


        return;
      }


      /**
       * CREAR
       */
      setForm(
        initialForm,
      );

    },
    [
      open,
      isEdit,
      multa,
    ],
  );


  // =========================================================
  // HANDLE CHANGE
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


      /**
       * Limpiamos el error
       * solamente del campo modificado.
       */
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
  // CERRAR
  // =========================================================

  const handleClose =
    () => {

      if (
        saving
      ) {

        return;
      }


      setForm(
        initialForm,
      );

      setErrors({});

      setMessage('');

      onClose();
    };


  // =========================================================
  // GUARDAR
  // =========================================================

  const handleSubmit =
    async (
      event,
    ) => {

      event.preventDefault();


      // ======================================================
      // 1. VALIDAR CON ZOD
      // ======================================================

      const validation =
        isEdit

          ? validateEditMulta(
              form,
            )

          : validateCreateMulta(
              form,
            );


      // ======================================================
      // 2. ERROR ZOD
      // ======================================================

      if (
        !validation.isValid
      ) {

        setErrors(
          validation.errors,
        );


        setMessage(
          'Revise los datos ingresados.',
        );


        return;
      }


      console.log(
        'FORM ORIGINAL:',
        form,
      );


      console.log(
        'PAYLOAD VALIDADO:',
        validation.data,
      );


      try {

        setSaving(
          true,
        );


        setMessage('');


        // ====================================================
        // 3. CREATE O UPDATE
        // ====================================================

        let response;


        if (
          isEdit
        ) {

          response =
            await Servs.update(
              multa.id,
              validation.data,
            );

        } else {

          response =
            await Servs.create(
              validation.data,
            );
        }


        // ====================================================
        // 4. ERROR BACKEND
        // ====================================================

        if (
          !response?.ok
        ) {

          setMessage(
            response?.message ||
            'No se pudo guardar la multa.',
          );

          return;
        }


        // ====================================================
        // 5. CORRECTO
        // ====================================================

        setErrors({});


        await onSaved?.();


        handleClose();

      } catch (error) {

        console.error(
          'ERROR GUARDANDO MULTA:',
          error,
        );


        setMessage(
          error?.message ||
          'Ocurrió un error al guardar la multa.',
        );

      } finally {

        setSaving(
          false,
        );
      }
    };


  // =========================================================
  // MODAL CERRADO
  // =========================================================

  if (
    !open
  ) {

    return null;
  }


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div
      className="
        fixed inset-0 z-50
        flex items-center
        justify-center
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex items-start
            justify-between
            border-b
            border-slate-200
            px-6 py-5
          "
        >

          <div>

            <div className="mb-1 text-xs text-slate-500">

              Multas

              <span className="mx-2">
                /
              </span>

              <span className="font-semibold text-emerald-700">

                {
                  isEdit
                    ? 'Editar'
                    : 'Nuevo'
                }

              </span>

            </div>


            <h2 className="text-xl font-bold text-slate-900">

              {
                isEdit
                  ? 'Editar multa'
                  : 'Registrar nueva multa'
              }

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              {
                isEdit
                  ? 'Actualice los datos de la multa seleccionada.'
                  : 'Complete los datos para registrar una nueva multa.'
              }

            </p>

          </div>


          <button
            type="button"
            onClick={
              handleClose
            }
            className="
              rounded-xl
              border
              border-slate-200
              p-2
              text-slate-500
              transition
              hover:bg-slate-100
            "
          >

            <XMarkIcon className="h-5 w-5" />

          </button>

        </div>


        {/* =================================================
            FORMULARIO
        ================================================== */}

        <form
          onSubmit={
            handleSubmit
          }
          className="p-6"
        >

          <div className="mb-6 flex items-start gap-3">

            <div
              className="
                flex h-8 w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-emerald-600
                text-sm
                font-bold
                text-white
              "
            >

              1

            </div>


            <div>

              <h3 className="font-semibold text-slate-800">

                Datos de la multa

              </h3>


              <p className="text-sm text-slate-500">

                Ingrese el nombre y el precio correspondiente.

              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* NOMBRE */}

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


            {/* PRECIO */}

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


          {/* MENSAJE */}

          {message && (

            <div
              className="
                mt-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4 py-3
                text-sm
                font-medium
                text-red-600
              "
            >

              {message}

            </div>

          )}


          {/* =================================================
              FOOTER
          ================================================== */}

          <div
            className="
              mt-7
              flex justify-end
              gap-3
              border-t
              border-slate-200
              pt-5
            "
          >

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                saving
              }
              className="
                rounded-xl
                border
                border-slate-300
                bg-white
                px-5 py-2.5
                text-sm
                font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >

              Cancelar

            </button>


            <button
              type="submit"
              disabled={
                saving
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-5 py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <CheckCircleIcon className="h-5 w-5" />


              {
                saving

                  ? 'Guardando...'

                  : isEdit

                    ? 'Guardar cambios'

                    : 'Registrar multa'
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}