import { useState } from 'react';
import Tab from '../../../components/Tab';
import AccionesPage from '../pages/acciones/AccionesPage';
import CalleRamalPage from './calleRamal/CalleRamalPage';
import TipoAccionPage from './tipoAccion/TipoAccionPage';

const tabs = [
  { key: 'AccionesPage', label: 'Gestion de acciones' },
  { key: 'CalleRamalPage', label: 'Gestion de calles' },
  { key: 'TipoAccionPage', label: 'Gestion de tipos de acciones' },
];

export default function PlanillaAdministracion() {
  const [tab, setTab] = useState('general');

  return (
    <div className="space-y-6">
      <Tab tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'AccionesPage' && <AccionesPage />}
        {tab === 'CalleRamalPage' && <CalleRamalPage />}
        {tab === 'TipoAccionPage' && <TipoAccionPage />}
      </div>
    </div>
  );
}
