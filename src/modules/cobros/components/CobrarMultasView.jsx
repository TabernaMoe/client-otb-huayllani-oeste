import CobroPendienteView from './CobroPendienteView';

export default function CobrarMultasView() {
  return (
    <CobroPendienteView
      tipoCobro="MULTA"
      title="Cobrar multas"
      description="Selecciona un socio y las multas pendientes que deseas cobrar."
    />
  );
}
