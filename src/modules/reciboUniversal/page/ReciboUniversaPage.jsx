import UniversalFormView from '../components/UniversalFormView';
import { ReciboMadreSerivices } from '../services';

export default function ReciboUniversalPage() {
  return (
    <UniversalFormView
      title="Recibo universal"
      description="Registra un recibo universal con código y monto base."
      sectionTitle="Datos del recibo"
      sectionDescription="Define la acción, concepto, descripción y monto del recibo universal."
      submitLabel="Guardar recibo universal"
      confirmTitle="Confirmar recibo universal"
      confirmMessage="¿Deseas registrar este recibo universal?"
      onSubmitPayload={ReciboMadreSerivices.create}
    />
  );
}
