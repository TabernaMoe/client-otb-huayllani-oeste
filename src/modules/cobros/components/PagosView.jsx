import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowPathIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import DataTable
  from '../../../components/DataTable';

import ElegantInput
  from '../../../components/ElegantInput';

import {
  CobrosServices,
} from '../services/cobros.services';

import {
  formatMoney,
} from '../utils/cobros.utils';


export default function PagosView() {

  // =========================================================
  // DATOS
  // =========================================================

  const [
    pagos,
    setPagos,
  ] = useState([]);


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
  // GET
  // =========================================================

  const cargarPagos =
    async () => {

      try {

        setLoading(
          true,
        );


        const response =
          await CobrosServices.getHistorial({

            page:
              pagination.page,

            limit:
              pagination.limit,

            search,
          });


        if (
          !response?.ok
        ) {

          setPagos([]);

          return;
        }


        setPagos(
          Array.isArray(
            response.data,
          )
            ? response.data
            : [],
        );


        setPagination(
          (previous) => ({

            ...previous,

            page:
              response.page ??
              previous.page,

            limit:
              response.limit ??
              previous.limit,

            totalItems:
              response.total ??
              0,

            totalPages:
              response.totalPages ??
              1,
          }),
        );

      } catch (error) {

        console.error(
          error,
        );


        setPagos([]);

      } finally {

        setLoading(
          false,
        );
      }
    };


  useEffect(
    () => {

      cargarPagos();

    },
    [
      pagination.page,
      pagination.limit,
      search,
    ],
  );


  // =========================================================
  // COLUMNAS
  // =========================================================

  const columns =
    useMemo(
      () => [

        {
          accessorKey:
            'concepto',

          header:
            'Concepto',
        },


        {
          accessorKey:
            'tipo_cobro',

          header:
            'Tipo',
        },


        {
          accessorKey:
            'monto_total',

          header:
            'Monto total',

          cell:
            ({ row }) =>
              formatMoney(
                row.original.monto_total,
              ),
        },


        {
          accessorKey:
            'monto_pagado',

          header:
            'Pagado',

          cell:
            ({ row }) =>
              formatMoney(
                row.original.monto_pagado,
              ),
        },


        {
          accessorKey:
            'saldo',

          header:
            'Saldo',

          cell:
            ({ row }) => (

              <span className="font-semibold text-emerald-700">

                {
                  formatMoney(
                    row.original.saldo,
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
            ({ row }) => (

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">

                {
                  row.original.estado
                }

              </span>

            ),
        },

      ],
      [],
    );


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="space-y-5">

      {/* HEADER */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">

            <BanknotesIcon className="h-6 w-6" />

          </div>


          <div>

            <h2 className="font-bold text-slate-900">

              Pagos e historial

            </h2>


            <p className="text-sm text-slate-500">

              Consulta el historial global de cobros registrados.

            </p>

          </div>

        </div>

      </div>


      {/* FILTROS */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">

          <ElegantInput
            label="Buscar"
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
            placeholder="Buscar concepto..."
            icon={
              <MagnifyingGlassIcon className="h-5 w-5" />
            }
          />


          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => {

                setPagination(
                  (previous) => ({

                    ...previous,

                    page:
                      1,
                  }),
                );

                setSearch(
                  searchInput.trim(),
                );

              }}
              className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white"
            >

              Buscar

            </button>


            <button
              type="button"
              onClick={
                cargarPagos
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
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


      {/* TABLA */}

      <DataTable
        data={
          pagos
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
          (page) =>
            setPagination(
              (previous) => ({

                ...previous,

                page,
              }),
            )
        }
        onLimitChange={
          (limit) =>
            setPagination(
              (previous) => ({

                ...previous,

                page:
                  1,

                limit,
              }),
            )
        }
      />

    </div>
  );
}