import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
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
  const ActiveView = views[activeView] || CrearMultaView;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Gestión de multas"
        description="Crea, asigna y administra las multas registradas."
      />

      <MultasTabs activeView={activeView} onChange={setActiveView} />

      <ActiveView onCreated={() => setActiveView('listar')} />
    </section>
  );
}
