import { useEffect, useMemo, useState } from 'react';
import {
  EyeIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../../components/DataTable';

import { HistorialCobrosServices as Servs } from '../../HistorialCobros.services';

export default function HistorialByAccionModal({ open, id, onClose }) {
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'tipo_cobro',
        header: 'TIPOS DE COBRO',
      },
      {
        accessorKey: 'concepto',
        header: 'CONCEPT',
      },

      {
        accessorKey: 'descripcion',
        header: 'DESCRIPCION',
      },

      {
        accessorKey: 'monto_total',
        header: 'MONTO TOTAL',
      },
      {
        accessorKey: 'monto_pagado',
        header: 'MONTO PAGADO',
      },
      {
        accessorKey: 'saldo',
        header: 'SALDO',
      },
      {
        accessorKey: 'estado',
        header: 'ESTADO',
      },
    ],
    [],
  );

  const fetchFilas = async () => {
    try {
      setLoading(true);
      const response = await Servs.getHitorialAccion(
        id,
        pagination.page,
        pagination.limit,
        searchInput,
      );
      if (response.ok) {
        setFila(response?.data || []);
        setPagination((prev) => ({
          ...prev,
          page: response?.page || prev.page,
          totalItems: response?.total || 0,
          totalPages: response?.totalPages || 1,
        }));
      }

      if (!response.ok) {
        toast.error(response.message || 'Error al cargar datos');
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!open || !id) return;
    fetchFilas();
  }, [pagination.page, pagination.limit, searchInput, id]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Fondo */}
        <div
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Contenedor */}
        <div
          className="
            relative z-10
            flex
            max-h-[95vh]
            w-full
            max-w-6xl
            flex-col
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-2xl
          "
        >
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                HISTORIAL DE PAGOS DE LA COBROS
              </h3>
            </div>
          </div>
          <div>
            {/* <div className="mb-4">
              <h4 className="text-base font-semibold text-slate-900">
                HISTORIAL DE COBROS
              </h4>
            </div> */}

            <DataTable
              data={filas}
              columns={columns}
              loading={loading}
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={(newPage) =>
                setPagination((prev) => ({
                  ...prev,
                  page: newPage,
                }))
              }
              limit={pagination.limit}
              onLimitChange={(newLimit) =>
                setPagination((prev) => ({
                  ...prev,
                  page: 1,
                  limit: Number(newLimit),
                }))
              }
            />
          </div>

          {/* FOOTER */}
          <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  rounded-xl
                  bg-red-700
                  px-5 py-2.5
                  font-medium
                  text-white
                  transition
                  hover:bg-red-800
                  disabled:opacity-50
                "
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
