import SocioListPage from './SocioListPage';
import { SocioPortalServices } from '../services/socioPortal.services';
import { formatDate, formatCurrency } from '../../../utils/formatters';
const loader = () => SocioPortalServices.getRecibos();
const columns = [
  { key: 'numero_recibo', label: 'N.º recibo' },
  { key: 'fecha_emision', label: 'Fecha', render: formatDate },
  { key: 'concepto', label: 'Concepto' },
  { key: 'monto', label: 'Monto', render: formatCurrency },
];

export default function MisRecibosPage() {
  return <SocioListPage title="Mis recibos" description="Recibos emitidos por tus pagos." loader={loader} columns={columns} />;
}
