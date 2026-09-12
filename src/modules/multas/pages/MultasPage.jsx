import { useState } from 'react';
import CrearMultaView from '../components/CrearMultaView';
import ListarMultasView from '../components/ListarMultasView';
import MultarAccionView from '../components/MultarAccionView';
import MultasTabs from '../components/MultasTabs';

const views = {
  crear: CrearMultaView,
  multar: MultarAccionView,
  listar: ListarMultasView,
};

export default function MultasPage() {
  const [activeView, setActiveView] = useState('crear');
  const ActiveView = views[activeView];

  return (
    <section className="space-y-5">
      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-emerald-700">Multas</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Gestión de multas
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Crea, asigna y administra las multas registradas.
        </p>
      </header>

      <MultasTabs activeView={activeView} onChange={setActiveView} />

      <ActiveView
        onCreated={() => setActiveView('listar')}
      />
    </section>
  );
}
