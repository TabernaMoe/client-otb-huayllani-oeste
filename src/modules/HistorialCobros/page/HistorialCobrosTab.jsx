import { useState } from 'react';
import Tabs from '../../../components/Tab';

import HistorialGeneral from '../page/HistorialGeneral/HistorialGeneral';
import HistorialByAccion from '../page/HistorialByAccion/HistorialByAccion';

const tabs = [
  {
    key: 'HistorialGeneral',
    label: 'HISTORIAL COBROS',
  },
  {
    key: 'HistorialByAccion',
    label: 'HISTORIAL DE COBROS POR ACCION',
  },
];

export default function HistorialCobrosTab() {
  const [tab, setTab] = useState('HistorialGeneral');

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} onChange={setTab} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {tab === 'HistorialGeneral' && <HistorialGeneral />}
        {tab === 'HistorialByAccion' && <HistorialByAccion />}
      </div>
    </div>
  );
}
