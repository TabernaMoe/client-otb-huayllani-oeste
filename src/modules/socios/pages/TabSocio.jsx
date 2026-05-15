import { useState } from 'react';
import Tab from '../../../components/Tab';
import SocioPage from './socios/SocioPage';
import SociosDeleteds from './SociosDeleteds/SociosDeleteds';

const tabs = [
  { key: 'SocioPage', label: 'Socios' },
  { key: 'SociosDeleteds', label: 'Socios eliminados' },
];

export default function PlanillaAdministracion() {
  const [tab, setTab] = useState('SocioPage');

  return (
    <div className="space-y-6">
      <Tab tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'SocioPage' && <SocioPage />}
        {tab === 'SociosDeleteds' && <SociosDeleteds />}
      </div>
    </div>
  );
}
