import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  toast,
} from 'react-toastify';

import {
  TipoAccionServices as Servs,
} from '../services/tipoAccion.services';

import DataTable
  from '../../../components/DataTable';

import {
  MODALS,
  useModalManager,
} from '../../../hooks/useModalManager';

import TipoAccionModal
  from './TipoAccionModal';

/**
 * ============================================================
 * FUNCIÓN DEL SCHEMA
 * ============================================================
 */
import {
  validateTipoAccionParams,
} from '../schema/tipoaccion.schema';

export default function TipoAccion() {
  /**
   * ============================================================
   * FILAS
   * ============================================================
   */
  const [
    filas,
    setFilas,
  ] = useState([]);

  /**
   * ============================================================
   * LOADING
   * ============================================================
   */
  const [
    loading,
    setLoading,
  ] = useState(false);

  /**
   * ============================================================
   * BÚSQUEDA
   * ============================================================
   */
  const [
    searchInput,
    setSearchInput,
  ] = useState('');

  /**
   * ============================================================
   * MODALES
   * ============================================================
   */
  const {
    closeModal,
    isModalOpen,
    modalState,
    openModal,
  } = useModalManager();

  /**
   * ============================================================
   * PAGINACIÓN
   * ============================================================
   */
  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,

    limit: 5,

    totalItems: 0,

    totalPages: 1,
  });

  /**
   * ============================================================
   * OBTENER TIPOS DE ACCIÓN
   * ============================================================
   */
  const fetchFilas = async () => {
    try {
      setLoading(
        true,
      );

      /**
       * ========================================================
       * PASO 1
       * CONSTRUIR PARAMS
       * ========================================================
       */
      const params = {
        page:
          pagination.page,

        limit:
          pagination.limit,

        search:
          searchInput,
      };

      /**
       * ========================================================
       * PASO 2
       * VALIDAR PARAMS
       * ========================================================
       */
      const validation =
        validateTipoAccionParams(
          params,
        );

      if (
        !validation.isValid
      ) {
        toast.error(
          'Los parámetros de búsqueda no son válidos',
        );

        setFilas([]);

        return;
      }

      /**
       * ========================================================
       * PASO 3
       * LLAMAR AL SERVICE
       * ========================================================
       *
       * IMPORTANTE:
       *
       * ANTES:
       *
       * Servs.getAll(
       *   page,
       *   limit,
       *   search
       * )
       *
       *
       * AHORA:
       *
       * Servs.getAll({
       *   page,
       *   limit,
       *   search
       * })
       */
      const response =
        await Servs.getAll(
          validation.data,
        );

      /**
       * ========================================================
       * PASO 4
       * ERROR DEL BACKEND
       * ========================================================
       */
      if (
        !response?.ok
      ) {
        toast.error(
          response?.message ||
            'Error al cargar los tipos de acción',
        );

        setFilas([]);

        setPagination(
          (previous) => ({
            ...previous,

            totalItems:
              0,

            totalPages:
              1,
          }),
        );

        return;
      }

      /**
       * ========================================================
       * PASO 5
       * DATOS
       * ========================================================
       */
      setFilas(
        Array.isArray(
          response.data,
        )
          ? response.data
          : [],
      );

      /**
       * ========================================================
       * PASO 6
       * PAGINACIÓN
       * ========================================================
       *
       * Backend:
       *
       * {
       *   total,
       *   page,
       *   limit,
       *   totalPages,
       *   data
       * }
       */
      setPagination(
        (previous) => ({
          ...previous,

          page:
            Number(
              response.page ??
                previous.page,
            ),

          limit:
            Number(
              response.limit ??
                previous.limit,
            ),

          totalItems:
            Number(
              response.total ??
                0,
            ),

          totalPages:
            Number(
              response.totalPages ??
                1,
            ),
        }),
      );

    } catch (error) {
      toast.error(
        error?.message ||
          'Error al cargar los tipos de acción',
      );

    } finally {
      setLoading(
        false,
      );
    }
  };

  /**
   * ============================================================
   * RECARGAR AUTOMÁTICAMENTE
   * ============================================================
   *
   * Cada vez que cambia:
   *
   * - page
   * - limit
   * - search
   *
   * consultamos nuevamente.
   */
  useEffect(() => {
    fetchFilas();
  }, [
    pagination.page,
    pagination.limit,
    searchInput,
  ]);

  /**
   * ============================================================
   * COLUMNAS
   * ============================================================
   */
  const columns =
    useMemo(
      () => [
        {
          accessorKey:
            'nombre_tipo_accion',

          header:
            'Tipo de acción',

          cell: ({
            row,
          }) => (
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

                <TagIcon className="h-5 w-5" />

              </div>

              <span className="font-semibold text-slate-800">

                {
                  row.original
                    .nombre_tipo_accion
                }

              </span>

            </div>
          ),
        },

        {
          id:
            'acciones',

          header:
            'Acciones',

          cell: ({
            row,
          }) => (
            <div className="flex justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  openModal(
                    MODALS.EDIT,
                    row.original,
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >

                <PencilSquareIcon className="h-4 w-4" />

                Editar

              </button>

            </div>
          ),
        },
      ],

      [
        openModal,
      ],
    );

  /**
   * ============================================================
   * BUSCAR
   * ============================================================
   */
  const handleSearch = (
    event,
  ) => {
    /**
     * Cuando cambia la búsqueda
     * volvemos a página 1.
     */
    setPagination(
      (previous) => ({
        ...previous,

        page:
          1,
      }),
    );

    setSearchInput(
      event.target.value,
    );
  };

  /**
   * ============================================================
   * LIMPIAR BÚSQUEDA
   * ============================================================
   */
  const clearSearch = () => {
    setSearchInput('');

    setPagination(
      (previous) => ({
        ...previous,

        page:
          1,
      }),
    );
  };

  return (
    <>
      <section className="space-y-5">

        {/* ====================================================
            ENCABEZADO
            ==================================================== */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Tipos de acción
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Administra los tipos de acción disponibles en el sistema.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              openModal(
                MODALS.CREATE,
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >

            <PlusIcon className="h-5 w-5" />

            Nuevo tipo de acción

          </button>

        </div>

        {/* ====================================================
            BUSCADOR
            ==================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div className="w-full lg:max-w-md">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar tipo de acción
              </label>

              <div className="relative">

                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={
                    searchInput
                  }
                  onChange={
                    handleSearch
                  }
                  placeholder="Buscar por nombre"
                  className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-11 text-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Limpiar búsqueda"
                  >

                    <XMarkIcon className="h-4 w-4" />

                  </button>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            TABLA
            ==================================================== */}

        <DataTable
          data={
            filas
          }
          columns={
            columns
          }
          loading={
            loading
          }
          page={
            pagination.page
          }
          totalPages={
            pagination.totalPages
          }
          totalItems={
            pagination.totalItems
          }
          limit={
            pagination.limit
          }

          /**
           * Cambiar página.
           */
          onPageChange={(
            newPage,
          ) =>
            setPagination(
              (
                previous,
              ) => ({
                ...previous,

                page:
                  newPage,
              }),
            )
          }

          /**
           * Cambiar registros por página.
           */
          onLimitChange={(
            newLimit,
          ) =>
            setPagination(
              (
                previous,
              ) => ({
                ...previous,

                page:
                  1,

                limit:
                  Number(
                    newLimit,
                  ),
              }),
            )
          }
        />

      </section>

      {/* ======================================================
          CREAR
          ====================================================== */}

      <TipoAccionModal
        open={
          isModalOpen(
            MODALS.CREATE,
          )
        }
        onClose={() =>
          closeModal(
            MODALS.CREATE,
          )
        }
        onSuccess={() => {
          /**
           * Cerramos modal.
           */
          closeModal(
            MODALS.CREATE,
          );

          /**
           * Actualizamos tabla.
           */
          fetchFilas();
        }}
      />

      {/* ======================================================
          EDITAR
          ====================================================== */}

      <TipoAccionModal
        open={
          isModalOpen(
            MODALS.EDIT,
          )
        }
        isEdit
        dataRow={
          modalState?.data
        }
        onClose={() =>
          closeModal(
            MODALS.EDIT,
          )
        }
        onSuccess={() => {
          closeModal(
            MODALS.EDIT,
          );

          fetchFilas();
        }}
      />

    </>
  );
}