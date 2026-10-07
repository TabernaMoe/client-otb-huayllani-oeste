import { useState, useEffect, useCallback } from 'react';
import FormModal from '../../../components/FormModal';
import { LecturasServices } from '../services/lecturas.services';
import EditarMora from './EditarMora';
import { MODALS, useModalManager } from '../../../hooks/useModalManager';

const money = (value) => `Bs ${Number(value).toFixed(2)}`;

export default function HistorialLecturasModal({ open, accion, onClose }) {
  const { closeModal, isModalOpen, modalState, openModal } = useModalManager();
  const [loading, setLoading] = useState(false);
  const [filas, setFilas] = useState([]);

  const dataLoad = useCallback(async () => {
    try {
      setLoading(true);

      const response = await LecturasServices.getHistorial({
        accion_id: accion.id,
      });
      setFilas(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [accion?.id]);

  useEffect(() => {
    dataLoad();
  }, [open, dataLoad]);

  return (
    <>
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
                  <th className="px-4 py-3">Mora</th>
                  <th className="px-4 py-3">Observacion Mora</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filas.map((lectura, index) => (
                  <tr key={`${lectura.periodo}-${index}`}>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {lectura.periodo}
                    </td>
                    <td className="px-4 py-3">{lectura.lectura_anterior}</td>
                    <td className="px-4 py-3">{lectura.lectura_actual} </td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">
                      {lectura.consumo_m3} m³
                    </td>
                    <td className="px-4 py-3">{money(lectura.precio)}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {lectura.mora}
                    </td>{' '}
                    <td className="px-4 py-3 text-slate-500">
                      {lectura.observacion_mora}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <button
                        className="bg-slate-200 p-2 rounded-2xl hover:bg-slate-300"
                        onClick={() => {
                          openModal(MODALS.EDIT, lectura);
                        }}
                      >
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filas.length && (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No hay lecturas registradas.
            </p>
          )}
        </div>
        <EditarMora
          lectura={modalState.data}
          open={isModalOpen(MODALS.EDIT)}
          onClose={closeModal}
          onSaved={() => {
            dataLoad();
          }}
        />
      </FormModal>
    </>
  );
}
