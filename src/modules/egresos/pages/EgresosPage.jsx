import { useState } from 'react';
import EgresosTabs from '../components/EgresosTabs';
import CategoriasEgresoView from '../components/CategoriasEgresoView';
import RegistrarEgresoView from '../components/RegistrarEgresoView';

const views = {
  categorias: CategoriasEgresoView,
  egresos: RegistrarEgresoView,
};

export default function EgresosPage() {
  const [activeView, setActiveView] = useState('categorias');
  const ActiveView = views[activeView];

  return (
    <section className="space-y-5">
      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-emerald-700">Egresos</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Gestión de egresos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Administra los tipos de egreso y registra los gastos de la OTB.
        </p>
      </header>

      <EgresosTabs activeView={activeView} onChange={setActiveView} />
      <ActiveView />
    </section>
  );
}
