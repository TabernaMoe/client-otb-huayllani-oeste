import {
  useEffect,
  useState,
} from 'react';

import {
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import SelectComponent from '../../../components/Select';
import ElegantInput from '../../../components/ElegantInput';

import {
  AccionesServices as Servs,
} from '../services/acciones.services';

import {
  CallesServices,
} from '../../calles/services/calles.services';


const initialForm = {
  socio_id: '',
  calle_id: '',
  tarifa_id: '',
  nro_medidor: '',
  direccion: '',
  observacion: '',
  estado: 'ACTIVO',
  detallesAccion: [],
};


export default function AccionModal({
  open,
  onClose,
  onCreated,
}) {

  // =========================================================
  // DATOS PARA SELECTS
  // =========================================================

  const [
    socios,
    setSocios,
  ] = useState([]);

  const [
    tarifas,
    setTarifas,
  ] = useState([]);

  const [
    calles,
    setCalles,
  ] = useState([]);

  const [
    tiposAccion,
    setTiposAccion,
  ] = useState([]);

  const [
    detalles,
    setDetalles,
  ] = useState([]);


  // =========================================================
  // INTERFAZ
  // =========================================================

  const [
    creando,
    setCreando,
  ] = useState(false);

  const [
    tipoSeleccionado,
    setTipoSeleccionado,
  ] = useState('');

  const [
    mensaje,
    setMensaje,
  ] = useState('');


  // =========================================================
  // FORMULARIO
  // =========================================================

  const [
    form,
    setForm,
  ] = useState(initialForm);


  // =========================================================
  // CARGAR SOCIOS
  // =========================================================

  const cargarSocios =
    async () => {

      try {

        const respuesta =
          await Servs.getSocios();

        setSocios(
          respuesta.data || [],
        );

      } catch (error) {

        console.error(
          'Error socios:',
          error,
        );
      }
    };


  // =========================================================
  // CARGAR TARIFAS
  // =========================================================

  const cargarTarifas =
    async () => {

      try {

        const respuesta =
          await Servs.getTarifas();

        setTarifas(
          respuesta.data || [],
        );

      } catch (error) {

        console.error(
          'Error tarifas:',
          error,
        );
      }
    };


  // =========================================================
  // CARGAR TIPOS ACCIÓN
  // =========================================================

  const cargarTiposAccion =
    async () => {

      try {

        const respuesta =
          await Servs.getTiposAccion();

        setTiposAccion(
          respuesta.data || [],
        );

      } catch (error) {

        console.error(
          'Error tipos:',
          error,
        );
      }
    };


  // =========================================================
  // CARGAR CALLES
  // =========================================================

  const cargarCalles =
    async () => {

      try {

        const respuesta =
          await CallesServices.getAll();

        const opciones =
          (respuesta.data || []).map(
            (calle) => ({
              value: calle.id,
              label: calle.nombre_calle,
            }),
          );

        setCalles(
          opciones,
        );

      } catch (error) {

        console.error(
          'Error calles:',
          error,
        );
      }
    };


  // =========================================================
  // INPUTS
  // =========================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setForm(
        (prev) => ({
          ...prev,
          [name]: value,
        }),
      );
    };


  // =========================================================
  // TIPO DE ACCIÓN
  // =========================================================

  const handleTipoChange =
    async (e) => {

      const tipoId =
        e.target.value;

      setTipoSeleccionado(
        tipoId,
      );

      setDetalles([]);

      setForm(
        (prev) => ({
          ...prev,
          detallesAccion: [],
        }),
      );

      if (!tipoId) {
        return;
      }

      try {

        const respuesta =
          await Servs.getDetallesAccion(
            tipoId,
          );

        setDetalles(
          respuesta.data || [],
        );

      } catch (error) {

        console.error(
          'Error detalles:',
          error,
        );
      }
    };


  // =========================================================
  // DETALLES
  // =========================================================

  const handleDetalleChange =
    (detalleId) => {

      const id =
        Number(detalleId);

      setForm(
        (prev) => {

          const existe =
            prev.detallesAccion.includes(
              id,
            );

          return {
            ...prev,

            detallesAccion:
              existe
                ? prev.detallesAccion.filter(
                    (item) =>
                      item !== id,
                  )
                : [
                    ...prev.detallesAccion,
                    id,
                  ],
          };
        },
      );
    };


  // =========================================================
  // LIMPIAR
  // =========================================================

  const limpiarFormulario =
    () => {

      setForm(
        initialForm,
      );

      setTipoSeleccionado('');

      setDetalles([]);

      setMensaje('');
    };


  // =========================================================
  // CERRAR
  // =========================================================

  const handleClose =
    () => {

      limpiarFormulario();

      onClose();
    };


  // =========================================================
  // POST
  // =========================================================

  const handleCreate =
    async (e) => {

      e.preventDefault();

      try {

        setCreando(true);

        setMensaje('');


        const body = {

          socio_id:
            Number(
              form.socio_id,
            ),

          calle_id:
            Number(
              form.calle_id,
            ),

          tarifa_id:
            Number(
              form.tarifa_id,
            ),

          nro_medidor:
            form.nro_medidor,

          direccion:
            form.direccion,

          observacion:
            form.observacion,

          estado:
            form.estado,

          detallesAccion:
            form.detallesAccion,
        };


        console.log(
          'BODY:',
          body,
        );


        const respuesta =
          await Servs.create(
            body,
          );


        console.log(
          'CREADO:',
          respuesta,
        );


        // Le avisamos al padre
        // que debe actualizar la tabla.

        await onCreated?.();


        limpiarFormulario();

        onClose();

      } catch (error) {

        console.error(
          error,
        );

        setMensaje(
          'No se pudo crear la acción.',
        );

      } finally {

        setCreando(false);
      }
    };


  // =========================================================
  // CARGAR SELECTS AL ABRIR
  // =========================================================

  useEffect(() => {

    if (!open) {
      return;
    }

    cargarSocios();

    cargarTarifas();

    cargarTiposAccion();

    cargarCalles();

  }, [open]);


  // =========================================================
  // SI ESTÁ CERRADO NO MOSTRAMOS NADA
  // =========================================================

  if (!open) {
    return null;
  }


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-900/40
        p-4
        backdrop-blur-[1px]
      "
    >

      <div
        className="
          max-h-[92vh]
          w-full max-w-5xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            sticky top-0 z-10
            flex items-start justify-between
            border-b border-slate-200
            bg-white
            px-6 py-5
          "
        >

          <div>

            <div className="mb-1 text-xs text-slate-500">

              Acciones

              <span className="mx-2">
                /
              </span>

              <span className="font-medium text-emerald-700">
                Nuevo
              </span>

            </div>


            <h2 className="text-xl font-bold text-slate-900">

              Registrar nueva acción

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              Complete la información de la nueva acción.

            </p>

          </div>


          <button
            type="button"
            onClick={handleClose}
            className="
              rounded-xl
              border border-slate-200
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
            FORM
        ================================================== */}

        <form
          onSubmit={handleCreate}
          className="p-6"
        >

          {/* =================================================
              SECCIÓN 1
          ================================================== */}

          <div className="mb-6">

            <div className="mb-5 flex items-start gap-3">

              <div
                className="
                  flex h-7 w-7
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-emerald-600
                  text-sm font-bold
                  text-white
                "
              >
                1
              </div>


              <div>

                <h3 className="font-semibold text-slate-800">

                  Datos principales

                </h3>

                <p className="text-sm text-slate-500">

                  Seleccione socio, calle, tarifa y datos del medidor.

                </p>

              </div>

            </div>


            <div
              className="
                grid grid-cols-1
                gap-5
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              <SelectComponent
                label="Socio"
                placeholder="Buscar socio..."
                name="socio_id"
                options={socios}
                value={form.socio_id}
                onChange={handleChange}
              />


              <SelectComponent
                label="Calle"
                placeholder="Buscar calle..."
                name="calle_id"
                options={calles}
                value={form.calle_id}
                onChange={handleChange}
              />


              <SelectComponent
                label="Tarifa de agua"
                placeholder="Buscar tarifa..."
                name="tarifa_id"
                options={tarifas}
                value={form.tarifa_id}
                onChange={handleChange}
              />


              <ElegantInput
                label="Número de medidor"
                name="nro_medidor"
                value={form.nro_medidor}
                onChange={handleChange}
                placeholder="Ingrese el número"
              />


              <ElegantInput
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ingrese la dirección"
              />


              <SelectComponent
                label="Estado"
                placeholder="Seleccione estado"
                name="estado"
                options={[
                  {
                    value: 'ACTIVO',
                    label: 'Activo',
                  },
                  {
                    value: 'PASIVO',
                    label: 'Pasivo',
                  },
                  {
                    value: 'ANULADO',
                    label: 'Anulado',
                  },
                ]}
                value={form.estado}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="border-t border-slate-200" />


          {/* =================================================
              SECCIÓN 2
          ================================================== */}

          <div className="my-6">

            <div className="mb-5 flex items-start gap-3">

              <div
                className="
                  flex h-7 w-7
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-emerald-600
                  text-sm font-bold
                  text-white
                "
              >
                2
              </div>


              <div>

                <h3 className="font-semibold text-slate-800">

                  Tipo y detalles

                </h3>

                <p className="text-sm text-slate-500">

                  Seleccione el tipo de acción y sus detalles.

                </p>

              </div>

            </div>


            <div className="max-w-md">

              <SelectComponent
                label="Tipo de acción"
                placeholder="Buscar tipo de acción..."
                name="tipo_accion"
                options={tiposAccion}
                value={tipoSeleccionado}
                onChange={handleTipoChange}
              />

            </div>


            <div className="mt-5">

              <label
                className="
                  mb-2 block
                  text-sm font-semibold
                  text-slate-700
                "
              >

                Detalles de la acción

              </label>


              {!tipoSeleccionado && (

                <p className="text-sm text-slate-500">

                  Primero seleccione un tipo de acción.

                </p>

              )}


              {tipoSeleccionado &&
                detalles.length === 0 && (

                  <p className="text-sm text-slate-500">

                    No existen detalles disponibles.

                  </p>

                )}


              <div className="flex flex-wrap gap-2">

                {detalles.map(
                  (detalle) => {

                    const seleccionado =
                      form.detallesAccion.includes(
                        Number(
                          detalle.value,
                        ),
                      );


                    return (

                      <button
                        key={detalle.value}
                        type="button"
                        onClick={() =>
                          handleDetalleChange(
                            detalle.value,
                          )
                        }
                        className={
                          seleccionado
                            ? `
                              rounded-full
                              border border-emerald-600
                              bg-emerald-600
                              px-4 py-2
                              text-sm font-medium
                              text-white
                            `
                            : `
                              rounded-full
                              border border-slate-300
                              bg-white
                              px-4 py-2
                              text-sm font-medium
                              text-slate-600
                              transition
                              hover:border-emerald-500
                              hover:bg-emerald-50
                            `
                        }
                      >

                        {detalle.label}

                      </button>

                    );
                  },
                )}

              </div>

            </div>

          </div>


          <div className="border-t border-slate-200" />


          {/* =================================================
              SECCIÓN 3
          ================================================== */}

          <div className="my-6">

            <div className="mb-5 flex items-start gap-3">

              <div
                className="
                  flex h-7 w-7
                  shrink-0
                  items-center justify-center
                  rounded-full
                  bg-emerald-600
                  text-sm font-bold
                  text-white
                "
              >
                3
              </div>


              <div>

                <h3 className="font-semibold text-slate-800">

                  Información adicional

                </h3>

                <p className="text-sm text-slate-500">

                  Registre una observación si corresponde.

                </p>

              </div>

            </div>


            <label
              className="
                mb-2 block
                text-sm font-semibold
                text-slate-700
              "
            >

              Observación

            </label>


            <textarea
              name="observacion"
              value={form.observacion}
              onChange={handleChange}
              rows={3}
              placeholder="Ingrese una observación"
              className="
                w-full resize-none
                rounded-2xl
                border border-slate-300
                bg-white
                px-4 py-3
                text-sm
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />

          </div>


          {/* =================================================
              ERROR
          ================================================== */}

          {mensaje && (

            <div
              className="
                mb-5
                rounded-xl
                bg-red-50
                px-4 py-3
                text-sm
                text-red-600
              "
            >

              {mensaje}

            </div>

          )}


          {/* =================================================
              FOOTER
          ================================================== */}

          <div
            className="
              flex justify-end gap-3
              border-t border-slate-200
              pt-5
            "
          >

            <button
              type="button"
              onClick={handleClose}
              disabled={creando}
              className="
                rounded-xl
                border border-slate-300
                bg-white
                px-5 py-2.5
                text-sm font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >

              Cancelar

            </button>


            <button
              type="submit"
              disabled={creando}
              className="
                flex items-center gap-2
                rounded-xl
                bg-emerald-600
                px-5 py-2.5
                text-sm font-semibold
                text-white
                transition
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <CheckCircleIcon className="h-5 w-5" />


              {creando
                ? 'Registrando...'
                : 'Registrar acción'}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}