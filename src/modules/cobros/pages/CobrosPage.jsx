import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
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
      <PageHeader
        title="Gestión de cobros"
        description="Registra cobros generales y multas pendientes por socio."
      />

      <CobrosTabs activeView={activeView} onChange={setActiveView} />
      <ActiveView />
    </section>
  );
}
