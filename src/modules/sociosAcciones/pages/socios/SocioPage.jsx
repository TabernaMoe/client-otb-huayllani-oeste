import { useMemo, useState, useEffect } from 'react';

import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import DataTable from '../../../../components/DataTable';
import InputField from '../../../../components/InputField';
import { toast } from 'react-toastify';

import ConfirmModals from '../../../../components/ConfirmModal';
import { SocioServices as Servs } from '../../services/socio.services';

export default function SocioPage() {
  const [filas, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  //
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });
  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'ci_socio',
        cell: (info) => info.row.original.ci_socio,
      },
      {
        accessorKey: 'ci_expedido_socio',
        header: 'ci_expedido_socio',
        cell: (info) => info.row.original.ci_expedido_socio,
      },
      {
        accessorKey: 'nombres_socio',
        header: 'nombres_socio',
        cell: (info) => info.row.original.nombres_socio,
      },
      {
        accessorKey: 'primer_apellido_socio',
        header: 'primer_apellido_socio',
        cell: (info) => info.row.original.primer_apellido_socio,
      },
      {
        accessorKey: 'segundo_apellido_socio',
        header: 'segundo_apellido_socio',
        cell: (info) => info.row.original.segundo_apellido_socio,
      },
      {
        accessorKey: 'numero_celular_socio',
        header: 'numero_celular_socio',
        cell: (info) => info.row.original.numero_celular_socio,
      },
      {
        accessorKey: 'numero_telefono_socio',
        header: 'numero_telefono_socio',
        cell: (info) => info.row.original.numero_telefono_socio,
      },
      {
        accessorKey: 'genero_socio',
        header: 'genero_socio',
        cell: (info) => info.row.original.genero_socio,
      },
      {
        accessorKey: 'estado_accion',
        header: 'estado_accion',
        cell: (info) => info.row.original.estado_accion,
      },
      {
        accessorKey: 'direccion_socio',
        header: 'direccion_socio',
        cell: (info) => info.row.original.direccion_socio,
      },
      {
        id: 'acciones',
        accessorKey: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <button
              className="rounded-xl bg-white px-3 py-2 text-reen-900 ring-1 ring-green-900 hover:bg-emerald-100"
              onClick={() => {}}
            >
              Detalles
            </button>
            <button
              type="button"
              className="rounded-xl bg-green-800 px-3 py-2 text-white hover:bg-green-900"
              onClick={() => {}}
            >
              Editar
            </button>
            <button
              className="rounded-xl bg-[#bb9457] px-3 py-2 text-white hover:bg-[#a67c3f]"
              onClick={() => {}}
            >
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const fetchFilas = async () => {
    try {
      setLoading(true);
      const response = await Servs.getAll(
        pagination.page,
        pagination.limit,
        searchInput,
      );
      if (response.ok) {
        setFila(response?.data || []);
        setPagination((prev) => ({
          ...prev,
          page: response?.pagination?.page || prev.page,
          totalItems: response?.pagination?.totalItems || 0,
          totalPages: response?.pagination?.totalPages || 1,
        }));
      }
      if (!response.ok) {
        toast.error(response.message || 'Error al cargar los datos');
      }
    } catch (error) {
      toast.error(error.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCleanFiltros = () => {
    const clean = initialValues();
    setDataRangeFechas(clean);

    fetchFilas(clean);
  };

  useEffect(() => {
    fetchFilas();
  }, [pagination.page, pagination.limit, searchInput]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text">Socios</h2>
        <button
          className="rounded-xl bg-emerald-800 px-10 py-2 text-white hover:bg-emerald-900"
          onClick={() => {}}
        >
          Nuevo registro
        </button>
      </div>
      <div className="rounded-lg border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* Buscador */}
          <div className="w-full md:max-w-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Buscar
            </label>

            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-900
            focus:border-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-200"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={filas}
        columns={columns}
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
    </>
  );
}
