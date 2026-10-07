import { useState } from 'react';
import CobrosTabs from '../components/CobrosTabs';
import CobroAlcantarilladoView from '../components/CobroAlcantarilladoView';

const views = {
  alcantarillado: CobroAlcantarilladoView,
};

export default function CobrosPage() {
  const [activeView, setActiveView] = useState('alcantarillado');
  const ActiveView = views[activeView];

  return (
    <section className="space-y-5">
      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-emerald-700">Cobros</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Gestión de cobros
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cobra acciones, alcantarillado y multas, registra pagos y consulta el
          historial.
        </p>
      </header>

      <CobrosTabs activeView={activeView} onChange={setActiveView} />
      <ActiveView />
    </section>
  );
}
