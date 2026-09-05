import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {toast,} from 'react-toastify';
import {RolesServices,} from '../services/roles.services';
import {validateRoleForm,} from '../schema/roles.schema';


const initialForm = {
  nombre_rol: '',
  permisos: [],
};

const inputClass = (
  hasError = false,
) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
      : 'border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50'
  }`;

export default function RolesPage() {
  const [ roles, setRoles, ] = useState([]);
  const [ permisos, setPermisos,] = useState([]);
  const [ form, setForm,] = useState(initialForm);
  const [ errors, setErrors,] = useState({});
  const [ selectedRole, setSelectedRole,] = useState(null);
  const [ search, setSearch, ] = useState('');
  const [ searchPermisos, setSearchPermisos,] = useState('');
  const [ page, setPage, ] = useState(1);
  const limit = 5;
  const [ pagination,
    setPagination,] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });
  const [loading, setLoading,] = useState(false);
  const [saving, setSaving, ] = useState(false);
  const [modalOpen, setModalOpen, ] = useState(false);


  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search,
      };
      const response =
        await RolesServices.getAllRoles(
          params,
        );
      if (!response.ok) {
        toast.error(
          response.message ||
            'Error al cargar roles',
        );
        return;
      }

      setRoles(
        response.data,
      );
      setPagination({
        total:
          response.total,

        page:
          response.page,

        limit:
          response.limit,

        totalPages:
          response.totalPages,
      });

    } catch (error) {

      console.error(
        'ERROR AL CARGAR ROLES:',
        error,
      );


      toast.error(
        'Error inesperado al cargar roles',
      );


    } finally {

      setLoading(false);

    }
  };

  const fetchPermisos =
    async () => {

      try {
        const response =
          await RolesServices
            .getAllPermisos();

        if (!response.ok) {

          toast.error(
            response.message ||
              'Error al cargar permisos',
          );

          return;
        }

        setPermisos(
          response.data,
        );

      } catch (error) {

        console.error(
          'ERROR AL CARGAR PERMISOS:',
          error,
        );


        toast.error(
          'Error inesperado al cargar permisos',
        );

      }
    };


  useEffect(() => {

    fetchPermisos();

  }, []);

  useEffect(() => {

    fetchRoles();

  }, [
    page,
    search,
  ]);


  const openCreateModal = () => {

    /**
     * No existe rol seleccionado.
     *
     * Eso significa:
     *
     * POST
     */

    setSelectedRole(
      null,
    );


    /**
     * Formulario vacío.
     */

    setForm({
      ...initialForm,
    });


    setErrors({});

    setSearchPermisos('');

    setModalOpen(true);


    console.log(
      '➕ MODO CREAR ROL',
    );
  };


  /**
   * ============================================================
   * ABRIR MODAL PARA EDITAR
   * ============================================================
   *
   * ENDPOINT:
   *
   * GET /admin/auth/roles/:id
   *
   * EJEMPLO:
   *
   * GET /admin/auth/roles/3
   *
   * RESPUESTA:
   *
   * {
   *   ok: true,
   *   data: {
   *     id: 3,
   *     nombre_rol: "rol prueba",
   *     permisos: [1, 2]
   *   }
   * }
   */

  const openEditModal =
    async (role) => {

      try {

        setErrors({});

        setSearchPermisos('');


        console.log(
          '=====================================',
        );

        console.log(
          '✏️ EDITAR ROL',
        );

        console.log(
          'ID SELECCIONADO:',
          role.id,
        );


        /**
         * Pedimos el rol completo.
         */

        const response =
          await RolesServices.getById(
            role.id,
          );


        console.log(
          'RESPUESTA GET BY ID:',
          response,
        );


        if (!response.ok) {

          toast.error(
            response.message ||
              'Error al obtener rol',
          );

          return;
        }


        /**
         * El backend devuelve:
         *
         * response.data
         */

        const roleData =
          response.data;


        console.log(
          'ROL OBTENIDO:',
          roleData,
        );


        /**
         * Guardamos el rol completo.
         *
         * selectedRole ahora nos indica
         * que estamos EDITANDO.
         */

        setSelectedRole(
          roleData,
        );


        /**
         * Cargamos los datos del backend
         * dentro del formulario.
         *
         * Esto hace que los inputs
         * aparezcan llenos.
         */

        setForm({
          nombre_rol:
            roleData.nombre_rol,

          permisos:
            roleData.permisos,
        });


        console.log(
          'DATOS CARGADOS AL FORM:',
          {
            nombre_rol:
              roleData.nombre_rol,

            permisos:
              roleData.permisos,
          },
        );


        /**
         * Después abrimos el modal.
         */

        setModalOpen(
          true,
        );


      } catch (error) {

        console.error(
          'ERROR GET ROL BY ID:',
          error,
        );


        toast.error(
          'No se pudo obtener el rol',
        );

      }
    };


  /**
   * ============================================================
   * CERRAR MODAL
   * ============================================================
   */

  const closeModal = () => {

    if (saving) {
      return;
    }


    setModalOpen(false);

    setSelectedRole(null);

    setForm({
      ...initialForm,
    });

    setErrors({});

    setSearchPermisos('');
  };


  /**
   * ============================================================
   * CAMBIAR NOMBRE DEL ROL
   * ============================================================
   *
   * input:
   *
   * name="nombre_rol"
   *
   * Entonces:
   *
   * form.nombre_rol
   *
   * se actualiza automáticamente.
   */

  const handleChange = (
    event,
  ) => {

    const {
      name,
      value,
    } = event.target;


    console.log(
      'CAMPO MODIFICADO:',
      {
        name,
        value,
      },
    );


    setForm(
      (previous) => ({
        ...previous,

        [name]:
          value,
      }),
    );


    setErrors(
      (previous) => ({
        ...previous,

        [name]:
          undefined,
      }),
    );
  };


  /**
   * ============================================================
   * AGREGAR / QUITAR PERMISO
   * ============================================================
   *
   * form.permisos:
   *
   * []
   *
   * seleccionar 1:
   *
   * [1]
   *
   * seleccionar 2:
   *
   * [1, 2]
   *
   * volver a presionar 1:
   *
   * [2]
   */

  const handlePermissionChange = (
    permissionId,
  ) => {

    setForm(
      (previous) => {

        /**
         * Revisamos si el permiso
         * ya está seleccionado.
         */

        const exists =
          previous.permisos.includes(
            permissionId,
          );


        const nuevosPermisos =
          exists

            /**
             * Ya existe.
             *
             * Lo quitamos.
             */

            ? previous.permisos.filter(
                (id) =>
                  id !== permissionId,
              )


            /**
             * No existe.
             *
             * Lo agregamos.
             */

            : [
                ...previous.permisos,

                permissionId,
              ];


        console.log(
          'PERMISOS ANTERIORES:',
          previous.permisos,
        );

        console.log(
          'PERMISOS NUEVOS:',
          nuevosPermisos,
        );


        return {
          ...previous,

          permisos:
            nuevosPermisos,
        };
      },
    );


    setErrors(
      (previous) => ({
        ...previous,

        permisos:
          undefined,
      }),
    );
  };


  /**
   * ============================================================
   * GUARDAR ROL
   * ============================================================
   */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      console.log(
        '=====================================',
      );

      console.log(
        '💾 GUARDAR ROL',
      );

      console.log(
        'FORM ACTUAL:',
        form,
      );


      /**
       * ======================================================
       * VALIDACIÓN
       * ======================================================
       *
       * Aquí utilizamos nuestro schema.
       */

      const validation =
        validateRoleForm(
          form,
        );


      console.log(
        'RESULTADO VALIDACIÓN:',
        validation,
      );


      if (!validation.isValid) {

        setErrors(
          validation.errors,
        );


        toast.error(
          'Revise los campos marcados',
        );


        return;
      }


      /**
       * ======================================================
       * PAYLOAD
       * ======================================================
       *
       * Esto es exactamente lo que espera
       * el backend.
       */

      const payload = {

        nombre_rol:
          form.nombre_rol.trim(),

        permisos:
          form.permisos,

      };


      console.log(
        'PAYLOAD A ENVIAR:',
        payload,
      );


      try {

        setSaving(true);


        let response;


        /**
         * ====================================================
         * EDITAR
         * ====================================================
         *
         * selectedRole existe.
         *
         * PATCH /admin/auth/roles/:id
         */

        if (selectedRole) {

          console.log(
            `📡 PATCH /admin/auth/roles/${selectedRole.id}`,
          );


          response =
            await RolesServices.update(
              selectedRole.id,
              payload,
            );

        }


        /**
         * ====================================================
         * CREAR
         * ====================================================
         *
         * selectedRole === null
         *
         * POST /admin/auth/roles
         */

        else {

          console.log(
            '📡 POST /admin/auth/roles',
          );


          response =
            await RolesServices.create(
              payload,
            );

        }


        console.log(
          'RESPUESTA GUARDAR:',
          response,
        );


        if (!response.ok) {

          toast.error(
            response.message ||
              'Error al guardar rol',
          );

          return;
        }


        toast.success(
          response.message ||
            (
              selectedRole
                ? 'Rol actualizado correctamente'
                : 'Rol creado correctamente'
            ),
        );


        /**
         * Cerramos modal.
         */

        setModalOpen(false);

        setSelectedRole(null);

        setForm({
          ...initialForm,
        });


        /**
         * Volvemos a consultar roles
         * para actualizar la tabla.
         */

        await fetchRoles();


      } catch (error) {

        console.error(
          'ERROR AL GUARDAR ROL:',
          error,
        );


        toast.error(
          'Error inesperado al guardar rol',
        );


      } finally {

        setSaving(false);

      }
    };


  /**
   * ============================================================
   * FILTRAR PERMISOS
   * ============================================================
   */

  const permisosFiltrados =
    useMemo(() => {

      const texto =
        searchPermisos
          .trim()
          .toLowerCase();


      if (!texto) {

        return permisos;

      }


      return permisos.filter(
        (permiso) =>

          permiso.nombre_permiso
            .toLowerCase()
            .includes(
              texto,
            )

          ||

          permiso.codigo_permiso
            .toLowerCase()
            .includes(
              texto,
            ),

      );

    }, [
      permisos,
      searchPermisos,
    ]);


  /**
   * ============================================================
   * PERMISOS ASIGNADOS
   * ============================================================
   */

  const permisosAsignados =
    permisosFiltrados.filter(
      (permiso) =>
        form.permisos.includes(
          permiso.id,
        ),
    );


  /**
   * ============================================================
   * PERMISOS DISPONIBLES
   * ============================================================
   */

  const permisosDisponibles =
    permisosFiltrados.filter(
      (permiso) =>
        !form.permisos.includes(
          permiso.id,
        ),
    );


  /**
   * ============================================================
   * MÉTRICAS
   * ============================================================
   */

  const resumen =
    useMemo(() => {

      let totalPermisos =
        0;


      roles.forEach(
        (role) => {

          totalPermisos +=
            role.permisos.length;

        },
      );


      return {

        totalRoles:
          pagination.total,

        totalPermisos,

        permisosSistema:
          permisos.length,

        promedio:
          roles.length > 0
            ? Math.round(
                totalPermisos /
                  roles.length,
              )
            : 0,

      };

    }, [
      roles,
      permisos,
      pagination.total,
    ]);


  /**
   * ============================================================
   * JSX
   * ============================================================
   */

  return (

    <section className="min-h-screen bg-slate-50">


      <div className="space-y-5">


        {/* ================================================= */}
        {/* CABECERA */}
        {/* ================================================= */}

        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">


          <div>


            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">

              <span>
                Inicio
              </span>

              <span>
                /
              </span>

              <span>
                Seguridad
              </span>

              <span>
                /
              </span>

              <span className="text-emerald-700">

                Roles y permisos

              </span>

            </div>


            <h1 className="text-2xl font-bold tracking-tight text-slate-900">

              Gestión de roles y permisos

            </h1>


            <p className="mt-1 text-sm text-slate-500">

              Administra los roles del sistema
              y define los permisos asignados.

            </p>

          </div>


          <button
            type="button"

            onClick={
              openCreateModal
            }

            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >

            <PlusIcon className="h-5 w-5" />

            Nuevo rol

          </button>

        </header>


        {/* ================================================= */}
        {/* MÉTRICAS */}
        {/* ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


          <MetricCard
            label="Total roles"

            value={
              resumen.totalRoles
            }

            icon={
              UserGroupIcon
            }
          />


          <MetricCard
            label="Permisos visibles"

            value={
              resumen.totalPermisos
            }

            icon={
              CheckBadgeIcon
            }
          />


          <MetricCard
            label="Permisos disponibles"

            value={
              resumen.permisosSistema
            }

            icon={
              KeyIcon
            }
          />


          <MetricCard
            label="Promedio por rol"

            value={
              resumen.promedio
            }

            icon={
              ShieldCheckIcon
            }
          />


        </div>


        {/* ================================================= */}
        {/* TABLA */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">


          {/* =============================================== */}
          {/* BUSCADOR */}
          {/* =============================================== */}

          <div className="border-b border-slate-200 px-5 py-5">


            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">


              <div>


                <h2 className="font-bold text-slate-900">

                  Roles registrados

                </h2>


                <p className="mt-1 text-sm text-slate-500">

                  Consulta y edita los roles
                  configurados.

                </p>

              </div>


              <div className="relative w-full lg:w-80">


                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />


                <input
                  type="text"

                  value={
                    search
                  }

                  onChange={(event) => {

                    setPage(1);

                    setSearch(
                      event.target.value,
                    );

                  }}

                  placeholder="Buscar rol"

                  className={`${inputClass()} pl-11`}
                />

              </div>

            </div>

          </div>


          {/* =============================================== */}
          {/* TABLA */}
          {/* =============================================== */}

          <div className="overflow-x-auto">


            <table className="w-full min-w-200 text-left text-sm">


              <thead className="border-b border-slate-200 bg-slate-50">


                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">

                  <th className="px-6 py-4">
                    Rol
                  </th>

                  <th className="px-4 py-4">
                    Código
                  </th>

                  <th className="px-4 py-4">
                    Permisos
                  </th>

                  <th className="px-6 py-4 text-right">
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">


                {
                  loading
                    ? (

                      <tr>

                        <td
                          colSpan={4}

                          className="px-6 py-16 text-center"
                        >

                          <ArrowPathIcon className="mx-auto h-7 w-7 animate-spin text-emerald-700" />

                          <p className="mt-3 text-sm text-slate-500">

                            Cargando roles...

                          </p>

                        </td>

                      </tr>

                    )


                    : roles.length === 0
                      ? (

                        <tr>

                          <td
                            colSpan={4}

                            className="px-6 py-16 text-center text-slate-500"
                          >

                            No existen roles registrados.

                          </td>

                        </tr>

                      )


                      : roles.map(
                          (role) => (

                            <tr
                              key={
                                role.id
                              }

                              className="transition hover:bg-slate-50"
                            >


                              {/* =========================== */}
                              {/* ROL */}
                              {/* =========================== */}

                              <td className="px-6 py-4">


                                <div className="flex items-center gap-3">


                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

                                    <ShieldCheckIcon className="h-5 w-5" />

                                  </div>


                                  <div>


                                    <p className="font-bold text-slate-900">

                                      {
                                        role.nombre_rol
                                      }

                                    </p>


                                    <p className="text-xs text-slate-500">

                                      Rol del sistema

                                    </p>


                                  </div>

                                </div>

                              </td>


                              {/* =========================== */}
                              {/* ID */}
                              {/* =========================== */}

                              <td className="px-4 py-4">

                                <span className="font-semibold text-slate-600">

                                  #
                                  {
                                    String(
                                      role.id,
                                    ).padStart(
                                      4,
                                      '0',
                                    )
                                  }

                                </span>

                              </td>


                              {/* =========================== */}
                              {/* PERMISOS */}
                              {/* =========================== */}

                              <td className="px-4 py-4">


                                <div className="flex flex-wrap gap-2">


                                  {
                                    role.permisos.map(
                                      (
                                        permiso,
                                        index,
                                      ) => (

                                        <span
                                          key={`${role.id}-${index}`}

                                          className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                        >

                                          <KeyIcon className="h-3.5 w-3.5" />

                                          {
                                            permiso.nombre_permiso
                                          }

                                        </span>

                                      ),
                                    )
                                  }


                                </div>

                              </td>


                              {/* =========================== */}
                              {/* EDITAR */}
                              {/* =========================== */}

                              <td className="px-6 py-4">


                                <div className="flex justify-end">


                                  <button
                                    type="button"

                                    onClick={() =>
                                      openEditModal(
                                        role,
                                      )
                                    }

                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                  >

                                    <PencilSquareIcon className="h-4 w-4" />

                                    Editar

                                  </button>

                                </div>

                              </td>


                            </tr>

                          ),
                        )
                }

              </tbody>

            </table>

          </div>


          {/* =============================================== */}
          {/* PAGINACIÓN */}
          {/* =============================================== */}

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">


            <p className="text-sm text-slate-500">

              Total:

              {' '}

              <strong>
                {
                  pagination.total
                }
              </strong>

            </p>


            <div className="flex items-center gap-3">


              <button
                type="button"

                disabled={
                  page <= 1 ||
                  loading
                }

                onClick={() =>
                  setPage(
                    (previous) =>
                      previous - 1,
                  )
                }

                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >

                <ChevronLeftIcon className="h-4 w-4" />

              </button>


              <span className="text-sm font-semibold text-slate-700">

                Página {page} de {
                  pagination.totalPages
                }

              </span>


              <button
                type="button"

                disabled={
                  page >=
                    pagination.totalPages ||
                  loading
                }

                onClick={() =>
                  setPage(
                    (previous) =>
                      previous + 1,
                  )
                }

                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >

                <ChevronRightIcon className="h-4 w-4" />

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      {
        modalOpen && (

          <div
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {

                closeModal();

              }

            }}

            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
          >


            <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">


              {/* =========================================== */}
              {/* CABECERA MODAL */}
              {/* =========================================== */}

              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">


                <div className="flex items-start gap-4">


                  <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">

                    <ShieldCheckIcon className="h-6 w-6" />

                  </div>


                  <div>


                    <div className="flex items-center gap-2 text-xs text-slate-400">

                      <span>
                        Roles
                      </span>

                      <span>
                        /
                      </span>

                      <span className="text-emerald-700">

                        {
                          selectedRole
                            ? 'Editar'
                            : 'Nuevo'
                        }

                      </span>

                    </div>


                    <h2 className="mt-1 text-xl font-bold text-slate-900">

                      {
                        selectedRole
                          ? 'Editar rol y permisos'
                          : 'Registrar nuevo rol'
                      }

                    </h2>


                    <p className="mt-1 text-sm text-slate-500">

                      Define el nombre del rol
                      y selecciona sus permisos.

                    </p>

                  </div>

                </div>


                <button
                  type="button"

                  onClick={
                    closeModal
                  }

                  className="rounded-lg border border-slate-200 p-2 text-slate-500"
                >

                  <XMarkIcon className="h-5 w-5" />

                </button>

              </div>


              {/* =========================================== */}
              {/* FORMULARIO */}
              {/* =========================================== */}

              <form
                onSubmit={
                  handleSubmit
                }

                className="min-h-0 flex-1 overflow-y-auto"
              >


                <div className="space-y-7 p-6">


                  {/* ======================================= */}
                  {/* NOMBRE */}
                  {/* ======================================= */}

                  <section>


                    <h3 className="font-bold text-slate-900">

                      1. Información del rol

                    </h3>


                    <p className="mt-1 text-sm text-slate-500">

                      Ingresa un nombre descriptivo.

                    </p>


                    <div className="mt-4 max-w-xl">


                      <label className="mb-2 block text-sm font-semibold text-slate-700">

                        Nombre del rol *

                      </label>


                      <input
                        type="text"

                        name="nombre_rol"

                        value={
                          form.nombre_rol
                        }

                        onChange={
                          handleChange
                        }

                        placeholder="Ej. Secretaria"

                        className={
                          inputClass(
                            Boolean(
                              errors.nombre_rol,
                            ),
                          )
                        }
                      />


                      {
                        errors.nombre_rol && (

                          <p className="mt-1 flex items-center gap-1 text-xs text-red-600">

                            <ExclamationCircleIcon className="h-4 w-4" />

                            {
                              errors.nombre_rol
                            }

                          </p>

                        )
                      }

                    </div>

                  </section>


                  <div className="border-t border-slate-100" />


                  {/* ======================================= */}
                  {/* PERMISOS */}
                  {/* ======================================= */}

                  <section>


                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">


                      <div>


                        <h3 className="font-bold text-slate-900">

                          2. Permisos del sistema

                        </h3>


                        <p className="mt-1 text-sm text-slate-500">

                          Puede asignar uno o varios permisos.

                        </p>

                      </div>


                      <div className="relative w-full md:w-80">


                        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />


                        <input
                          value={
                            searchPermisos
                          }

                          onChange={(event) =>
                            setSearchPermisos(
                              event.target.value,
                            )
                          }

                          placeholder="Buscar permiso"

                          className={`${inputClass()} pl-11`}
                        />

                      </div>

                    </div>


                    {
                      errors.permisos && (

                        <p className="mt-3 flex items-center gap-1 text-xs text-red-600">

                          <ExclamationCircleIcon className="h-4 w-4" />

                          {
                            errors.permisos
                          }

                        </p>

                      )
                    }


                    <div className="mt-5 grid gap-5 lg:grid-cols-2">


                      <PermissionPanel
                        title="Permisos asignados"

                        permisos={
                          permisosAsignados
                        }

                        selected

                        onToggle={
                          handlePermissionChange
                        }
                      />


                      <PermissionPanel
                        title="Permisos disponibles"

                        permisos={
                          permisosDisponibles
                        }

                        selected={false}

                        onToggle={
                          handlePermissionChange
                        }
                      />


                    </div>

                  </section>

                </div>


                {/* ========================================= */}
                {/* BOTONES */}
                {/* ========================================= */}

                <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">


                  <button
                    type="button"

                    onClick={
                      closeModal
                    }

                    disabled={
                      saving
                    }

                    className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
                  >

                    Cancelar

                  </button>


                  <button
                    type="submit"

                    disabled={
                      saving
                    }

                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >


                    {
                      saving
                        ? (

                          <>

                            <ArrowPathIcon className="h-5 w-5 animate-spin" />

                            Guardando...

                          </>

                        )

                        : (

                          <>

                            <CheckCircleIcon className="h-5 w-5" />

                            {
                              selectedRole
                                ? 'Guardar cambios'
                                : 'Registrar rol'
                            }

                          </>

                        )
                    }


                  </button>

                </div>

              </form>

            </div>

          </div>

        )
      }

    </section>
  );
}


/**
 * ============================================================
 * TARJETA DE MÉTRICA
 * ============================================================
 */

function MetricCard({
  label,
  value,
  icon: Icon,
}) {

  return (

    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">


      <div className="flex items-center justify-between">


        <div>


          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

            {label}

          </p>


          <p className="mt-2 text-2xl font-bold text-slate-900">

            {value}

          </p>

        </div>


        <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">

          <Icon className="h-6 w-6" />

        </div>

      </div>

    </article>
  );
}


/**
 * ============================================================
 * PANEL DE PERMISOS
 * ============================================================
 *
 * selected = true
 * -> permisos asignados
 *
 * selected = false
 * -> permisos disponibles
 */

function PermissionPanel({
  title,
  permisos,
  selected,
  onToggle,
}) {

  return (

    <div
      className={`rounded-xl border p-4 ${
        selected
          ? 'border-emerald-200 bg-emerald-50/40'
          : 'border-slate-200 bg-white'
      }`}
    >


      <div className="mb-4 flex items-center justify-between">


        <h4 className="font-bold text-slate-800">

          {title}

        </h4>


        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">

          {
            permisos.length
          }

        </span>

      </div>


      <div className="grid max-h-96 gap-2 overflow-y-auto sm:grid-cols-2">


        {
          permisos.length === 0
            ? (

              <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-8 text-center">

                <KeyIcon className="mx-auto h-7 w-7 text-slate-300" />

                <p className="mt-3 text-sm text-slate-400">

                  No hay permisos para mostrar

                </p>

              </div>

            )


            : permisos.map(
                (permiso) => (

                  <button
                    key={
                      permiso.id
                    }

                    type="button"

                    onClick={() =>
                      onToggle(
                        permiso.id,
                      )
                    }

                    className={`rounded-xl border p-3 text-left transition ${
                      selected
                        ? 'border-emerald-200 bg-white hover:border-red-200 hover:bg-red-50'
                        : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >


                    <div className="flex items-start gap-3">


                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          selected
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300'
                        }`}
                      >

                        {
                          selected && (

                            <CheckCircleIcon className="h-4 w-4" />

                          )
                        }

                      </div>


                      <div className="min-w-0">


                        <p className="text-sm font-semibold text-slate-800">

                          {
                            permiso.nombre_permiso
                          }

                        </p>


                        <p className="mt-1 text-xs text-slate-500">

                          {
                            permiso.codigo_permiso
                          }

                        </p>

                      </div>

                    </div>

                  </button>

                ),
              )
        }

      </div>

    </div>
  );
}