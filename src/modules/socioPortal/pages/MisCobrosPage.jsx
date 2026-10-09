import SocioListPage from './SocioListPage';
import { SocioPortalServices } from '../services/socioPortal.services';

const loader = () => SocioPortalServices.getCobros();
const columns = [
  { key: 'concepto', label: 'Concepto' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'monto', label: 'Monto' },
  { key: 'estado', label: 'Estado' },
];

export default function MisCobrosPage() {
  return <SocioListPage title="Mis cobros" description="Cobros y deudas asociados a tu cuenta." loader={loader} columns={columns} />;
}
