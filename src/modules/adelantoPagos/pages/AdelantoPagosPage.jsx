import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowPathIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import DataTable from '../../../components/DataTable';
import { AdelantoPagosServices as Servs } from '../services/adelantoPagos.services';

export default function AdelantoPagosPage() {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const cargarAcciones = useCallback(async () => {
    setLoading(true);

    const response = await Servs.getAccionesPasivas({
      page: pagination.page,
      limit: pagination.limit,
      search,
    });

    if (response.ok) {
      setAcciones(response.data || []);
      setPagination((prev) => ({
        ...prev,
        page: response.page || prev.page,
        limit: response.limit || prev.limit,
        totalItems: response.total || 0,
        totalPages: response.totalPages || 1,
      }));
    }

    setLoading(false);
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    cargarAcciones();
  }, [cargarAcciones]);

  const handleBuscar = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearch(searchInput.trim());
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'codigo_interno',
        header: 'Código',
        cell: ({ row }) => (
          <p className="font-semibold text-slate-900">
            {row.original.codigo_interno}
          </p>
        ),
      },
      {
        accessorKey: 'nombre_completo',
        header: 'Socio',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-900">
              {row.original.nombre_completo}
            </p>
            {row.original.nro_medidor && (
              <p className="text-xs text-slate-400">
                Medidor: {row.original.nro_medidor}
              </p>
            )}
          </div>
        ),
      },
      { accessorKey: 'nombre_calle', header: 'Calle' },
      { accessorKey: 'nombre_tarifa', header: 'Tarifa' },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: () => (
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            PASIVO
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Acciones de agua
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Adelanto de pagos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Listado de acciones pasivas habilitadas para el flujo de adelanto de mantenimiento.
        </p>
      </header>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <div className="flex items-start gap-3">
          <BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            El listado de acciones pasivas ya queda preparado. El documento de API entregado no incluye todavía un endpoint para registrar meses adelantados, por lo que esta pantalla no inventa una operación de pago que el backend no expone.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Buscar acción pasiva
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleBuscar()}
                placeholder="Socio, código o medidor..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBuscar}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={cargarAcciones}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <ArrowPathIcon
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={acciones}
        columns={columns}
        loading={loading}
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) =>
          setPagination((prev) => ({ ...prev, page: 1, limit }))
        }
      />
    </section>
  );
}
