import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PowerIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import DataTable
  from '../../../components/DataTable';

import ElegantInput
  from '../../../components/ElegantInput';

import SelectComponent
  from '../../../components/Select';

import {
  MultasServices as Servs,
} from '../services/multas.services';

import MultaModal
  from './MultaModal';


const estadoOptions = [

  {
    value:
      true,

    label:
      'Activas',
  },

  {
    value:
      false,

    label:
      'Inactivas',
  },
];


export default function ListarMultasView() {

  // =========================================================
  // MULTAS
  // =========================================================

  const [
    multas,
    setMultas,
  ] = useState([]);


  // =========================================================
  // LOADING
  // =========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  // =========================================================
  // SEARCH
  // =========================================================

  const [
    searchInput,
    setSearchInput,
  ] = useState('');


  const [
    search,
    setSearch,
  ] = useState('');


  // =========================================================
  // ESTADO
  // =========================================================

  const [
    estado,
    setEstado,
  ] = useState(
    null,
  );


  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const [
    pagination,
    setPagination,
  ] = useState({

    page:
      1,

    limit:
      5,

    totalItems:
      0,

    totalPages:
      1,
  });


  // =========================================================
  // EDIT MODAL
  // =========================================================

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);


  const [
    selectedMulta,
    setSelectedMulta,
  ] = useState(
    null,
  );


  // =========================================================
  // GET
  // =========================================================

  const cargarMultas =
    async () => {

      try {

        setLoading(
          true,
        );


        const params = {

          page:
            pagination.page,

          limit:
            pagination.limit,

          search,
        };


        if (
          estado !== null &&
          estado !== undefined
        ) {

          params.estado =
            estado;
        }


        const response =
          await Servs.getAll(
            params,
          );


        if (
          !response?.ok
        ) {

          setMultas([]);

          return;
        }


        setMultas(
          Array.isArray(
            response.data,
          )
            ? response.data
            : [],
        );


        setPagination(
          (
            previous,
          ) => ({

            ...previous,

            page:
              response?.page ??
              previous.page,

            limit:
              response?.limit ??
              previous.limit,

            totalItems:
              response?.total ??
              0,

            totalPages:
              response?.totalPages ??
              1,
          }),
        );

      } catch (error) {

        console.error(
          'ERROR MULTAS:',
          error,
        );


        setMultas([]);

      } finally {

        setLoading(
          false,
        );
      }
    };


  // =========================================================
  // BUSCAR
  // =========================================================

  const handleBuscar =
    () => {

      setPagination(
        (
          previous,
        ) => ({

          ...previous,

          page:
            1,
        }),
      );


      setSearch(
        searchInput.trim(),
      );
    };


  // =========================================================
  // ESTADO
  // =========================================================

  const handleEstadoChange =
    (
      event,
    ) => {

      setEstado(
        event.target.value ??
        null,
      );


      setPagination(
        (
          previous,
        ) => ({

          ...previous,

          page:
            1,
        }),
      );
    };


  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const handlePageChange =
    (
      page,
    ) => {

      setPagination(
        (
          previous,
        ) => ({

          ...previous,

          page,
        }),
      );
    };


  const handleLimitChange =
    (
      limit,
    ) => {

      setPagination(
        (
          previous,
        ) => ({

          ...previous,

          page:
            1,

          limit,
        }),
      );
    };


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit =
    (
      multa,
    ) => {

      setSelectedMulta(
        multa,
      );


      setModalOpen(
        true,
      );
    };


  const handleCloseModal =
    () => {

      setModalOpen(
        false,
      );


      setSelectedMulta(
        null,
      );
    };


  // =========================================================
  // SAVED
  // =========================================================

  const handleSaved =
    async () => {

      await cargarMultas();
    };


  // =========================================================
  // CAMBIAR ESTADO
  // =========================================================

  const handleCambiarEstado =
    async (
      multa,
    ) => {

      const confirmChange =
        window.confirm(
          `¿Desea cambiar el estado de "${multa.nombre_multa}"?`,
        );


      if (
        !confirmChange
      ) {

        return;
      }


      const response =
        await Servs.cambiarEstado(
          multa.id,
        );


      if (
        !response?.ok
      ) {

        window.alert(
          response?.message ||
          'No se pudo cambiar el estado',
        );


        return;
      }


      await cargarMultas();
    };


  // =========================================================
  // COLUMNS
  // =========================================================

  const columns =
    useMemo(
      () => [

        {
          accessorKey:
            'nombre_multa',

          header:
            'Multa',

          cell:
            (
              {
                row,
              },
            ) => (

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">

                  <TagIcon className="h-5 w-5" />

                </div>


                <div>

                  <p className="font-semibold text-slate-800">

                    {
                      row.original.nombre_multa
                    }

                  </p>


                  <p className="text-xs text-slate-400">

                    ID:

                    {' '}

                    {
                      row.original.id
                    }

                  </p>

                </div>

              </div>

            ),
        },


        {
          accessorKey:
            'precio',

          header:
            'Precio',

          cell:
            (
              {
                row,
              },
            ) => (

              <span className="font-semibold text-slate-700">

                Bs

                {' '}

                {
                  Number(
                    row.original.precio ||
                    0,
                  ).toFixed(
                    2,
                  )
                }

              </span>

            ),
        },


        {
          accessorKey:
            'estado',

          header:
            'Estado',

          cell:
            (
              {
                row,
              },
            ) => {

              const active =
                row.original.estado ===
                true;


              return (

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-3 py-1
                    text-xs
                    font-semibold

                    ${
                      active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }
                  `}
                >

                  <span className="h-1.5 w-1.5 rounded-full bg-current" />


                  {
                    active
                      ? 'Activa'
                      : 'Inactiva'
                  }

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
            (
              {
                row,
              },
            ) => (

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    handleEdit(
                      row.original,
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >

                  <PencilSquareIcon className="h-4 w-4" />

                  Editar

                </button>


                <button
                  type="button"
                  onClick={() =>
                    handleCambiarEstado(
                      row.original,
                    )
                  }
                  title="Cambiar estado"
                  className="rounded-lg border border-amber-300 p-2 text-amber-600 hover:bg-amber-50"
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
  // CARDS
  // =========================================================

  const activasVisibles =
    multas.filter(
      (
        multa,
      ) =>
        multa.estado ===
        true,
    ).length;


  const inactivasVisibles =
    multas.filter(
      (
        multa,
      ) =>
        multa.estado ===
        false,
    ).length;


  // =========================================================
  // EFFECT
  // =========================================================

  useEffect(
    () => {

      cargarMultas();

    },
    [
      pagination.page,
      pagination.limit,
      search,
      estado,
    ],
  );


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="space-y-5">

      {/* HEADER */}

      <div>

        <h2 className="text-lg font-bold text-slate-900">

          Multas registradas

        </h2>


        <p className="mt-1 text-sm text-slate-500">

          Consulta, edita y cambia el estado de las multas.

        </p>

      </div>


      {/* CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <StatCard
          label="Total de multas"
          value={
            pagination.totalItems
          }
          icon={
            BanknotesIcon
          }
        />


        <StatCard
          label="Activas visibles"
          value={
            activasVisibles
          }
          icon={
            CheckCircleIcon
          }
        />


        <StatCard
          label="Inactivas visibles"
          value={
            inactivasVisibles
          }
          icon={
            PowerIcon
          }
        />

      </div>


      {/* FILTROS */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_260px_auto] md:items-end">

          <ElegantInput
            label="Buscar multa"
            name="search"
            value={
              searchInput
            }
            onChange={
              (
                event,
              ) =>
                setSearchInput(
                  event.target.value,
                )
            }
            placeholder="Ej: perros, basura..."
            icon={
              <MagnifyingGlassIcon className="h-5 w-5" />
            }
          />


          <SelectComponent
            label="Estado"
            placeholder="Todos"
            name="estado"
            options={
              estadoOptions
            }
            value={
              estado
            }
            onChange={
              handleEstadoChange
            }
          />


          <div className="flex gap-2">

            <button
              type="button"
              onClick={
                handleBuscar
              }
              className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-900"
            >

              Buscar

            </button>


            <button
              type="button"
              onClick={
                cargarMultas
              }
              disabled={
                loading
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
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


      {/* TABLE */}

      <DataTable
        data={
          multas
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
        limit={
          pagination.limit
        }
        totalPages={
          pagination.totalPages
        }
        totalItems={
          pagination.totalItems
        }
        onPageChange={
          handlePageChange
        }
        onLimitChange={
          handleLimitChange
        }
      />


      {/* EDIT MODAL */}

      <MultaModal
        open={
          modalOpen
        }
        mode="edit"
        multa={
          selectedMulta
        }
        onClose={
          handleCloseModal
        }
        onSaved={
          handleSaved
        }
      />

    </div>
  );
}


function StatCard({
  label,
  value,
  icon: Icon,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium uppercase text-slate-400">

            {label}

          </p>


          <p className="mt-2 text-2xl font-bold text-slate-900">

            {value}

          </p>

        </div>


        <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">

          <Icon className="h-6 w-6" />

        </div>

      </div>

    </div>
  );
}