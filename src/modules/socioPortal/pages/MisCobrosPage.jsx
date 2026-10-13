import SocioListPage from './SocioListPage';
import { SocioPortalServices } from '../services/socioPortal.services';
import { formatDate,formatCurrency, } from '../../../utils/formatters';
const loader = async () => {
  const response = await SocioPortalServices.getCobros();
  return response;
};

const columns = [
  { key: 'concepto', label: 'Concepto' },
  { key: 'fecha_emision', label: 'Fecha',render: formatDate, },
  { key: 'monto', label: 'Monto', render: formatCurrency, },
  { key: 'estado', label: 'Estado' },
];

export default function MisCobrosPage() {
  return <SocioListPage title="Mis cobros" description="Cobros y deudas asociados a tu cuenta." loader={loader} columns={columns} />;
}
