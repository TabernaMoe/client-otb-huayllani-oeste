import { useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import DataTable from '../../../components/DataTable';
import PageHeader from '../../../components/PageHeader';
import HistorialLecturasModal from '../components/HistorialLecturasModal';
import LecturaModal from '../components/LecturaModal';
import { LecturasServices } from '../services/lecturas.services';

export default function LecturasPage() {
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'create', accion: null });
  const [historial, setHistorial] = useState({ open: false, accion: null });

  const fetchLecturas = async () => {
    setLoading(true);
    const response = await LecturasServices.getAll({ page, limit, search: query });
    setLoading(false);

    if (!response.ok) return toast.error(response.message);

    setAcciones(response.data);
    setTotal(response.total);
    setTotalPages(response.totalPages);
  };

  useEffect(() => {
    fetchLecturas();
  }, [page, limit, query]);

  const openModal = (mode, accion) => setModal({ open: true, mode, accion });
  const closeModal = () => setModal({ open: false, mode: 'create', accion: null });

  const openHistorial = async (accion) => {
    const response = await LecturasServices.getById(accion.id);
    if (!response.ok) return toast.error(response.message);
    setHistorial({ open: true, accion: response.data });
  };

  const columns = [
      {
        header: 'Acción',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">#{row.original.codigo_interno}</p>
            <p className="text-xs text-slate-500">{row.original.estado}</p>
          </div>
        ),
      },
      {
        accessorKey: 'nombre_completo',
        header: 'Socio',
      },
      {
        accessorKey: 'nro_medidor',
        header: 'Medidor',
      },
      {
        accessorKey: 'nombre_calle',
        header: 'Calle',
      },
      {
        accessorKey: 'nombre_tarifa',
        header: 'Tarifa',
      },
      {
        header: 'Última lectura',
        cell: ({ row }) => {
          const lectura = row.original.lecturas[0];
          return lectura ? `${lectura.lectura_actual} m³` : 'Pendiente';
        },
      },
      {
        header: 'Consumo',
        cell: ({ row }) => {
          const lectura = row.original.lecturas[0];
          return lectura ? `${lectura.consumo_m3} m³` : '-';
        },
      },
      {
        header: 'Acciones',
        cell: ({ row }) => {
          const accion = row.original;
          const tieneLectura = accion.lecturas.length > 0;

          return (
            <div className="flex items-center gap-2">
              <ActionButton title="Registrar lectura" onClick={() => openModal('create', accion)}>
                <PlusIcon className="h-4 w-4" />
              </ActionButton>

              <ActionButton title="Historial" onClick={() => openHistorial(accion)}>
                <ClockIcon className="h-4 w-4" />
              </ActionButton>

              {tieneLectura && (
                <ActionButton title="Editar lectura" onClick={() => openModal('edit', accion)}>
                  <PencilSquareIcon className="h-4 w-4" />
                </ActionButton>
              )}

              <ActionButton title="Cambio de medidor" onClick={() => openModal('cambio', accion)}>
                <ArrowPathIcon className="h-4 w-4" />
              </ActionButton>
            </div>
          );
        },
      },
  ];

  return (
    <section className="space-y-5">
      <PageHeader
        title="Lecturas de agua"
        description="Registra lecturas, consulta el historial y gestiona cambios de medidor."
        action={
          <button
            type="button"
            onClick={fetchLecturas}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        }
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(search.trim());
        }}
        className="flex max-w-xl gap-2"
      >
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar socio, medidor o acción"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Buscar
        </button>
      </form>

      <DataTable
        data={acciones}
        columns={columns}
        loading={loading}
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
      />

      <LecturaModal
        {...modal}
        onClose={closeModal}
        onSaved={fetchLecturas}
      />

      <HistorialLecturasModal
        {...historial}
        onClose={() => setHistorial({ open: false, accion: null })}
      />
    </section>
  );
}

function ActionButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700"
    >
      {children}
    </button>
  );
}
