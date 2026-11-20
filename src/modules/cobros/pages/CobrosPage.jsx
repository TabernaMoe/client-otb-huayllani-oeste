import { useState } from 'react';
import CobrosTabs from '../components/CobrosTabs';
import CobrarGeneralView from '../components/CobrarGeneralView';
import CobrarMultasView from '../components/CobrarMultasView';

const views = {
  cobros_generales: CobrarGeneralView,
  multas: CobrarMultasView,
};

export default function CobrosPage() {
  const [activeView, setActiveView] = useState('cobros_generales');
  const ActiveView = views[activeView] || CobrarGeneralView;

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
      </header>

      <CobrosTabs activeView={activeView} onChange={setActiveView} />
      <ActiveView />
    </section>
  );
}