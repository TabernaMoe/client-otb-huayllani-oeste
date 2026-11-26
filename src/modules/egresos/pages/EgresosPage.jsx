import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import EgresosTabs from '../components/EgresosTabs';
import CategoriasEgresoView from '../components/CategoriasEgresoView';
import RegistrarEgresoView from '../components/RegistrarEgresoView';

const views = {
  categorias: CategoriasEgresoView,
  egresos: RegistrarEgresoView,
};

export default function EgresosPage() {
  const [activeView, setActiveView] = useState('categorias');
  const ActiveView = views[activeView] || CategoriasEgresoView;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Gestión de egresos"
        description="Administra los tipos de egreso y registra los gastos de la OTB."
      />

      <EgresosTabs activeView={activeView} onChange={setActiveView} />
      <ActiveView />
    </section>
  );
}
