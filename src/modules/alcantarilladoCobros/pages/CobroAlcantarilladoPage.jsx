import PageHeader from '../../../components/PageHeader';
import CobroAlcantarilladoView from '../components/CobroAlcantarilladoView';

export default function CobroAlcantarilladoPage() {
  return (
    <section className="space-y-5">
      <PageHeader
        title="Cobros de alcantarillado"
        description="Registra pagos de alcantarillado por socio y consulta el historial."
      />

      <CobroAlcantarilladoView />
    </section>
  );
}
