import SocioListPage from './SocioListPage';
import { SocioPortalServices } from '../services/socioPortal.services';

const loader = () => SocioPortalServices.getLecturas();
const columns = [
  { key: 'gestion', label: 'Gestión' },
  { key: 'mes', label: 'Mes' },
  { key: 'lectura_anterior', label: 'Anterior' },
  { key: 'lectura_actual', label: 'Actual' },
  { key: 'consumo_m3', label: 'Consumo m³' },
  { key: 'monto', label: 'Monto' },
];

export default function MisLecturasPage() {
  return <SocioListPage title="Mis lecturas" description="Historial de consumo de tus acciones de agua." loader={loader} columns={columns} />;
}
