import { useState, useEffect, useMemo } from 'react';
import {
  ClockIcon,
  PencilSquareIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import FormModal from '../../../components/FormModal';
import { LecturasServices } from '../services/lecturas.services';
import EditarLecturaModal from './EditarLecturaModal';

const money = (value) =>
  value == null || !Number.isFinite(Number(value))
    ? '—'
    : `Bs ${Number(value).toFixed(2)}`;

// Convierte el periodo a un valor comparable.
// Soporta YYYY-MM, YYYY-MM-DD, MM/YYYY y "Octubre 2026".
const obtenerOrdenPeriodo = (periodo) => {
  const valor = String(periodo ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const iso = valor.match(/^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/);

  if (iso) {
    return Number(iso[1]) * 100 + Number(iso[2]);
  }

  const inverso = valor.match(/^(\d{1,2})[-/](\d{4})$/);

  if (inverso) {
    return Number(inverso[2]) * 100 + Number(inverso[1]);
  }

  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const texto = valor.match(/^([a-z]+)(?:\s+de)?\s+(\d{4})$/);

  if (texto) {
    const mes = meses.indexOf(texto[1]);
    if (mes !== -1) {
      return Number(texto[2]) * 100 + mes + 1;
    }
  }

  return null;
};

export default function HistorialLecturasModal({
  open,
  accion,
  accion_id,
  onClose,
  onEditarLectura,
}) {
  const [loading, setLoading] = useState(false);
  const [filas, setFilas] = useState([]);
  const [error, setError] = useState('');

  const [datosLectura, setDatosLectura] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!open || !accion_id) return;

    let activo = true;

    const dataLoad = async () => {
      try {
        setLoading(true);
        setError('');
        setFilas([]);

        const response = await LecturasServices.getHistorial({
          accion_id,
        });

        if (!activo) return;

        setFilas(Array.isArray(response.data) ? response.data : []);
      } catch (e) {
        if (!activo) return;
        setError('No se pudo cargar el historial de lecturas.');
      } finally {
        if (activo) setLoading(false);
      }
    };

    dataLoad();

    return () => {
      activo = false;
    };
  }, [open, accion_id]);

  // Ordenar del periodo más reciente al más antiguo.
  const lecturasOrdenadas = useMemo(() => {
    return [...filas].sort((a, b) => {
      const periodoA = obtenerOrdenPeriodo(a.periodo);
      const periodoB = obtenerOrdenPeriodo(b.periodo);

      if (periodoA === null || periodoB === null) return 0;

      return periodoB - periodoA;
    });
  }, [filas]);

  const handleOpenEditarLectura = (lectura) => {
    setOpenModal(true);
    setDatosLectura(lectura);
  };

  return (
    <>
      <FormModal
        open={open}
        title="Historial de lecturas"
        description={`${accion?.nombre_completo ?? ''} · Acción #${accion?.codigo_interno ?? ''}`}
        onClose={onClose}
      >
        <div className="space-y-5">
          {/* Información */}

          {/* Tabla */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-800">
                  Registro histórico
                </h3>
              </div>

              <span className="text-xs text-slate-500">
                Más recientes primero
              </span>
            </div>

            <div className="max-h-[55vh] overflow-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">Periodo</th>
                    <th className="px-4 py-3 text-center">Anterior</th>
                    <th className="px-4 py-3 text-center">Actual</th>
                    <th className="px-4 py-3 text-center">Consumo</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3">Observación</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          {Array.from({ length: 7 }).map((_, col) => (
                            <td key={col} className="px-4 py-5">
                              <div className="h-4 rounded bg-slate-100" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : lecturasOrdenadas.map((lectura, index) => {
                        // Solo las dos últimas lecturas.
                        const editable = index < 2;

                        return (
                          <tr
                            key={lectura.id ?? `${lectura.periodo}-${index}`}
                            className={`transition-colors hover:bg-slate-50 ${
                              editable ? 'bg-emerald-50/20' : ''
                            }`}
                          >
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1.5">
                                <span className="font-bold text-slate-800">
                                  {lectura.periodo}
                                </span>

                                {editable && (
                                  <span className="w-fit rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                    Editable
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-center text-slate-600">
                              {lectura.lectura_anterior}
                            </td>

                            <td className="px-4 py-4 text-center font-semibold text-slate-900">
                              {lectura.lectura_actual}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 font-bold text-blue-700">
                                {lectura.consumo_m3} m³
                              </span>
                            </td>

                            <td className="px-4 py-4 text-right font-semibold text-slate-800">
                              {money(lectura.precio)}
                            </td>

                            <td className="max-w-[220px] px-4 py-4 text-xs leading-relaxed text-slate-500">
                              {lectura.observacion || 'Sin observaciones'}
                            </td>

                            <td className="px-4 py-4 text-center">
                              {editable ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenEditarLectura?.(lectura)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Editar lectura"
                                >
                                  <PencilSquareIcon className="h-4 w-4" />
                                  Editar
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                  <LockClosedIcon className="h-4 w-4" />
                                  Bloqueada
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>

            {error && !loading && (
              <div className="flex flex-col items-center px-5 py-10 text-center">
                <ExclamationCircleIcon className="h-9 w-9 text-rose-400" />
                <p className="mt-2 text-sm text-rose-600">{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    // Solicitar nuevamente mediante una nueva apertura
                    onClose();
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Cerrar y volver a intentar
                </button>
              </div>
            )}
          </div>

          <p className="flex items-center gap-2 text-xs text-slate-400">
            <LockClosedIcon className="h-4 w-4" />
            Los registros antiguos están disponibles solo para consulta.
          </p>
        </div>
      </FormModal>
      <EditarLecturaModal
        open={openModal}
        lectura={datosLectura}
        onClose={() => setOpenModal(false)}
        onSave={LecturasServices.UpdateOnlyLectura}
      />
    </>
  );
}
