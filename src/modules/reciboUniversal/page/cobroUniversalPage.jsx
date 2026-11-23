import UniversalFormView from '../components/UniversalFormView';
import { ReciboMadreSerivices } from '../services';

export default function CobroUniversalPage() {
  return (
    <UniversalFormView
      title="Cobro universal"
      description="Registra un cobro universal asociado a una acción."
      sectionTitle="Datos del cobro"
      sectionDescription="Define la acción, concepto, descripción y monto del cobro."
      submitLabel="Guardar cobro universal"
      confirmTitle="Confirmar cobro universal"
      confirmMessage="¿Deseas registrar este cobro universal?"
      onSubmitPayload={ReciboMadreSerivices.createCobro}
    />
  );
}
