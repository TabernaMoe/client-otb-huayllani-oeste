import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  ArrowRightIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

import DashboardCard from '../components/DashboardCard';

import DataTable from '../../../components/DataTable';

import {
  SocioServices,
} from '../../socios/services/socio.services';

import {
  AccionesServices,
} from '../../acciones/services/acciones.services';


// =========================================================
// MAPEAR SOCIO
// =========================================================

const mapSocio =
  (socio) => ({

    id:
      socio.id,

    nombreCompleto:
      socio.nombre_completo
      ||
      [
        socio.nombres,
        socio.primer_apellido,
        socio.segundo_apellido,
      ]
        .filter(Boolean)
        .join(' ')
      ||
      'Socio sin nombre',

    documento:
      socio.ci_socio
      || 'Sin documento',

    estado:
      socio.estado ?? true,
  });


export default function AdminDashboardPage() {

  // =========================================================
  // SOCIOS
  // =========================================================

  const [
    socios,
    setSocios,
  ] = useState([]);

  const [
    totalSocios,
    setTotalSocios,
  ] = useState(0);

  const [
    loadingSocios,
    setLoadingSocios,
  ] = useState(true);

  const [
    errorSocios,
    setErrorSocios,
  ] = useState('');


  // =========================================================
  // PAGINACIÓN SOCIOS
  // =========================================================

  const [
    paginationSocios,
    setPaginationSocios,
  ] = useState({

    page: 1,

    limit: 5,

    totalItems: 0,

    totalPages: 1,
  });


  // =========================================================
  // ACCIONES
  // =========================================================

  const [
    totalAcciones,
    setTotalAcciones,
  ] = useState(0);

  const [
    loadingAcciones,
    setLoadingAcciones,
  ] = useState(true);

  const [
    errorAcciones,
    setErrorAcciones,
  ] = useState('');


  // =========================================================
  // CARGAR SOCIOS
  // =========================================================

  const fetchSocios =
    async () => {

      try {

        setLoadingSocios(true);

        setErrorSocios('');


        const response =
          await SocioServices.getAll({

            page:
              paginationSocios.page,

            limit:
              paginationSocios.limit,
          });


        if (!response?.ok) {

          setErrorSocios(
            response?.message
            ||
            'No se pudieron cargar los socios',
          );

          return;
        }


        const sociosMapeados =
          Array.isArray(
            response.data,
          )
            ? response.data.map(
                mapSocio,
              )
            : [];


        setSocios(
          sociosMapeados,
        );


        setTotalSocios(
          response?.total ?? 0,
        );


        setPaginationSocios(
          (prev) => ({

            ...prev,

            page:
              response?.page
              ?? prev.page,

            limit:
              response?.limit
              ?? prev.limit,

            totalItems:
              response?.total
              ?? 0,

            totalPages:
              response?.totalPages
              ?? 1,
          }),
        );

      } catch (error) {

        console.error(
          'ERROR AL CARGAR SOCIOS:',
          error,
        );


        setErrorSocios(
          'Ocurrió un error inesperado al obtener los socios',
        );

      } finally {

        setLoadingSocios(false);
      }
    };


  // =========================================================
  // TOTAL ACCIONES
  // =========================================================

  const fetchTotalAcciones =
    async () => {

      try {

        setLoadingAcciones(true);

        setErrorAcciones('');


        const response =
          await AccionesServices.getAll();


        if (!response?.ok) {

          setErrorAcciones(
            response?.message
            ||
            'No se pudieron cargar las acciones',
          );

          return;
        }


        setTotalAcciones(
          response?.total ?? 0,
        );

      } catch (error) {

        console.error(
          'ERROR AL CARGAR TOTAL DE ACCIONES:',
          error,
        );


        setErrorAcciones(
          'Ocurrió un error inesperado al obtener las acciones',
        );

      } finally {

        setLoadingAcciones(false);
      }
    };


  // =========================================================
  // COLUMNAS DE LA TABLA
  // =========================================================

  const columns =
    useMemo(
      () => [

        // -------------------------------------------------
        // NÚMERO
        // -------------------------------------------------

        {
          id:
            'numero',

          header:
            'N.º',

          cell:
            ({ row }) => (

              <span className="text-slate-500">

                {
                  (
                    paginationSocios.page - 1
                  )
                  *
                  paginationSocios.limit
                  +
                  row.index
                  +
                  1
                }

              </span>

            ),
        },


        // -------------------------------------------------
        // SOCIO
        // -------------------------------------------------

        {
          accessorKey:
            'nombreCompleto',

          header:
            'Nombre del socio',

          cell:
            ({ row }) => {

              const socio =
                row.original;


              return (

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-sky-100
                      font-bold
                      text-sky-800
                    "
                  >

                    {
                      socio.nombreCompleto
                        .charAt(0)
                        .toUpperCase()
                    }

                  </div>


                  <div>

                    <p className="font-semibold text-slate-800">

                      {socio.nombreCompleto}

                    </p>


                    <p className="mt-0.5 text-xs text-slate-400">

                      ID: {socio.id}

                    </p>

                  </div>

                </div>

              );
            },
        },


        // -------------------------------------------------
        // DOCUMENTO
        // -------------------------------------------------

        {
          accessorKey:
            'documento',

          header:
            'Documento',

          cell:
            ({ row }) => (

              <span className="text-slate-600">

                {row.original.documento}

              </span>

            ),
        },


        // -------------------------------------------------
        // ESTADO
        // -------------------------------------------------

        {
          accessorKey:
            'estado',

          header:
            'Estado',

          cell:
            ({ row }) => {

              const activo =
                row.original.estado
                !== false;


              return (

                <span
                  className={`
                    inline-flex
                    rounded-full
                    px-3 py-1
                    text-xs
                    font-semibold

                    ${
                      activo
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }
                  `}
                >

                  {
                    activo
                      ? 'Activo'
                      : 'Inactivo'
                  }

                </span>

              );
            },
        },

      ],
      [
        paginationSocios.page,
        paginationSocios.limit,
      ],
    );


  // =========================================================
  // CAMBIAR PÁGINA
  // =========================================================

  const handleSocioPageChange =
    (page) => {

      setPaginationSocios(
        (prev) => ({
          ...prev,
          page,
        }),
      );
    };


  // =========================================================
  // CAMBIAR CANTIDAD DE FILAS
  // =========================================================

  const handleSocioLimitChange =
    (limit) => {

      setPaginationSocios(
        (prev) => ({

          ...prev,

          page: 1,

          limit,
        }),
      );
    };


  // =========================================================
  // USE EFFECT
  // =========================================================

  useEffect(() => {

    fetchSocios();

  }, [
    paginationSocios.page,
    paginationSocios.limit,
  ]);


  useEffect(() => {

    fetchTotalAcciones();

  }, []);


  // =========================================================
  // FECHA
  // =========================================================

  const currentDate =
    new Intl.DateTimeFormat(
      'es-BO',
      {
        weekday:
          'long',

        day:
          'numeric',

        month:
          'long',

        year:
          'numeric',
      },
    )
      .format(
        new Date(),
      );


  // =========================================================
  // CARDS
  // =========================================================

  const dashboardStats = [

    {
      title:
        'Socios registrados',

      value:
        totalSocios,

      description:
        errorSocios
        ||
        'Socios activos registrados',

      icon:
        UsersIcon,

      to:
        '/admin/socios',

      loading:
        loadingSocios,
    },

    {
      title:
        'Acciones',

      value:
        totalAcciones,

      description:
        errorAcciones
        ||
        'Acciones de agua registradas',

      icon:
        ClipboardDocumentListIcon,

      to:
        '/admin/acciones',

      loading:
        loadingAcciones,
    },

    {
      title:
        'Recaudación mensual',

      value:
        'Bs 12.450',

      description:
        'Cobros registrados este mes',

      icon:
        BanknotesIcon,

      to:
        '/admin/cobros-agua',

      loading:
        false,
    },
  ];


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <section className="space-y-6">


      {/* =====================================================
          BIENVENIDA
      ====================================================== */}

      <div
        className="
          rounded-3xl
          bg-linear-to-r
          from-sky-900
          via-sky-800
          to-cyan-700
          p-6
          text-white
          shadow-lg
          shadow-sky-900/20
          sm:p-8
        "
      >

        <div
          className="
            flex flex-col
            gap-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.2em]
                text-sky-200
              "
            >

              Panel administrativo

            </p>


            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">

              Bienvenido al sistema OTB

            </h1>


            


            <p className="mt-4 text-sm capitalize text-white/70">

              {currentDate}

            </p>

          </div>


          

        </div>

      </div>


      {/* =====================================================
          RESUMEN
      ====================================================== */}

      <div>

        <div className="mb-4">

          <h2 className="text-xl font-bold text-slate-800">

            Resumen general

          </h2>


          <p className="mt-1 text-sm text-slate-500">

            Información correspondiente al periodo actual.

          </p>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {dashboardStats.map(
            (stat) => (

              <DashboardCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                to={stat.to}
                loading={stat.loading}
              />

            ),
          )}

        </div>

      </div>


      {/* =====================================================
          SOCIOS
      ====================================================== */}

      <div
        className="
          rounded-3xl
          bg-white
          p-5
          shadow-sm
          sm:p-6
        "
      >

        <div
          className="
            mb-5
            flex flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              Socios registrados

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              Socios obtenidos desde el endpoint.

            </p>

          </div>


          <Link
            to="/admin/socios"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-sky-800
              transition
              hover:text-sky-950
            "
          >

            Ver todos los socios

            <ArrowRightIcon className="h-4 w-4" />

          </Link>

        </div>


        {/* ERROR */}

        {errorSocios && (

          <div
            className="
              mb-4
              rounded-2xl
              border border-red-200
              bg-red-50
              p-4
            "
          >

            <p className="text-sm font-semibold text-red-700">

              {errorSocios}

            </p>


            <button
              type="button"
              onClick={fetchSocios}
              className="
                mt-3
                rounded-xl
                bg-red-100
                px-4 py-2
                text-sm
                font-semibold
                text-red-700
                transition
                hover:bg-red-200
              "
            >

              Intentar nuevamente

            </button>

          </div>

        )}


        {/* DATATABLE */}

        {!errorSocios && (

          <DataTable
            data={socios}
            columns={columns}
            loading={loadingSocios}
            page={paginationSocios.page}
            limit={paginationSocios.limit}
            totalPages={paginationSocios.totalPages}
            totalItems={paginationSocios.totalItems}
            onPageChange={handleSocioPageChange}
            onLimitChange={handleSocioLimitChange}
          />

        )}

      </div>

    </section>
  );
}