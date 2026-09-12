import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import CobrosPorAccionView from '../components/reportes/CobrosPorAccionView';
import HistorialCobrosView from '../components/reportes/HistorialCobrosView';
import ReportesTabs from '../components/reportes/ReportesTabs';

export default function ReportesPage() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        description="Consulta el historial de cobros general y por acción."
      />

      <ReportesTabs value={tab} onChange={setTab} />

      {tab === 'general' ? <HistorialCobrosView /> : <CobrosPorAccionView />}
    </div>
  );
}
