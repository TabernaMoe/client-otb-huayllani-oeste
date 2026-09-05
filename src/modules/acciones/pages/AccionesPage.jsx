import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

import DataTable from '../../../components/DataTable';
import SelectComponent from '../../../components/Select';

import {
  AccionesServices as Servs,
} from '../services/acciones.services';

import AccionModal from '../components/AccionModal';


export default function AccionesPage() {

  // =========================================================
  // DATOS
  // =========================================================

  const [
    acciones,
    setAcciones,
  ] = useState([]);


  // =========================================================
  // INTERFAZ
  // =========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);


  // =========================================================
  // FILTROS
  // =========================================================

  const [
    searchInput,
    setSearchInput,
  ] = useState('');

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    estado,
    setEstado,
  ] = useState('');


  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const [
    pagination,
    setPagination,
  ] = useState({

    page: 1,

    limit: 5,

    totalItems: 0,

    totalPages: 1,
  });


  // =========================================================
  // CARGAR ACCIONES
  // =========================================================

  const cargarAcciones =
    async () => {

      try {

        setLoading(true);


        const params = {

          page:
            pagination.page,

          limit:
            pagination.limit,

          search:
            search,

          estado:
            estado || undefined,
        };


        const respuesta =
          await Servs.getAll(
            params,
          );


        console.log(
          'ACCIONES:',
          respuesta,
        );


        setAcciones(
          respuesta.data || [],
        );


        setPagination(
          (prev) => ({

            ...prev,

            page:
              respuesta.page
              || prev.page,

            limit:
              respuesta.limit
              || prev.limit,

            totalItems:
              respuesta.total
              || 0,

            totalPages:
              respuesta.totalPages
              || 1,
          }),
        );

      } catch (error) {

        console.error(
          'Error cargando acciones:',
          error,
        );

      } finally {

        setLoading(false);
      }
    };


  // =========================================================
  // BUSCAR
  // =========================================================

  const handleBuscar =
    () => {

      setPagination(
        (prev) => ({
          ...prev,
          page: 1,
        }),
      );

      setSearch(
        searchInput,
      );
    };


  // =========================================================
  // ACTUALIZAR
  // =========================================================

  const handleActualizar =
    () => {

      cargarAcciones();
    };


  // =========================================================
  // CAMBIAR ESTADO FILTRO
  // =========================================================

  const handleEstadoChange =
    (e) => {

      setEstado(
        e.target.value || '',
      );

      setPagination(
        (prev) => ({
          ...prev,
          page: 1,
        }),
      );
    };


  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const handlePageChange =
    (page) => {

      setPagination(
        (prev) => ({
          ...prev,
          page,
        }),
      );
    };


  const handleLimitChange =
    (limit) => {

      setPagination(
        (prev) => ({
          ...prev,
          page: 1,
          limit,
        }),
      );
    };


  // =========================================================
  // DESPUÉS DE CREAR
  // =========================================================

  const handleCreated =
    async () => {

      setPagination(
        (prev) => ({
          ...prev,
          page: 1,
        }),
      );

      await cargarAcciones();
    };


  // =========================================================
  // COLUMNAS DATATABLE
  // =========================================================

  const columns =
    useMemo(
      () => [

        {
          accessorKey:
            'codigo_interno',

          header:
            'Código',

          cell:
            ({ row }) => (

              <div>

                <p className="font-semibold text-slate-800">

                  {
                    row.original.codigo_interno
                  }

                </p>

                <p className="text-xs text-slate-400">

                  ID: {row.original.id}

                </p>

              </div>

            ),
        },


        {
          accessorKey:
            'nombre_completo',

          header:
            'Socio',

          cell:
            ({ row }) => (

              <div>

                <p className="font-medium text-slate-800">

                  {
                    row.original.nombre_completo
                  }

                </p>

                <p className="text-xs text-slate-400">

                  Medidor:
                  {' '}
                  {
                    row.original.nro_medidor
                  }

                </p>

              </div>

            ),
        },


        {
          accessorKey:
            'nombre_calle',

          header:
            'Calle',
        },


        {
          accessorKey:
            'nombre_tarifa',

          header:
            'Tarifa',
        },


        {
          accessorKey:
            'estado',

          header:
            'Estado',

          cell:
            ({ row }) => {

              const estadoAccion =
                row.original.estado;


              const clases = {

                ACTIVO:
                  'border-emerald-200 bg-emerald-50 text-emerald-700',

                PASIVO:
                  'border-amber-200 bg-amber-50 text-amber-700',

                ANULADO:
                  'border-red-200 bg-red-50 text-red-700',
              };


              return (

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    px-3 py-1
                    text-xs
                    font-semibold
                    ${
                      clases[
                        estadoAccion
                      ]
                      || 'border-slate-200 bg-slate-50 text-slate-600'
                    }
                  `}
                >

                  <span
                    className="
                      h-1.5 w-1.5
                      rounded-full
                      bg-current
                    "
                  />

                  {estadoAccion}

                </span>

              );
            },
        },


        {
          id:
            'acciones',

          header:
            'Acciones',

          cell:
            ({ row }) => (

              <div className="flex items-center gap-2">



                <button
                  type="button"
                  onClick={() => {
                    console.log(
                      'Cambiar estado:',
                      row.original,
                    );
                  }}
                  className="
                    rounded-lg
                    border border-amber-300
                    p-2
                    text-amber-600
                    transition
                    hover:bg-amber-50
                  "
                >

                  <PowerIcon className="h-4 w-4" />

                </button>

              </div>

            ),
        },

      ],
      [],
    );


  // =========================================================
  // TARJETAS
  // =========================================================

  const activasVisibles =
    acciones.filter(
      (accion) =>
        accion.estado === 'ACTIVO',
    ).length;


  const pasivasVisibles =
    acciones.filter(
      (accion) =>
        accion.estado === 'PASIVO',
    ).length;


  // =========================================================
  // USE EFFECT
  // =========================================================

  useEffect(() => {

    cargarAcciones();

  }, [
    pagination.page,
    pagination.limit,
    search,
    estado,
  ]);


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="min-h-screen bg-slate-50 p-5">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mb-5
          flex flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1 className="text-xl font-bold text-slate-900">

            Acciones registradas

          </h1>

          <p className="mt-1 text-sm text-slate-500">

            Administra la información y el estado de las acciones.

          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            setModalOpen(true)
          }
          className="
            flex items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-5 py-3
            text-sm font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-emerald-700
          "
        >

          <PlusIcon className="h-5 w-5" />

          Nueva acción

        </button>

      </div>


      {/* =====================================================
          CARDS
      ====================================================== */}

      <div
        className="
          mb-5
          grid grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* TOTAL */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium uppercase text-slate-400">

                Total de acciones

              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">

                {pagination.totalItems}

              </p>

            </div>


            <div
              className="
                rounded-full
                bg-emerald-50
                p-3
                text-emerald-600
              "
            >

              <RectangleStackIcon className="h-6 w-6" />

            </div>

          </div>

        </div>


        {/* VISIBLES */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium uppercase text-slate-400">

                Visibles

              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">

                {acciones.length}

              </p>

            </div>


            <div
              className="
                rounded-full
                bg-blue-50
                p-3
                text-blue-600
              "
            >

              <MagnifyingGlassIcon className="h-6 w-6" />

            </div>

          </div>

        </div>


        {/* ACTIVAS */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium uppercase text-slate-400">

                Activas visibles

              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">

                {activasVisibles}

              </p>

            </div>


            <div
              className="
                rounded-full
                bg-emerald-50
                p-3
                text-emerald-600
              "
            >

              <CheckCircleIcon className="h-6 w-6" />

            </div>

          </div>

        </div>


        {/* PASIVAS */}

        <div
          className="
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium uppercase text-slate-400">

                Pasivas visibles

              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">

                {pasivasVisibles}

              </p>

            </div>


            <div
              className="
                rounded-full
                bg-amber-50
                p-3
                text-amber-600
              "
            >

              <PowerIcon className="h-6 w-6" />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FILTROS
      ====================================================== */}

      <div
        className="
          rounded-2xl
          border border-slate-200
          bg-white
          p-5
          shadow-sm
        "
      >

        <div
          className="
            grid grid-cols-1
            gap-4
            md:grid-cols-[1fr_280px_auto]
            md:items-end
          "
        >

          {/* BUSCADOR */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">

              Buscar acción

            </label>


            <div className="relative">

              <MagnifyingGlassIcon
                className="
                  absolute
                  left-4 top-1/2
                  h-5 w-5
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(
                    e.target.value,
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === 'Enter'
                  ) {

                    handleBuscar();
                  }
                }}
                placeholder="Socio, código o medidor..."
                className="
                  w-full
                  rounded-xl
                  border border-slate-300
                  py-3
                  pl-11 pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

            </div>

          </div>


          {/* ESTADO */}

          <SelectComponent
            label="Estado"
            placeholder="Todos"
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
            value={estado}
            onChange={handleEstadoChange}
          />


          {/* BOTONES */}

          <div className="flex gap-2">

            <button
              type="button"
              onClick={handleBuscar}
              className="
                rounded-xl
                bg-slate-800
                px-4 py-3
                text-sm font-medium
                text-white
                transition
                hover:bg-slate-900
              "
            >

              Buscar

            </button>


            <button
              type="button"
              onClick={handleActualizar}
              disabled={loading}
              className="
                flex items-center gap-2
                rounded-xl
                border border-slate-300
                bg-white
                px-4 py-3
                text-sm font-medium
                text-slate-700
                transition
                hover:bg-slate-50
              "
            >

              <ArrowPathIcon
                className={`
                  h-4 w-4
                  ${
                    loading
                      ? 'animate-spin'
                      : ''
                  }
                `}
              />

              Actualizar

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          TABLA
      ====================================================== */}

      <DataTable
        data={acciones}
        columns={columns}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />


      {/* =====================================================
          MODAL
      ====================================================== */}

      <AccionModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onCreated={
          handleCreated
        }
      />

    </div>
  );
}