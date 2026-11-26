import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import CobrosTabs from '../components/CobrosTabs';
import CobrarGeneralView from '../components/CobrarGeneralView';
import CobroPorAccionView from '../components/CobroPorAccionView';

const views = {
  por_socio: CobrarGeneralView,
  por_accion: CobroPorAccionView,
};

export default function CobrosPage() {
  const [activeView, setActiveView] = useState('por_socio');
  const ActiveView = views[activeView] || CobrarGeneralView;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Cobros generales"
        description="Consulta cobros pendientes por socio o por acción y registra el pago."
      />

      <CobrosTabs activeView={activeView} onChange={setActiveView} />
      <ActiveView />
    </section>
  );
}
