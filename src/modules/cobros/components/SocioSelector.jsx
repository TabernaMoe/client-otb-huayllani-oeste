import {
  CreditCardIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  getSocioCi,
  getSocioId,
  getSocioInitials,
  getSocioName,
} from '../utils/cobros.utils';


export default function SocioSelector({
  socios = [],
  selectedSocio = null,
  loading = false,
  search = '',
  onSearchChange,
  onSelect,
}) {

  return (

    <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 px-5 py-5">

        <div className="flex items-center gap-3">

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">

            1

          </span>


          <div>

            <h2 className="font-bold text-slate-900">

              Buscar socio

            </h2>


            <p className="text-xs text-slate-500">

              Selecciona el socio correspondiente.

            </p>

          </div>

        </div>


        {/* ===================================================
            BUSCADOR
        ==================================================== */}

        <div className="relative mt-4">

          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />


          <input
            type="search"
            value={
              search
            }
            onChange={
              (
                event,
              ) =>
                onSearchChange?.(
                  event.target.value,
                )
            }
            placeholder="Buscar por nombre o CI"
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50"
          />


          {search && (

            <button
              type="button"
              onClick={() =>
                onSearchChange?.(
                  '',
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >

              <XMarkIcon className="h-4 w-4" />

            </button>

          )}

        </div>

      </div>


      {/* =====================================================
          LISTA
      ====================================================== */}

      <div className="max-h-180 space-y-2 overflow-y-auto p-3">

        {loading ? (

          <div className="flex flex-col items-center justify-center py-12">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />


            <p className="mt-3 text-sm text-slate-500">

              Cargando socios...

            </p>

          </div>

        ) : socios.length ===
          0 ? (

          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">

            <UserGroupIcon className="mx-auto h-8 w-8 text-slate-300" />


            <p className="mt-3 text-sm text-slate-500">

              No se encontraron socios.

            </p>

          </div>

        ) : (

          socios.map(
            (socio) => {

              const socioId =
                getSocioId(
                  socio,
                );


              const active =
                getSocioId(
                  selectedSocio,
                ) ===
                socioId;


              return (

                <button
                  key={
                    socioId
                  }
                  type="button"
                  onClick={() =>
                    onSelect?.(
                      socio,
                    )
                  }
                  className={`
                    w-full
                    rounded-lg
                    border
                    p-3
                    text-left
                    transition

                    ${
                      active
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                    }
                  `}
                >

                  <div className="flex items-center gap-3">

                    {/* AVATAR */}

                    <div
                      className={`
                        flex h-11 w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-sm
                        font-bold

                        ${
                          active
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'bg-slate-100 text-slate-600'
                        }
                      `}
                    >

                      {
                        getSocioInitials(
                          socio,
                        ) ||
                        'S'
                      }

                    </div>


                    {/* DATOS */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold text-slate-900">

                        {
                          getSocioName(
                            socio,
                          )
                        }

                      </p>


                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                        <IdentificationIcon className="h-3.5 w-3.5" />

                        CI:

                        {' '}

                        {
                          getSocioCi(
                            socio,
                          )
                        }

                      </div>


                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                        <CreditCardIcon className="h-3.5 w-3.5" />


                        {
                          Array.isArray(
                            socio.acciones,
                          )
                            ? socio.acciones.length
                            : 0
                        }

                        {' '}

                        acciones

                      </div>

                    </div>

                  </div>

                </button>

              );
            },
          )

        )}

      </div>

    </aside>
  );
}