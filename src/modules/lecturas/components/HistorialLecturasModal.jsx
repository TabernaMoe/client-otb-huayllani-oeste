import FormModal from '../../../components/FormModal';

const money = (value) => `Bs ${Number(value).toFixed(2)}`;

export default function HistorialLecturasModal({ open, accion, onClose }) {
  const lecturas = accion?.lecturas ?? [];

  return (
    <FormModal
      open={open}
      title="Historial de lecturas"
      description={`${accion?.nombre_completo ?? ''} · Acción #${accion?.codigo_interno ?? ''}`}
      onClose={onClose}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Anterior</th>
                <th className="px-4 py-3">Actual</th>
                <th className="px-4 py-3">Consumo</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lecturas.map((lectura, index) => (
                <tr key={`${lectura.periodo}-${index}`}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{lectura.periodo}</td>
                  <td className="px-4 py-3">{lectura.lectura_anterior} m³</td>
                  <td className="px-4 py-3">{lectura.lectura_actual} m³</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">{lectura.consumo_m3} m³</td>
                  <td className="px-4 py-3">{money(lectura.precio)}</td>
                  <td className="px-4 py-3 text-slate-500">{lectura.observacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!lecturas.length && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No hay lecturas registradas.</p>
        )}
      </div>
    </FormModal>
  );
}
