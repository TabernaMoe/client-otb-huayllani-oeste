// ==========================================================
// IMPORTACIONES DE REACT
// ==========================================================

// useState permite guardar información dentro del componente.
// useEffect permite ejecutar una función cuando la página se abre.
import { useEffect, useState } from 'react';

// Link permite navegar entre páginas sin recargar el navegador.
import { Link } from 'react-router-dom';

// ==========================================================
// ICONOS DEL DASHBOARD
// ==========================================================

import {
  ArrowRightIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

// ==========================================================
// COMPONENTES
// ==========================================================

import DashboardCard from '../components/DashboardCard';

// ==========================================================
// SERVICIO DE SOCIOS
// ==========================================================

// Este servicio contiene la petición:
//
// GET /admin/socio
//
// Como este archivo está dentro de:
// modules/Admin/pages
//
// Debemos retroceder hasta modules y entrar a socios/services.
import { SocioServices } from '../../socios/services/socio.services';
import { AccionesServices } from '../../acciones/services/acciones.services';
// ==========================================================
// FUNCIONES AUXILIARES
// ==========================================================

// Esta función intenta formar el nombre completo del socio.
//
// Se utilizan varios nombres posibles porque todavía debemos
// verificar exactamente cómo responde tu backend.
const getSocioNombre = (socio) => {
  // Si el backend ya devuelve nombre_completo, se utiliza directamente.
  if (socio?.nombre_completo) {
    return socio.nombre_completo;
  }

  // Si el backend devuelve nombres y apellidos separados,
  // los unimos con un espacio.
  const nombreCompleto = [
    socio?.nombre,
    socio?.nombres,
    socio?.apellido_paterno,
    socio?.apellido_materno,
    socio?.primer_apellido,
    socio?.segundo_apellido,
  ]
    // Elimina valores null, undefined o vacíos.
    .filter(Boolean)

    // Une todos los valores con espacios.
    .join(' ');

  // Si no encontramos ningún nombre, mostramos un texto alternativo.
  return nombreCompleto || 'Socio sin nombre';
};

// Esta función busca el documento del socio.
const getSocioDocumento = (socio) => {
  return (
    socio?.ci_socio ||
    'Sin documento'
  );
};

// Esta función obtiene el ID del socio.
// Se utiliza como key dentro del map de React.
const getSocioId = (socio, index) => {
  return socio?.id || index;
};

// ==========================================================
// COMPONENTE PRINCIPAL
// ==========================================================

export default function AdminDashboardPage() {
  // ========================================================
  // ESTADOS PARA GUARDAR INFORMACIÓN DE LOS SOCIOS
  // ========================================================

  // Aquí se guardará el arreglo de socios obtenido del backend.
  const [socios, setSocios] = useState([]);

  // Aquí guardaremos el total real de socios registrados.
  const [totalSocios, setTotalSocios] = useState(0);

  // Indica si la petición todavía está ejecutándose.
  const [loadingSocios, setLoadingSocios] = useState(true);

  // Guarda el mensaje de error cuando la petición falla.
  const [errorSocios, setErrorSocios] = useState('');

  // ========================================================
  // FUNCIÓN PARA CONSUMIR EL ENDPOINT DE SOCIOS
  // ========================================================

  const fetchSocios = async () => {
    try {
      // Antes de hacer la petición mostramos el estado de carga.
      setLoadingSocios(true);

      // Limpiamos cualquier error anterior.
      setErrorSocios('');

      // ------------------------------------------------------
      // AQUÍ SE CONSUME EL ENDPOINT
      // ------------------------------------------------------
      //
      // Esto ejecutará:
      //
      // GET /admin/socio?page=1&limit=5&search=&estado=true
      //
      // Parámetros:
      // 1    = primera página
      // 5    = traer cinco socios para mostrar en el dashboard
      // ''   = sin texto de búsqueda
      // true = solamente socios activos
      //
      const response = await SocioServices.getAll();

      // Este console.log es importante durante el aprendizaje.
      // Permite revisar la respuesta real del backend en:
      //
      // F12 → Console
      console.log('RESPUESTA DEL ENDPOINT DE SOCIOS:', response);

      // ------------------------------------------------------
      // VERIFICAMOS SI EL SERVICIO DEVOLVIÓ UN ERROR
      // ------------------------------------------------------

      if (!response || response?.ok === false) {
        setErrorSocios(
          response?.message || 'No se pudieron cargar los socios',
        );

        return;
      }

      // ------------------------------------------------------
      // EXTRAEMOS EL ARREGLO DE SOCIOS
      // ------------------------------------------------------
      //
      // Dependiendo de cómo esté construido el backend,
      // el arreglo podría llamarse:
      //
      // response.data
      // response.socios
      // response.items
      // response.rows
      //
      const sociosData =
        response?.data ||
        response?.socios ||
        response?.items ||
        response?.rows ||
        [];

      // Verificamos que realmente sea un arreglo.
      const sociosArray = Array.isArray(sociosData)
        ? sociosData
        : [];

      // Guardamos los socios en el estado.
      setSocios(sociosArray);

      // ------------------------------------------------------
      // EXTRAEMOS LA INFORMACIÓN DE PAGINACIÓN
      // ------------------------------------------------------
      //
      // El backend podría devolverla como:
      //
      // response.pagination
      // response.meta
      //
      const pagination =
        response?.pagination ||
        response?.meta ||
        null;

      // ------------------------------------------------------
      // GUARDAMOS EL TOTAL REAL DE SOCIOS
      // ------------------------------------------------------
      //
      // Es importante no utilizar solamente sociosArray.length,
      // porque la petición trae únicamente cinco socios.
      //
      // Buscamos diferentes nombres posibles para el total:
      //
      // pagination.total
      // pagination.totalItems
      // pagination.count
      // response.total
      //
      const total =
        pagination?.total ??
        pagination?.totalItems ??
        pagination?.count ??
        response?.total ??
        response?.totalItems ??
        sociosArray.length;

      setTotalSocios(total);
    } catch (error) {
      // Este bloque se ejecuta cuando ocurre un error inesperado.
      console.error('ERROR AL CARGAR SOCIOS:', error);

      setErrorSocios(
        'Ocurrió un error inesperado al obtener los socios',
      );
    } finally {
      // finally se ejecuta tanto si la petición funciona
      // como si ocurre un error.
      setLoadingSocios(false);
    }
  };

  // ========================================================
  // USEEFFECT
  // ========================================================
  //
  // Este useEffect se ejecuta una sola vez cuando el usuario
  // entra al dashboard.
  //
  // El arreglo vacío [] significa:
  // "Ejecutar solamente al montar el componente".
  //
  useEffect(() => {
    fetchSocios();
  }, []);

  // ========================================================
  // FECHA ACTUAL
  // ========================================================

  const currentDate = new Intl.DateTimeFormat('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // ========================================================
  // TARJETAS DEL DASHBOARD
  // ========================================================
  //
  // La primera tarjeta ya utiliza información real del backend.
  // Las demás todavía tienen datos demostrativos.
  //
  const dashboardStats = [
    {
      title: 'Socios registrados',

      // Mientras carga, el componente DashboardCard mostrará
      // un efecto de carga.
      value: errorSocios ? '—' : totalSocios,

      description: errorSocios
        ? errorSocios
        : 'Socios activos registrados',

      icon: UsersIcon,
      to: '/admin/socios',
      loading: loadingSocios,
    },
    {
      title: 'Acciones',
      value: 276,
      description: 'Acciones de agua registradas',
      icon: ClipboardDocumentListIcon,
      to: '/admin/acciones',
      loading: false,
    },
    {
      title: 'Lecturas pendientes',
      value: 38,
      description: 'Pendientes del periodo actual',
      icon: DocumentTextIcon,
      to: '/admin/lecturas',
      loading: false,
    },
    {
      title: 'Recaudación mensual',
      value: 'Bs 12.450',
      description: 'Cobros registrados este mes',
      icon: BanknotesIcon,
      to: '/admin/cobros-agua',
      loading: false,
    },
  ];

  // ========================================================
  // ACCESOS RÁPIDOS
  // ========================================================

  const quickActions = [
    {
      title: 'Administrar socios',
      description: 'Registrar, editar y consultar socios.',
      icon: UsersIcon,
      to: '/admin/socios',
    },
    {
      title: 'Registrar lecturas',
      description: 'Ingresar el consumo de agua de las acciones.',
      icon: DocumentTextIcon,
      to: '/admin/lecturas',
    },
    {
      title: 'Cobros de agua',
      description: 'Consultar deudas y registrar pagos.',
      icon: CurrencyDollarIcon,
      to: '/admin/cobros-agua',
    },
    {
      title: 'Administrar acciones',
      description: 'Asignar y consultar acciones de los socios.',
      icon: ClipboardDocumentListIcon,
      to: '/admin/acciones',
    },
    {
      title: 'Gestionar asambleas',
      description: 'Crear reuniones y registrar asistencias.',
      icon: UserGroupIcon,
      to: '/admin/asambleas',
    },
    {
      title: 'Generar reportes',
      description: 'Consultar información administrativa.',
      icon: BanknotesIcon,
      to: '/admin/reportes',
    },
  ];

  // ========================================================
  // ACTIVIDAD RECIENTE DEMOSTRATIVA
  // ========================================================
  //
  // Esta sección todavía no consume un endpoint.
  //
  const recentActivities = [
    {
      id: 1,
      title: 'Pago de agua registrado',
      description:
        'Se registró un pago correspondiente al periodo actual.',
      time: 'Hace 10 minutos',
    },
    {
      id: 2,
      title: 'Nuevo socio registrado',
      description: 'Se agregó un nuevo socio a la OTB.',
      time: 'Hace 45 minutos',
    },
    {
      id: 3,
      title: 'Lecturas actualizadas',
      description:
        'Se registraron nuevas lecturas de consumo.',
      time: 'Hace 2 horas',
    },
  ];

  // ========================================================
  // INTERFAZ DEL DASHBOARD
  // ========================================================

  return (
    <section className="space-y-6">
      {/* ==================================================== */}
      {/* ENCABEZADO PRINCIPAL */}
      {/* ==================================================== */}

      <div className="rounded-3xl bg-linear-to-r from-sky-900 via-sky-800 to-cyan-700 p-6 text-white shadow-lg shadow-sky-900/20 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
              Panel administrativo
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Bienvenido al sistema OTB
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-100 sm:text-base">
              Consulta la información principal de socios,
              acciones, lecturas, pagos y actividades de la
              organización.
            </p>

            <p className="mt-4 text-sm capitalize text-white/70">
              {currentDate}
            </p>
          </div>

          <Link
            to="/admin/cobros-agua"
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-sky-900 shadow-lg transition hover:bg-sky-50 lg:self-center"
          >
            Registrar cobro

            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TARJETAS DE RESUMEN */}
      {/* ==================================================== */}

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
          {dashboardStats.map((stat) => (
            <DashboardCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              to={stat.to}
              loading={stat.loading}
            />
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* LISTA DE SOCIOS OBTENIDA DESDE EL BACKEND */}
      {/* ==================================================== */}

      <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Socios registrados
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Primeros socios obtenidos desde el endpoint.
            </p>
          </div>

          <Link
            to="/admin/socios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 transition hover:text-sky-950"
          >
            Ver todos los socios

            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* -------------------------------------------------- */}
        {/* ESTADO DE CARGA */}
        {/* -------------------------------------------------- */}

        {loadingSocios && (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* MENSAJE DE ERROR */}
        {/* -------------------------------------------------- */}

        {!loadingSocios && errorSocios && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {errorSocios}
            </p>

            <button
              type="button"
              onClick={fetchSocios}
              className="mt-3 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* MENSAJE CUANDO NO HAY SOCIOS */}
        {/* -------------------------------------------------- */}

        {!loadingSocios &&
          !errorSocios &&
          socios.length === 0 && (
            <div className="rounded-2xl bg-slate-50 py-10 text-center">
              <UsersIcon className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-500">
                No existen socios registrados.
              </p>
            </div>
          )}

        {/* -------------------------------------------------- */}
        {/* TABLA DE SOCIOS */}
        {/* -------------------------------------------------- */}

        {!loadingSocios &&
          !errorSocios &&
          socios.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">N.º</th>

                    <th className="px-4 py-3">
                      Nombre del socio
                    </th>

                    <th className="px-4 py-3">
                      Documento
                    </th>

                    <th className="px-4 py-3">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* map recorre cada socio y crea una fila */}
                  {socios.map((socio, index) => (
                    <tr
                      key={getSocioId(socio, index)}
                      className="border-b border-slate-100 text-sm transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-800">
                            {getSocioNombre(socio)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {getSocioNombre(socio)}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              ID:{' '}
                              {socio?.id ||
                                socio?.socio_id ||
                                socio?.id_socio ||
                                'Sin ID'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {getSocioDocumento(socio)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            socio?.estado === false
                              ? 'bg-red-50 text-red-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {socio?.estado === false
                            ? 'Inactivo'
                            : 'Activo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* ==================================================== */}
      {/* ALERTA DE LECTURAS PENDIENTES */}
      {/* ==================================================== */}

      <div className="flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <ExclamationTriangleIcon className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-amber-900">
            Existen lecturas pendientes
          </h3>

          <p className="mt-1 text-sm text-amber-700">
            Hay acciones que todavía no cuentan con una lectura
            registrada durante el periodo actual.
          </p>
        </div>

        <Link
          to="/admin/lecturas"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-300"
        >
          Revisar lecturas

          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* ==================================================== */}
      {/* ACCESOS RÁPIDOS Y ACTIVIDAD RECIENTE */}
      {/* ==================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* -------------------------------------------------- */}
        {/* ACCESOS RÁPIDOS */}
        {/* -------------------------------------------------- */}

        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">
              Accesos rápidos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ingresa a las funciones principales del sistema.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-sky-100 group-hover:text-sky-800">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {action.description}
                    </p>
                  </div>

                  <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-700" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* ACTIVIDAD RECIENTE */}
        {/* -------------------------------------------------- */}

        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">
              Actividad reciente
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Últimos movimientos realizados.
            </p>
          </div>

          <div className="space-y-5">
            {recentActivities.map((activity) => (
              <article
                key={activity.id}
                className="relative border-l-2 border-sky-100 pl-5"
              >
                <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-sky-700" />

                <h3 className="text-sm font-semibold text-slate-800">
                  {activity.title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {activity.description}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {activity.time}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* PRÓXIMA ASAMBLEA */}
      {/* ==================================================== */}

      <div className="flex flex-col gap-5 rounded-3xl bg-slate-900 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
            <CalendarDaysIcon className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-400">
              Próxima asamblea
            </p>

            <h3 className="mt-1 text-lg font-bold">
              Asamblea general de socios
            </h3>

            <p className="mt-1 text-sm text-slate-300">
              Fecha y horario pendientes de confirmación
            </p>
          </div>
        </div>

        <Link
          to="/admin/asambleas"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          Ver asambleas

          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}