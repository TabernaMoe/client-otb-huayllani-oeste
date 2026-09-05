import {
  useState,
} from 'react';

import MultasTabs
  from '../components/MultasTabs';

import CrearMultaView
  from '../components/CrearMultaView';

import MultarAccionView
      from '../components/MultarAccionView';

    import ListarMultasView
  from '../components/ListarMultasView';


export default function MultasPage() {

  // =========================================================
  // VISTA ACTIVA
  // =========================================================

  const [
    activeView,
    setActiveView,
  ] = useState(
    'crear',
  );


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <section className="min-h-screen">

      <div className="space-y-5">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header>

          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">

            <span>
              Inicio
            </span>

            <span>
              /
            </span>

            <span className="text-emerald-700">
              Multas
            </span>

          </div>


          <h1 className="text-2xl font-bold tracking-tight text-slate-900">

            Gestión de multas

          </h1>


          <p className="mt-1 text-sm text-slate-500">

            Crea multas, asígnalas a las acciones
            y administra las multas registradas.

          </p>

        </header>


        {/* ===================================================
            TABS
        ==================================================== */}

        <MultasTabs
          activeView={
            activeView
          }
          onChange={
            setActiveView
          }
        />


        {/* ===================================================
            VISTAS
        ==================================================== */}

        {activeView ===
          'crear' && (

          <CrearMultaView
            onCreated={() =>
              setActiveView(
                'listar',
              )
            }
          />

        )}


        {activeView ===
          'multar' && (

          <MultarAccionView />

        )}


        {activeView ===
          'listar' && (

          <ListarMultasView />

        )}

      </div>

    </section>
  );
}