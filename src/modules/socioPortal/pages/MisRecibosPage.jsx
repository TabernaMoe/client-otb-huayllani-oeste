import SocioListPage from './SocioListPage';
import { SocioPortalServices } from '../services/socioPortal.services';

const loader = () => SocioPortalServices.getRecibos();
const columns = [
  { key: 'numero_recibo', label: 'N.º recibo' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'concepto', label: 'Concepto' },
  { key: 'monto', label: 'Monto' },
];

export default function MisRecibosPage() {
  return <SocioListPage title="Mis recibos" description="Recibos emitidos por tus pagos." loader={loader} columns={columns} />;
}
