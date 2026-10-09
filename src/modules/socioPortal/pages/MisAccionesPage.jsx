import SocioListPage from './SocioListPage';
import { SocioPortalServices } from '../services/socioPortal.services';

const loader = () => SocioPortalServices.getAcciones();
const columns = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'nro_medidor', label: 'Medidor' },
  { key: 'calle', label: 'Calle' },
  { key: 'tarifa', label: 'Tarifa' },
  { key: 'estado', label: 'Estado' },
];

export default function MisAccionesPage() {
  return <SocioListPage title="Mis acciones" description="Acciones asociadas a tu cuenta." loader={loader} columns={columns} />;
}
