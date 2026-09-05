import {
  useEffect,
  useState,
} from 'react';

import {
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

import {
  CobrosServices,
} from '../services/cobros.services';

import SocioSelector
  from './SocioSelector';

import {
  getSocioName,
} from '../utils/cobros.utils';


export default function CobrarMultasView() {

  const [
    socios,
    setSocios,
  ] = useState([]);


  const [
    selectedSocio,
    setSelectedSocio,
  ] = useState(
    null,
  );


  const [
    search,
    setSearch,
  ] = useState('');


  const [
    loading,
    setLoading,
  ] = useState(false);


  // =========================================================
  // GET SOCIOS
  // =========================================================

  const cargarSocios =
    async () => {

      try {

        setLoading(
          true,
        );


        const response =
          await CobrosServices.getSocios({

            page:
              1,

            limit:
              100,

            search,
          });


        setSocios(
          Array.isArray(
            response?.data,
          )
            ? response.data
            : [],
        );

      } finally {

        setLoading(
          false,
        );
      }
    };


  useEffect(
    () => {

      const timeout =
        setTimeout(
          cargarSocios,
          350,
        );


      return () =>
        clearTimeout(
          timeout,
        );

    },
    [
      search,
    ],
  );


  return (

    <div>

      {/* HEADER */}

      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">

        <div className="flex items-center gap-3">

          <ExclamationTriangleIcon className="h-7 w-7 text-amber-700" />


          <div>

            <h2 className="font-bold text-amber-900">

              Cobrar multas

            </h2>


            <p className="mt-1 text-sm text-amber-800/80">

              Selecciona un socio y revisa las multas pendientes.

            </p>

          </div>

        </div>

      </div>


      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">

        <SocioSelector
          socios={
            socios
          }
          selectedSocio={
            selectedSocio
          }
          loading={
            loading
          }
          search={
            search
          }
          onSearchChange={
            setSearch
          }
          onSelect={
            setSelectedSocio
          }
        />


        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          {!selectedSocio ? (

            <div className="flex min-h-100 items-center justify-center text-center">

              <div>

                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-amber-400" />


                <h3 className="mt-4 font-bold text-slate-900">

                  Seleccione un socio

                </h3>


                <p className="mt-2 text-sm text-slate-500">

                  Las multas pendientes aparecerán aquí.

                </p>

              </div>

            </div>

          ) : (

            <div>

              <h3 className="font-bold text-slate-900">

                Multas de

                {' '}

                {
                  getSocioName(
                    selectedSocio,
                  )
                }

              </h3>


              <div className="mt-5 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-10 text-center text-sm text-amber-700">

                Interfaz preparada.

                <br />

                Falta conectar el endpoint que devuelve
                las multas pendientes del socio.

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}