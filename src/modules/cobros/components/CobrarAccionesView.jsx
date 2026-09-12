import CobroPendienteView from './CobroPendienteView';

export default function CobrarAccionesView() {
  return (
    <CobroPendienteView
      tipoCobro="ACCION"
      title="Cobrar acciones"
      description="Selecciona un socio y los conceptos de acción que deseas cobrar."
    />
  );
}
