import { useMemo, useState, useEffect } from 'react';

import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { toast } from 'react-toastify';

import DataTable from '../../../../components/DataTable';

import SocioModal from './SocioModal';

import { SocioServices as Servs } from '../../services/socio.services';

export default function SocioPage() {
  // =========================
  // STATES
  // =========================

  // Datos tabla
  const [filas, setFila] = useState([]);

  // Loading
  const [loading, setLoading] = useState(false);

  // Input búsqueda
  const [searchInput, setSearchInput] = useState('');

  // Modal crear/editar
  const [openModal, setOpenModal] = useState(false);

  // Modal eliminar
  const [openDelete, setOpenDelete] = useState(false);

  // Socio seleccionado
  const [selectedSocio, setSelectedSocio] = useState(null);

  // =========================
  // PAGINACIÓN
  // =========================

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1,
  });

  // =========================
  // ELIMINAR
  // =========================

  const handleDelete = async () => {
    try {
      const response = await Servs.delete(
        selectedSocio.id,
      );

      if (!response.ok) {
        toast.error(
          response.message ||
            'Error al eliminar',
        );

        return;
      }

      toast.success(
        'Socio eliminado correctamente',
      );

      // cerrar modal
      setOpenDelete(false);

      // limpiar seleccionado
      setSelectedSocio(null);

      // recargar tabla
      fetchFilas();
    } catch (error) {
      toast.error(
        error.message || 'Error inesperado',
      );
    }
  };

  // =========================
  // COLUMNAS TABLA
  // =========================

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ci_socio',
        header: 'CI',
        cell: (info) =>
          info.row.original.ci_socio,
      },

      {
        accessorKey:
          'ci_expedido_socio',

        header: 'Expedido',

        cell: (info) =>
          info.row.original
            .ci_expedido_socio,
      },

      {
  accessorKey: 'nombre_completo',

  header: 'Nombre completo',

  cell: (info) => {

    const socio = info.row.original;

    return `
      ${socio.nombres_socio}
      ${socio.primer_apellido_socio}
      ${socio.segundo_apellido_socio}
    `;
  },
},

      {
        accessorKey:
          'numero_celular_socio',

        header: 'Celular',

        cell: (info) =>
          info.row.original
            .numero_celular_socio,
      },

      {
        accessorKey:
          'numero_telefono_socio',

        header: 'Teléfono',

        cell: (info) =>
          info.row.original
            .numero_telefono_socio,
      },

      {
        accessorKey: 'genero_socio',

        header: 'Género',

        cell: (info) =>
          info.row.original
            .genero_socio,
      },

      {
        accessorKey: 'estado_accion',

        header: 'Estado',

        cell: (info) =>
          info.row.original
            .estado_accion,
      },

      {
        accessorKey:
          'direccion_socio',

        header: 'Dirección',

        cell: (info) =>
          info.row.original
            .direccion_socio,
      },

      // =========================
      // BOTONES ACCIONES
      // =========================

      {
        id: 'acciones',

        accessorKey: 'acciones',

        header: 'Acciones',

        cell: ({ row }) => (
          <div className="flex flex-col gap-2">

            {/* EDITAR */}
            <button
              type="button"
              className="
                rounded-xl
                bg-green-800
                px-3 py-2
                text-white
                hover:bg-green-900
              "
              onClick={() => {

                // guardar fila seleccionada
                setSelectedSocio(
                  row.original,
                );

                // abrir modal
                setOpenModal(true);
              }}
            >
              Editar
            </button>

            {/* ELIMINAR */}
            <button
              className="
                rounded-xl
                bg-red-700
                px-3 py-2
                text-white
                hover:bg-red-800
              "
              onClick={() => {

                // guardar fila seleccionada
                setSelectedSocio(
                  row.original,
                );

                // abrir modal eliminar
                setOpenDelete(true);
              }}
            >
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  // =========================
  // OBTENER DATOS
  // =========================

  const fetchFilas = async () => {
    try {
      setLoading(true);

      const response =
        await Servs.getAll(
          pagination.page,
          pagination.limit,
          searchInput,
        );

      if (response.ok) {
        setFila(response?.data || []);

        setPagination((prev) => ({
          ...prev,

          page:
            response?.pagination
              ?.page || prev.page,

          totalItems:
            response?.pagination
              ?.totalItems || 0,

          totalPages:
            response?.pagination
              ?.totalPages || 1,
        }));
      }

      if (!response.ok) {
        toast.error(
          response.message ||
            'Error al cargar datos',
        );
      }
    } catch (error) {
      toast.error(
        error.message ||
          'Error al cargar datos',
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // useEffect
  // =========================

  useEffect(() => {
    fetchFilas();
  }, [
    pagination.page,
    pagination.limit,
    searchInput,
  ]);

  // =========================
  // RENDER
  // =========================

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          Socios
        </h2>

        {/* NUEVO REGISTRO */}
        <button
          className="
            rounded-xl
            bg-emerald-800
            px-10 py-2
            text-white
            hover:bg-emerald-900
          "
          onClick={() => {

            // limpiar seleccionado
            setSelectedSocio(null);

            // abrir modal
            setOpenModal(true);
          }}
        >
          Nuevo registro
        </button>
      </div>

      {/* BUSCADOR */}
      <div
        className="
          rounded-lg
          border-2
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="w-full md:max-w-sm">

          <label
            className="
              mb-2 block
              text-sm font-semibold
              text-slate-700
            "
          >
            Buscar
          </label>

          <div className="relative">

            <MagnifyingGlassIcon
              className="
                pointer-events-none
                absolute left-3 top-1/2
                h-5 w-5
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Buscar..."
              value={searchInput}
              onChange={(e) =>
                setSearchInput(
                  e.target.value,
                )
              }
              className="
                w-full rounded-2xl
                border border-slate-300
                bg-white
                py-2 pl-10 pr-10
                text-sm text-slate-900
              "
            />

            {searchInput && (
              <button
                type="button"
                onClick={() =>
                  setSearchInput('')
                }
                className="
                  absolute right-2 top-1/2
                  -translate-y-1/2
                  rounded-full
                  p-1
                "
              >
                <XMarkIcon
                  className="h-4 w-4"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLA */}
      <DataTable
        data={filas}
        columns={columns}
        loading={loading}
        page={pagination.page}
        totalPages={
          pagination.totalPages
        }
        totalItems={
          pagination.totalItems
        }

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

      {/* MODAL CREAR/EDITAR */}
      <SocioModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        socio={selectedSocio}
        onSuccess={() => {

          // cerrar modal
          setOpenModal(false);

          // recargar tabla
          fetchFilas();
        }}
      />

      {/* MODAL ELIMINAR */}
      {openDelete &&
        selectedSocio && (
          <div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/40
            "
          >
            <div
              className="
                w-full max-w-md
                rounded-2xl
                bg-white
                p-6
              "
            >
              <h2
                className="
                  text-xl font-bold
                "
              >
                Confirmar eliminación
              </h2>

              <p className="mt-4">
                ¿Deseas eliminar a:

                {' '}

                <strong>
                  {
                    selectedSocio.nombres_socio
                  }
                </strong>

                ?
              </p>

              <div
                className="
                  mt-6
                  flex justify-end
                  gap-3
                "
              >
                <button
                  onClick={() =>
                    setOpenDelete(false)
                  }
                  className="
                    rounded-xl
                    border
                    px-4 py-2
                  "
                >
                  Cancelar
                </button>

                <button
                  onClick={handleDelete}
                  className="
                    rounded-xl
                    bg-red-700
                    px-4 py-2
                    text-white
                  "
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}